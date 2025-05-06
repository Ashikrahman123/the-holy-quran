"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X, Bot, Minimize2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

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
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

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
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-emerald-600 shadow-lg hover:bg-emerald-700"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open Islamic Assistant</span>
      </Button>
    )
  }

  return (
    <Card
      className={`fixed z-50 shadow-lg transition-all duration-300 ${
        isMinimized ? "bottom-6 left-6 h-14 w-14 rounded-full" : "bottom-6 left-6 h-[500px] w-[350px] rounded-lg"
      }`}
    >
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-full w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Expand Islamic Assistant</span>
        </Button>
      ) : (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-emerald-50 p-3 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/bot-avatar.png" alt="AI" />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">Islamic Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything about Islam</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="h-4 w-4" />
                <span className="sr-only">Minimize</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[80%]">
                    {message.role === "assistant" && (
                      <Avatar className="mt-0.5 h-6 w-6">
                        <AvatarImage src="/images/bot-avatar.png" alt="AI" />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
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
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <div className="mt-2 flex justify-between">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearChat}>
                Clear chat
              </Button>
              <p className="text-xs text-muted-foreground">Powered by Islamic Knowledge</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
