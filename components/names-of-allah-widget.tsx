"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, RefreshCw } from "lucide-react"
import Link from "next/link"
import namesData from "@/data/99-names-of-allah.json"

interface Name {
  name: string
  transliteration: string
  number: number
  found: string
  en: {
    meaning: string
    desc: string
  }
  fr: {
    meaning: string
    desc: string
  }
}

export function NamesOfAllahWidget() {
  const [currentName, setCurrentName] = useState<Name | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const getRandomName = () => {
    const names = namesData.data as Name[]
    const randomIndex = Math.floor(Math.random() * names.length)
    setCurrentName(names[randomIndex])
  }

  useEffect(() => {
    getRandomName()
  }, [])

  const playPronunciation = () => {
    if (!currentName) return

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentName.transliteration)
      utterance.lang = "ar-SA"
      utterance.rate = 0.7

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)

      speechSynthesis.speak(utterance)
    }
  }

  if (!currentName) return null

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-600" />
            Name of Allah
          </span>
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
          >
            #{currentName.number}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 arabic-text">
            {currentName.name}
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{currentName.transliteration}</div>
          <div className="text-lg font-medium text-emerald-700 dark:text-emerald-300">{currentName.en.meaning}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{currentName.en.desc}</p>

          <div className="flex gap-2 justify-center pt-4">
            <Button size="sm" variant="outline" onClick={playPronunciation} disabled={isPlaying}>
              <Volume2 className="mr-2 h-4 w-4" />
              {isPlaying ? "Playing..." : "Listen"}
            </Button>
            <Button size="sm" variant="outline" onClick={getRandomName}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Next
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Link href="/names-of-allah">
              <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                View All 99 Names →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
