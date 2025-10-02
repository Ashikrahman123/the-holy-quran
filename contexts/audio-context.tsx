"use client"

import type React from "react"
import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"

interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  progress: number
  audioUrl: string | null
  title: string | null
  reciter: string | null
  surahNumber: number | null
  error: string | null
}

interface AudioContextType {
  audioState: AudioState
  play: (url: string, title?: string, reciter?: string, surahNumber?: number) => void
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  clearError: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 50,
    progress: 0,
    audioUrl: null,
    title: null,
    reciter: null,
    surahNumber: null,
    error: null,
  })

  const clearError = useCallback(() => {
    setAudioState((prev) => ({ ...prev, error: null }))
  }, [])

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration || 0
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0

      setAudioState((prev) => ({
        ...prev,
        currentTime,
        duration,
        progress,
      }))
    }
  }, [])

  const play = useCallback(
    (url: string, title?: string, reciter?: string, surahNumber?: number) => {
      try {
        // Clear any previous error
        clearError()

        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }

        const audio = new Audio(url)
        audioRef.current = audio

        // Set volume
        audio.volume = audioState.volume / 100

        // Event listeners
        audio.addEventListener("loadstart", () => {
          setAudioState((prev) => ({
            ...prev,
            audioUrl: url,
            title: title || null,
            reciter: reciter || null,
            surahNumber: surahNumber || null,
            error: null,
          }))
        })

        audio.addEventListener("canplay", () => {
          setAudioState((prev) => ({ ...prev, error: null }))
        })

        audio.addEventListener("play", () => {
          setAudioState((prev) => ({ ...prev, isPlaying: true, error: null }))
        })

        audio.addEventListener("pause", () => {
          setAudioState((prev) => ({ ...prev, isPlaying: false }))
        })

        audio.addEventListener("ended", () => {
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            currentTime: 0,
            progress: 0,
          }))
        })

        audio.addEventListener("timeupdate", updateProgress)

        audio.addEventListener("error", (e) => {
          console.error("Audio error:", e)
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            error: "Failed to load audio. Please check your connection or try a different source.",
          }))
        })

        audio.addEventListener("loadedmetadata", () => {
          setAudioState((prev) => ({
            ...prev,
            duration: audio.duration,
          }))
        })

        // Start playing
        audio.play().catch((error) => {
          console.error("Play error:", error)
          setAudioState((prev) => ({
            ...prev,
            isPlaying: false,
            error: "Unable to play audio. Please try again.",
          }))
        })
      } catch (error) {
        console.error("Audio setup error:", error)
        setAudioState((prev) => ({
          ...prev,
          error: "Audio initialization failed. Please try again.",
        }))
      }
    },
    [audioState.volume, updateProgress, clearError],
  )

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Resume error:", error)
        setAudioState((prev) => ({
          ...prev,
          error: "Unable to resume audio. Please try again.",
        }))
      })
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setAudioState((prev) => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
      progress: 0,
      audioUrl: null,
      title: null,
      reciter: null,
      surahNumber: null,
      error: null,
    }))
  }, [])

  const seek = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time
        updateProgress()
      }
    },
    [updateProgress],
  )

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
    setAudioState((prev) => ({ ...prev, volume }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const value: AudioContextType = {
    audioState,
    play,
    pause,
    resume,
    stop,
    seek,
    setVolume,
    clearError,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
