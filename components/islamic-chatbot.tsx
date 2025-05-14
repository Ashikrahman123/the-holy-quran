"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, RefreshCw, Bot, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Basic Islamic knowledge for fallback responses
const basicIslamicResponses = {
  greeting: "As-salamu alaykum! How can I help you learn about Islam today?",
  error:
    "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, insha'Allah.",
  pillars:
    "The Five Pillars of Islam are: 1) Shahada (Faith), 2) Salah (Prayer), 3) Zakat (Charity), 4) Sawm (Fasting during Ramadan), and 5) Hajj (Pilgrimage to Mecca).",
  prayer:
    "Muslims pray five times a day: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).",
  quran:
    "The Quran is the holy book of Islam, believed to be the word of Allah as revealed to Prophet Muhammad through the angel Gabriel over 23 years.",
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    } catch (error) {
      console.error("Error getting response:", error)

      // Set API error message
      if (error instanceof Error) {
        setApiError(error.message)
      } else {
        setApiError("An unknown error occurred")
      }

      // Add a fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: basicIslamicResponses.error,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackMessage])

      toast({
        title: "Connection Issue",
        description: "Having trouble connecting to the Islamic knowledge base.",
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

      // Provide fallback responses based on keywords
      const lowercaseInput = userInput.toLowerCase()

      if (lowercaseInput.includes("pillar") || lowercaseInput.includes("foundation")) {
        return basicIslamicResponses.pillars
      } else if (lowercaseInput.includes("pray") || lowercaseInput.includes("salah")) {
        return basicIslamicResponses.prayer
      } else if (lowercaseInput.includes("quran") || lowercaseInput.includes("book")) {
        return basicIslamicResponses.quran
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          Islamic Assistant
        </CardTitle>
        <CardDescription>Ask questions about Islam and Islamic practices</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {apiError && (
          <Alert variant="destructive" className="mx-4 mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {apiError}. The system will use fallback responses until the connection is restored.
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
