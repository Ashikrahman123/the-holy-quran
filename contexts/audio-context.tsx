"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AudioState {
  audioUrl: string | null
  title: string | null
  reciter: string | null
  surahNumber: number | null
  isPlaying: boolean
  duration: number
  currentTime: number
  progress: number
  volume: number
}

interface AudioContextType {
  audioState: AudioState
  play: (url: string, title?: string, reciter?: string, surahNumber?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  setVolume: (volume: number) => void
  seek: (time: number) => void
  next: () => void
  previous: () => void
}

const initialState: AudioState = {
  audioUrl: null,
  title: null,
  reciter: null,
  surahNumber: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  progress: 0,
  volume: 80,
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioState, setAudioState] = useState<AudioState>(initialState)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  // Restore audio state from localStorage on initial load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("quranAudioState")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        if (parsedState.audioUrl) {
          setAudioState((prev) => ({
            ...prev,
            audioUrl: parsedState.audioUrl,
            title: parsedState.title || "Quran Recitation",
            reciter: parsedState.reciter || "Unknown Reciter",
            surahNumber: parsedState.surahNumber || null,
          }))
        }
      }
    } catch (error) {
      console.error("Error restoring audio state:", error)
    }
  }, [])

  // Save audio state to localStorage when it changes
  useEffect(() => {
    if (audioState.audioUrl) {
      localStorage.setItem(
        "quranAudioState",
        JSON.stringify({
          audioUrl: audioState.audioUrl,
          title: audioState.title,
          reciter: audioState.reciter,
          surahNumber: audioState.surahNumber,
          currentTime: audioState.currentTime,
        }),
      )
    } else {
      localStorage.removeItem("quranAudioState")
    }
  }, [audioState.audioUrl, audioState.title, audioState.reciter, audioState.surahNumber, audioState.currentTime])

  const play = (url: string, title?: string, reciter?: string, surahNumber?: number) => {
    // If we're already playing this URL, don't recreate the audio element
    if (audioRef.current && audioState.audioUrl === url && audioState.isPlaying) {
      return
    }

    // Update state first
    setAudioState((prev) => ({
      ...prev,
      audioUrl: url,
      title: title || "Quran Recitation",
      reciter: reciter || "Unknown Reciter",
      surahNumber: surahNumber || null,
      isPlaying: false, // Will be set to true when playback actually starts
    }))

    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current.remove()
      audioRef.current = null
    }

    // Create new audio element
    const audio = new Audio(url)
    audio.volume = audioState.volume / 100
    audioRef.current = audio

    // Set up event listeners
    audio.addEventListener("loadedmetadata", () => {
      setAudioState((prev) => ({
        ...prev,
        duration: audio.duration,
      }))
    })

    audio.addEventListener("timeupdate", () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        progress: audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      }))
    })

    audio.addEventListener("ended", () => {
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
      }))
    })

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e)

      // Try to get detailed error information
      const errorDetails = {
        error: audio.error
          ? {
              code: audio.error.code,
              message: audio.error.message,
            }
          : "No error object available",
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc,
      }

      console.error("Audio error details:", errorDetails)

      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
      }))

      // Try alternative source if surah number is available
      if (surahNumber) {
        tryAlternativeSource(surahNumber)
      } else {
        toast({
          title: "Audio Error",
          description: "There was an error playing the audio. Please try again.",
          variant: "destructive",
        })
      }
    })

    // Try to play
    audio
      .play()
      .then(() => {
        setAudioState((prev) => ({
          ...prev,
          isPlaying: true,
        }))
      })
      .catch((error) => {
        console.error("Error playing audio:", error)

        // Handle autoplay restrictions
        if (error.name === "NotAllowedError") {
          toast({
            title: "Autoplay Blocked",
            description: "Please click play to start audio playback.",
          })
        } else {
          toast({
            title: "Playback Error",
            description: "There was an error playing the audio. Please try again.",
            variant: "destructive",
          })
        }
      })
  }

  const tryAlternativeSource = (surahNum: number) => {
    // Format surah number with leading zeros
    const paddedSurah = surahNum.toString().padStart(3, "0")

    // Define alternative sources
    const alternativeSources = [
      `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}001.mp3`,
      `https://everyayah.com/data/AbdulSamad_64kbps_QuranExplorer.Com/${paddedSurah}001.mp3`,
      `https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/${paddedSurah}001.mp3`,
      `https://server13.mp3quran.net/husr/${paddedSurah}.mp3`,
      `https://server7.mp3quran.net/basit/${paddedSurah}.mp3`,
    ]

    // Try each source in sequence
    tryNextSource(alternativeSources, 0)

    function tryNextSource(sources: string[], index: number) {
      if (index >= sources.length) {
        toast({
          title: "All Sources Failed",
          description: "Could not play audio from any source. Please try again later.",
          variant: "destructive",
        })
        return
      }

      const currentSource = sources[index]

      toast({
        title: "Trying Alternative Source",
        description: `Attempting to play from alternative source ${index + 1}...`,
      })

      // Create new audio element
      const audio = new Audio(currentSource)
      audio.volume = audioState.volume / 100

      // Set up minimal event listeners
      audio.addEventListener("canplay", () => {
        // Update state and references
        setAudioState((prev) => ({
          ...prev,
          audioUrl: currentSource,
          isPlaying: true,
        }))

        // Clean up previous audio
        if (audioRef.current && audioRef.current !== audio) {
          audioRef.current.pause()
          audioRef.current.src = ""
          audioRef.current.remove()
        }

        audioRef.current = audio

        // Set up remaining event listeners
        audio.addEventListener("loadedmetadata", () => {
          setAudioState((prev) => ({
            ...prev,
            duration: audio.duration,
          }))
        })

        audio.addEventListener("timeupdate", () => {
          setAudioState((prev) => ({
            ...prev,
            currentTime: audio.currentTime,
            progress: audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
          }))
        })

        audio.addEventListener("ended", () => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            currentTime: 0,
            progress: 0,
          }))
        })

        // Play the audio
        audio.play().catch((error) => {
          console.error(`Error playing alternative source ${index + 1}:`, error)
          tryNextSource(sources, index + 1)
        })
      })

      audio.addEventListener("error", () => {
        console.error(`Alternative source ${index + 1} failed`)
        tryNextSource(sources, index + 1)
      })

      // Set a timeout in case the audio gets stuck loading
      const timeoutId = setTimeout(() => {
        if (audio.readyState < 3) {
          // HAVE_FUTURE_DATA
          console.log(`Alternative source ${index + 1} timed out`)
          tryNextSource(sources, index + 1)
        }
      }, 5000)

      // Clean up timeout when audio can play or errors
      audio.addEventListener("canplay", () => clearTimeout(timeoutId))
      audio.addEventListener("error", () => clearTimeout(timeoutId))
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setAudioState((prev) => ({
        ...prev,
        isPlaying: false,
      }))
    }
  }

  const resume = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: true,
          }))
        })
        .catch((error) => {
          console.error("Error resuming audio:", error)
          toast({
            title: "Playback Error",
            description: "There was an error resuming playback. Please try again.",
            variant: "destructive",
          })
        })
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    setAudioState(initialState)
  }

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }

    setAudioState((prev) => ({
      ...prev,
      volume,
    }))
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setAudioState((prev) => ({
        ...prev,
        currentTime: time,
        progress: audioRef.current && audioRef.current.duration ? (time / audioRef.current.duration) * 100 : 0,
      }))
    }
  }

  const next = () => {
    // This would be implemented based on your playlist logic
    // For now, just a placeholder
    console.log("Next track requested")
  }

  const previous = () => {
    // This would be implemented based on your playlist logic
    // For now, just a placeholder
    console.log("Previous track requested")
  }

  return (
    <AudioContext.Provider
      value={{
        audioState,
        play,
        pause,
        resume,
        stop,
        setVolume,
        seek,
        next,
        previous,
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
