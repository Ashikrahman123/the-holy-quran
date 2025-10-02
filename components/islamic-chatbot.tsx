"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, RefreshCw, Bot, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getBasicResponse } from "@/lib/islamic-knowledge"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function IslamicChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "As-salamu alaykum! I'm your Islamic assistant. How can I help you learn about Islam today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "checking">("checking")
  const [retryCount, setRetryCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus()
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Check if we can connect to the API
  const checkConnectionStatus = async () => {
    setConnectionStatus("checking")
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch("/api/chat/health", {
        method: "GET",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setConnectionStatus("online")
        setApiError(null)
      } else {
        setConnectionStatus("offline")
        setApiError("Connection to Islamic knowledge base is currently unavailable")
      }
    } catch (error) {
      console.error("Connection check failed:", error)
      setConnectionStatus("offline")
      setApiError("Unable to connect to Islamic knowledge base")
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Clear any previous errors
    setApiError(null)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Get response from Grok AI
      const response = await getGrokResponse(
        messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        input,
      )

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Reset retry count on success
      if (retryCount > 0) {
        setRetryCount(0)
        setConnectionStatus("online")
        toast({
          title: "Connection Restored",
          description: "Successfully reconnected to the Islamic knowledge base.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error getting response:", error)
      setRetryCount((prev) => prev + 1)

      // Set connection status
      setConnectionStatus("offline")

      // Set API error message
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        setApiError("An unknown error occurred")
      }

      // Get fallback response based on user's query
      const fallbackResponse = getBasicResponse(input)

      // Add a fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackMessage])

      toast({
        title: "Connection Issue",
        description: "Using offline knowledge base. Some information may be limited.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getGrokResponse = async (previousMessages: { role: string; content: string }[], userInput: string) => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...previousMessages, { role: "user", content: userInput }],
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.response) {
        throw new Error("No response received from AI")
      }

      return data.response
    } catch (error) {
      console.error("Error fetching from API:", error)

      // Check if it's an AbortError (timeout)
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.")
      }

      // If we've already tried multiple times, use the fallback knowledge
      if (retryCount >= 2) {
        return getBasicResponse(userInput)
      }

      throw error // Re-throw to trigger the fallback message
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "As-salamu alaykum! I'm your Islamic assistant. How can I help you learn about Islam today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
    setApiError(null)
    toast({
      title: "Chat Cleared",
      description: "All previous messages have been cleared.",
    })
  }

  const retryConnection = async () => {
    toast({
      title: "Checking Connection",
      description: "Attempting to reconnect to the Islamic knowledge base...",
    })
    await checkConnectionStatus()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-500" />
            <CardTitle>Islamic Assistant</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === "online" && (
              <div className="flex items-center text-xs text-emerald-600 gap-1">
                <Wifi className="h-3 w-3" />
                <span>Online</span>
              </div>
            )}
            {connectionStatus === "offline" && (
              <div className="flex items-center text-xs text-amber-600 gap-1">
                <WifiOff className="h-3 w-3" />
                <span>Offline</span>
              </div>
            )}
            {connectionStatus === "checking" && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Checking...</span>
              </div>
            )}
          </div>
        </div>
        <CardDescription>Ask questions about Islam and Islamic practices</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {apiError && (
          <Alert variant="destructive" className="mx-4 mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{apiError}</p>
              <p className="text-sm">Using offline knowledge base with limited information.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={retryConnection}
                disabled={connectionStatus === "checking"}
              >
                {connectionStatus === "checking" ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry Connection
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-4 pt-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarImage src="/images/bot-avatar.png" alt="AI" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Ask a question about Islam..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex w-full justify-end">
          <Button variant="ghost" size="sm" onClick={clearChat}>
            Clear Chat
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
