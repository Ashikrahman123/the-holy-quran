"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AudioContextType {
  audioUrl: string | null
  setAudioUrl: (url: string | null) => void
  isPlaying: boolean
  togglePlayPause: () => void
  title: string | null
  setTitle: (title: string | null) => void
  reciter: string | null
  setReciter: (reciter: string | null) => void
  surahNumber: number | null
  setSurahNumber: (number: number | null) => void
  progress: number
  duration: number
  currentTime: number
  setCurrentTime: (time: number) => void
  volume: number
  setVolume: (volume: number) => void
  loading: boolean
  error: string | null
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [title, setTitle] = useState<string | null>(null)
  const [reciter, setReciter] = useState<string | null>(null)
  const [surahNumber, setSurahNumber] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return

    // Clean up any existing audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current.load()
      audioRef.current = null
    }

    // Only create a new audio element if we have a URL
    if (audioUrl) {
      setLoading(true)
      setError(null)

      const audio = new Audio()
      audio.preload = "metadata"
      audio.crossOrigin = "anonymous"
      audio.volume = volume / 100

      // Set up event listeners
      audio.addEventListener("canplay", () => {
        setLoading(false)
      })

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration)
      })

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime)
        setProgress((audio.currentTime / audio.duration) * 100 || 0)
      })

      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
      })

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e)
        setLoading(false)
        setIsPlaying(false)
        setError("There was an error playing the audio. Please try a different reciter or chapter.")

        toast({
          title: "Audio Error",
          description: "There was an error playing this audio. Please try another reciter or chapter.",
          variant: "destructive",
        })

        // Try an alternative source if we have a surah number
        if (surahNumber) {
          const paddedSurah = surahNumber.toString().padStart(3, "0")
          const alternativeUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}001.mp3`

          toast({
            title: "Trying Alternative Source",
            description: "Attempting to use a backup audio source...",
          })

          audio.src = alternativeUrl

          const playPromise = audio.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true)
                setLoading(false)
                setError(null)
              })
              .catch(() => {
                setError("All audio sources failed. Please try again later.")
              })
          }
        }
      })

      audio.src = audioUrl
      audioRef.current = audio

      // Auto-play if setting a new URL
      if (isPlaying) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name === "NotAllowedError") {
              setIsPlaying(false)
              setError("Autoplay is blocked by your browser. Please click play to start audio.")
            }
          })
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [audioUrl, toast, surahNumber])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlayPause = () => {
    if (!audioUrl || !audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        setLoading(true)
        playPromise
          .then(() => {
            setIsPlaying(true)
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
            if (error.name !== "AbortError") {
              setError(`Error playing audio: ${error.message || "Unknown error"}`)

              toast({
                title: "Playback Error",
                description: "Could not play audio. Please try again.",
                variant: "destructive",
              })
            }
          })
      }
    }
  }

  return (
    <AudioContext.Provider
      value={{
        audioUrl,
        setAudioUrl,
        isPlaying,
        togglePlayPause,
        title,
        setTitle,
        reciter,
        setReciter,
        surahNumber,
        setSurahNumber,
        progress,
        duration,
        currentTime,
        setCurrentTime,
        volume,
        setVolume,
        loading,
        error,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
