"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Share2, VolumeIcon as VolumeUp, RefreshCw } from "lucide-react"
import { getRandomVerse, type Verse, getVerseRecitation } from "@/lib/api"
import { getLanguage } from "@/lib/language"
import { addBookmark, isBookmarked } from "@/lib/bookmarks"
import { Bookmark } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DailyAyah() {
  const [verse, setVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()
  const audioRef = useState<HTMLAudioElement | null>(null)

  const fetchRandomVerse = async () => {
    setLoading(true)
    setError(null)
    try {
      const language = getLanguage()
      const randomVerse = await getRandomVerse(language)
      if (randomVerse) {
        setVerse(randomVerse)
        setBookmarked(isBookmarked(randomVerse.verse_key))

        // Get audio for this verse
        try {
          const audio = await getVerseRecitation(7, randomVerse.verse_key) // 7 is Mishary Rashid Alafasy
          setAudioUrl(audio)
        } catch (audioError) {
          console.error("Error fetching audio:", audioError)
          // Continue without audio if there's an error
          toast({
            title: "Audio Unavailable",
            description: "Could not load audio for this verse. You can still read the text.",
            duration: 5000,
          })
        }
      } else {
        setError("Could not load a random verse. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching random verse:", error)
      setError("There was an error loading the daily verse. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRandomVerse()
  }, [])

  useEffect(() => {
    if (audioUrl) {
      audioRef[1](new Audio(audioUrl))
    }

    return () => {
      if (audioRef[0]) {
        audioRef[0].pause()
        audioRef[0].src = ""
      }
    }
  }, [audioUrl])

  const handleCopy = () => {
    if (!verse) return

    const textToCopy = `${verse.text_uthmani}\n\n${verse.translations[0]?.text}\n\n(Quran ${verse.verse_key})`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Copied to clipboard",
      description: "The verse has been copied to your clipboard.",
      duration: 3000,
    })
  }

  const handleBookmark = () => {
    if (!verse) return

    try {
      if (!bookmarked) {
        addBookmark({
          verseKey: verse.verse_key,
          chapterName: verse.verse_key.split(":")[0],
          verseText: verse.text_uthmani,
          translation: verse.translations[0]?.text || "",
        })
        setBookmarked(true)
        toast({
          title: "Bookmark added",
          description: `Verse ${verse.verse_key} has been bookmarked.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "Already bookmarked",
          description: "This verse is already in your bookmarks.",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Already bookmarked",
        description: "This verse is already in your bookmarks.",
        duration: 3000,
      })
    }
  }

  const handlePlay = () => {
    if (!audioRef[0]) {
      toast({
        title: "Audio Unavailable",
        description: "Audio could not be loaded for this verse.",
        duration: 3000,
      })
      return
    }

    if (isPlaying) {
      audioRef[0].pause()
    } else {
      audioRef[0].play().catch((err) => {
        console.error("Error playing audio:", err)
        toast({
          title: "Playback Error",
          description: "There was an error playing the audio. Please try again.",
          duration: 3000,
        })
      })
    }
    setIsPlaying(!isPlaying)
  }

  const handleShare = () => {
    if (!verse) return

    if (navigator.share) {
      navigator
        .share({
          title: `Quran Verse ${verse.verse_key}`,
          text: `${verse.text_uthmani}\n\n${verse.translations[0]?.text}\n\n(Quran ${verse.verse_key})`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err)
          handleCopy() // Fallback to copy
        })
    } else {
      handleCopy() // Fallback to copy
    }
  }

  useEffect(() => {
    const audio = audioRef[0]
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioRef[0]])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border bg-background p-6 shadow-sm animate-pulse">
        <div className="mb-6 text-center">
          <div className="mb-4 h-8 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border bg-background p-6 shadow-sm">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={fetchRandomVerse} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!verse) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border bg-background p-6 shadow-sm">
        <p className="text-center text-muted-foreground mb-4">Could not load daily verse. Please try again later.</p>
        <div className="text-center">
          <Button onClick={fetchRandomVerse} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-6 text-center">
        <p className="mb-4 text-2xl font-arabic leading-relaxed text-emerald-800 dark:text-emerald-200" dir="rtl">
          {verse.text_uthmani}
        </p>
        <p className="text-lg text-muted-foreground">{verse.translations[0]?.text}</p>
        <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Surah {verse.verse_key.split(":")[0]} : Verse {verse.verse_number}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={handlePlay} disabled={!audioUrl}>
          <VolumeUp className="h-4 w-4" />
          {isPlaying ? "Pause" : "Listen"}
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1 ${bookmarked ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-200" : ""}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-emerald-600 dark:fill-emerald-200" : ""}`} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
      {audioUrl && (
        <div className="mt-4 text-center">
          <a
            href={audioUrl}
            download={`quran-verse-${verse.verse_key}.mp3`}
            className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Download Audio
          </a>
        </div>
      )}
    </div>
  )
}
