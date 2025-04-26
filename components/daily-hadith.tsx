"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Share2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Hadith {
  id: number
  title: string
  text: string
  source: string
  narrator: string
}

// Fallback hadiths to use when API fails
const fallbackHadiths: Hadith[] = [
  {
    id: 1,
    title: "On Good Character",
    text: "The Prophet Muhammad (peace be upon him) said: 'The most perfect of believers in faith are those who are best in character, and the best of you are those who are best to their wives.'",
    source: "Tirmidhi",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 2,
    title: "On Kindness",
    text: "The Prophet Muhammad (peace be upon him) said: 'Allah is Kind and loves kindness in all matters.'",
    source: "Sahih Bukhari",
    narrator: "Aisha (RA)",
  },
  {
    id: 3,
    title: "On Seeking Knowledge",
    text: "The Prophet Muhammad (peace be upon him) said: 'Seeking knowledge is an obligation upon every Muslim.'",
    source: "Sunan Ibn Majah",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    id: 4,
    title: "On Charity",
    text: "The Prophet Muhammad (peace be upon him) said: 'The believer's shade on the Day of Resurrection will be his charity.'",
    source: "Musnad Ahmad",
    narrator: "Uqbah ibn Amir (RA)",
  },
  {
    id: 5,
    title: "On Patience",
    text: "The Prophet Muhammad (peace be upon him) said: 'Patience is illumination.'",
    source: "Sahih Muslim",
    narrator: "Abu Malik Al-Ashari (RA)",
  },
  {
    id: 6,
    title: "On Truthfulness",
    text: "The Prophet Muhammad (peace be upon him) said: 'Truthfulness leads to righteousness, and righteousness leads to Paradise.'",
    source: "Sahih Bukhari & Muslim",
    narrator: "Abdullah ibn Masud (RA)",
  },
  {
    id: 7,
    title: "On Anger",
    text: "The Prophet Muhammad (peace be upon him) said: 'The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.'",
    source: "Sahih Bukhari",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 8,
    title: "On Smiling",
    text: "The Prophet Muhammad (peace be upon him) said: 'Your smile for your brother is charity.'",
    source: "Tirmidhi",
    narrator: "Abu Dharr (RA)",
  },
  {
    id: 9,
    title: "On Moderation",
    text: "The Prophet Muhammad (peace be upon him) said: 'Do good deeds properly, sincerely and moderately. Always adopt a middle, moderate, regular course, whereby you will reach your target (of paradise).'",
    source: "Sahih Bukhari",
    narrator: "Abu Hurairah (RA)",
  },
  {
    id: 10,
    title: "On Neighbors",
    text: "The Prophet Muhammad (peace be upon him) said: 'He who believes in Allah and the Last Day should be generous to his neighbor.'",
    source: "Sahih Bukhari & Muslim",
    narrator: "Abu Hurairah (RA)",
  },
]

export function DailyHadith() {
  const [hadith, setHadith] = useState<Hadith | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchHadith = async () => {
    setIsLoading(true)

    try {
      // Check if we have a cached hadith for today
      const today = new Date().toDateString()
      const cachedData = localStorage.getItem("dailyHadith")

      if (cachedData) {
        const { hadith: cachedHadith, date } = JSON.parse(cachedData)

        // If the cached hadith is from today, use it
        if (date === today) {
          setHadith(cachedHadith)
          setIsLoading(false)
          return
        }
      }

      // Instead of relying on an external API, use our fallback data
      // Select a random hadith from the fallback list
      const randomIndex = Math.floor(Math.random() * fallbackHadiths.length)
      const selectedHadith = fallbackHadiths[randomIndex]

      setHadith(selectedHadith)

      // Cache the hadith for today
      localStorage.setItem(
        "dailyHadith",
        JSON.stringify({
          hadith: selectedHadith,
          date: today,
        }),
      )
    } catch (error) {
      console.error("Error fetching hadith:", error)

      // Use the first fallback hadith as a last resort
      setHadith(fallbackHadiths[0])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHadith()
  }, [])

  const handleShare = async () => {
    if (!hadith) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: hadith.title,
          text: `${hadith.text} - ${hadith.narrator} (${hadith.source})`,
          url: window.location.href,
        })
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(`${hadith.title}\n\n${hadith.text}\n\n- ${hadith.narrator} (${hadith.source})`)
        toast({
          title: "Copied to clipboard",
          description: "The hadith has been copied to your clipboard.",
        })
      }
    } catch (error) {
      console.error("Error sharing hadith:", error)
      toast({
        title: "Sharing failed",
        description: "There was an error sharing the hadith.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Daily Hadith</span>
          <Button variant="ghost" size="sm" onClick={fetchHadith} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardTitle>
        <CardDescription>Wisdom from the Prophet Muhammad (ﷺ)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : hadith ? (
          <div className="space-y-4">
            <h3 className="font-medium">{hadith.title}</h3>
            <p className="text-sm">{hadith.text}</p>
            <div className="text-xs text-muted-foreground">
              <p>Narrator: {hadith.narrator}</p>
              <p>Source: {hadith.source}</p>
            </div>
          </div>
        ) : null}
      </CardContent>
      {hadith && !isLoading && (
        <CardFooter>
          <Button variant="outline" size="sm" className="ml-auto" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
