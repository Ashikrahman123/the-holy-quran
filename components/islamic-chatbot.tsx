"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, RefreshCw, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Islamic knowledge base for common questions
const knowledgeBase = [
  {
    keywords: ["prayer", "salah", "pray", "namaz", "salat"],
    response:
      "Prayer (Salah) is one of the Five Pillars of Islam. Muslims pray five times a day: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night). Each prayer consists of specific movements and recitations, fostering a direct connection with Allah.",
  },
  {
    keywords: ["ramadan", "fasting", "fast", "sawm", "iftar", "suhoor"],
    response:
      "Ramadan is the ninth month of the Islamic calendar when Muslims fast from dawn until sunset. Fasting during Ramadan is one of the Five Pillars of Islam. It's a time of spiritual reflection, self-improvement, and heightened devotion.",
  },
  {
    keywords: ["zakat", "charity", "give", "donation", "alms"],
    response:
      "Zakat is one of the Five Pillars of Islam, requiring Muslims to give 2.5% of their qualifying wealth to those in need. It purifies wealth and helps establish economic justice in society.",
  },
  {
    keywords: ["hajj", "pilgrimage", "mecca", "kaaba", "umrah"],
    response:
      "Hajj is the annual Islamic pilgrimage to Mecca, Saudi Arabia, and is mandatory once in a lifetime for Muslims who are physically and financially capable. It's one of the Five Pillars of Islam and takes place during the Islamic month of Dhul Hijjah.",
  },
  {
    keywords: ["quran", "koran", "recite", "surah", "ayah", "verse"],
    response:
      "The Quran is the holy book of Islam, believed to be the word of Allah as revealed to Prophet Muhammad ﷺ through the angel Gabriel over 23 years. It consists of 114 chapters (surahs) and serves as the primary source of Islamic guidance.",
  },
  {
    keywords: ["prophet", "muhammad", "messenger", "sunnah", "hadith"],
    response:
      "Prophet Muhammad ﷺ is the final prophet in Islam, who received and transmitted the Quran. His life, actions, and sayings (Hadith) form the Sunnah, which is the second source of Islamic law and guidance after the Quran.",
  },
  {
    keywords: ["halal", "haram", "permissible", "forbidden", "allowed", "prohibited"],
    response:
      "In Islam, actions and foods are categorized as halal (permissible) or haram (forbidden). This system guides Muslims in making choices aligned with Islamic principles, covering aspects from diet to business transactions.",
  },
  {
    keywords: ["iman", "faith", "belief", "pillars of faith", "believe"],
    response:
      "Iman (faith) in Islam involves belief in: 1) Allah, 2) His Angels, 3) His Books, 4) His Messengers, 5) The Day of Judgment, and 6) Divine Decree. These six articles form the foundation of a Muslim's faith.",
  },
  {
    keywords: ["dhikr", "remembrance", "tasbeeh", "subhanallah", "alhamdulillah", "allahu akbar"],
    response:
      "Dhikr refers to the remembrance of Allah through phrases like 'SubhanAllah' (Glory be to Allah), 'Alhamdulillah' (All praise is due to Allah), and 'Allahu Akbar' (Allah is the Greatest). Regular dhikr purifies the heart and brings one closer to Allah.",
  },
  {
    keywords: ["dua", "supplication", "pray", "asking", "request"],
    response:
      "Dua is a personal supplication to Allah, where Muslims can ask for anything in their own words. It's a direct conversation with Allah and can be made at any time, though there are specific times when duas are more likely to be accepted.",
  },
]

// Fallback responses when no match is found
const fallbackResponses = [
  "I'm still learning about Islamic topics. Could you rephrase your question?",
  "That's a good question about Islam. Let me suggest consulting with a knowledgeable imam or scholar for a more detailed answer.",
  "I don't have complete information on that specific topic. The Quran and authentic Hadith are the best sources for Islamic guidance.",
  "Islamic scholarship has various perspectives on this matter. I recommend researching reliable Islamic sources for a comprehensive understanding.",
  "I'm designed to provide basic information about Islam. For more detailed guidance, please consult with Islamic scholars or authentic texts.",
]

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
      // Process the message and get a response
      const response = await getResponse(input)

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
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getResponse = async (query: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Convert query to lowercase for matching
    const lowercaseQuery = query.toLowerCase()

    // Check knowledge base for matching keywords
    for (const item of knowledgeBase) {
      if (item.keywords.some((keyword) => lowercaseQuery.includes(keyword))) {
        return item.response
      }
    }

    // If no match found, return a random fallback response
    const randomIndex = Math.floor(Math.random() * fallbackResponses.length)
    return fallbackResponses[randomIndex]
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
    toast({
      title: "Chat Cleared",
      description: "All previous messages have been cleared.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Islamic Assistant
        </CardTitle>
        <CardDescription>Ask questions about Islam and Islamic practices</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
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
                    <p className="text-sm">{message.content}</p>
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
