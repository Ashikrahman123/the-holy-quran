"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AudioPlayerProps {
  audioUrl?: string
  onNext?: () => void
  onPrevious?: () => void
  title?: string
  reciter?: string
  surahNumber?: number
}

export function AudioPlayer({ audioUrl, onNext, onPrevious, title, reciter, surahNumber }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Use refs to track the audio element and URL state
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | undefined>(audioUrl)
  const isPlayingRef = useRef<boolean>(false)

  // Log the current state for debugging
  useEffect(() => {
    console.log("Audio player state:", {
      audioUrl,
      isPlaying,
      isLoading,
      audioError,
      surahNumber,
    })

    // Update the URL ref when the prop changes
    audioUrlRef.current = audioUrl
  }, [audioUrl, isPlaying, isLoading, audioError, surahNumber])

  // Clean up audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        console.log("Cleaning up audio element on unmount")
        audioElementRef.current.pause()
        audioElementRef.current.src = ""
        audioElementRef.current.load()
        audioElementRef.current = null
      }
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = volume / 100
    }
  }, [volume])

  // Create a new audio element for each play attempt
  const createAndPlayAudio = () => {
    if (!audioUrl) {
      console.error("No audio URL provided")
      setAudioError("No audio URL provided")
      return
    }

    setIsLoading(true)
    setAudioError(null)

    // Clean up previous audio element
    if (audioElementRef.current) {
      console.log("Cleaning up previous audio element")
      audioElementRef.current.pause()
      audioElementRef.current.src = ""
      audioElementRef.current.load()
      audioElementRef.current.remove()
      audioElementRef.current = null
    }

    console.log("Creating new audio element for URL:", audioUrl)

    // Create a new audio element
    const audio = new Audio()

    // Set up all event listeners before setting the source
    audio.addEventListener("canplay", () => {
      console.log("Audio can play event")
      setIsLoading(false)
    })

    audio.addEventListener("loadedmetadata", () => {
      console.log("Audio metadata loaded, duration:", audio.duration)
      setDuration(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    })

    audio.addEventListener("ended", () => {
      console.log("Audio ended event")
      setIsPlaying(false)
      isPlayingRef.current = false
      setProgress(0)
      setCurrentTime(0)
      if (onNext) onNext()
    })

    audio.addEventListener("error", (e) => {
      console.error("Audio error event:", e)
      console.error("Audio error details:", {
        error: audio.error,
        code: audio.error?.code,
        message: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState,
      })

      setIsLoading(false)
      setIsPlaying(false)
      isPlayingRef.current = false

      // Try to get detailed error information
      let errorMessage = "There was an error playing the audio."
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Playback was aborted by the user."
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "A network error occurred while loading the audio."
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "The audio format is not supported by your browser."
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "The audio format or source is not supported."
            break
        }
      }

      setAudioError(errorMessage)

      // Try alternative URL if available
      if (surahNumber && audioUrl) {
        tryAlternativeAudioSource(surahNumber)
      }
    })

    // Set the audio properties
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous"
    audio.volume = volume / 100

    // Set the source last, after all event listeners are attached
    audio.src = audioUrl

    // Store the audio element in the ref
    audioElementRef.current = audio

    // Try to play the audio
    console.log("Attempting to play audio")
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio play promise resolved successfully")
          setIsPlaying(true)
          isPlayingRef.current = true
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Audio play promise rejected:", error)
          setIsLoading(false)

          // Handle specific autoplay restriction error
          if (error.name === "NotAllowedError") {
            setAudioError("Autoplay is blocked by your browser. Please click play again.")
          } else {
            setAudioError(`Error playing audio: ${error.message || "Unknown error"}`)
          }

          toast({
            title: "Playback Error",
            description: "There was an error playing the audio. Please try again.",
            variant: "destructive",
          })
        })
    }
  }

  // Try alternative audio sources if the primary one fails
  const tryAlternativeAudioSource = (surahNum: number) => {
    console.log("Trying alternative audio source for surah:", surahNum)

    // Format surah number with leading zeros for EveryAyah
    const paddedSurah = surahNum.toString().padStart(3, "0")

    // Try EveryAyah.com as an alternative source
    const alternativeUrl = `https://everyayah.com/data/Alafasy_128kbps/${paddedSurah}001.mp3`

    console.log("Alternative audio URL:", alternativeUrl)

    toast({
      title: "Trying Alternative Source",
      description: "The primary audio source failed. Trying an alternative source...",
      duration: 3000,
    })

    // Create a new audio element for the alternative source
    const audio = new Audio()
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous"
    audio.volume = volume / 100

    // Set up minimal event listeners
    audio.addEventListener("canplay", () => {
      console.log("Alternative audio can play")
      setIsLoading(false)
      setAudioError(null)

      // Try to play
      audio
        .play()
        .then(() => {
          console.log("Alternative audio playing successfully")
          setIsPlaying(true)
          isPlayingRef.current = true

          // Update the audio element ref
          if (audioElementRef.current) {
            audioElementRef.current.pause()
            audioElementRef.current.src = ""
          }
          audioElementRef.current = audio

          // Set up the remaining event listeners
          audio.addEventListener("timeupdate", () => {
            setCurrentTime(audio.currentTime)
            setProgress((audio.currentTime / audio.duration) * 100)
          })

          audio.addEventListener("ended", () => {
            setIsPlaying(false)
            isPlayingRef.current = false
            setProgress(0)
            setCurrentTime(0)
            if (onNext) onNext()
          })

          audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration)
          })

          toast({
            title: "Alternative Source Working",
            description: "Now playing from an alternative audio source.",
            duration: 3000,
          })
        })
        .catch((error) => {
          console.error("Alternative audio source failed:", error)
          setAudioError("All audio sources failed. Please try again later or download the audio instead.")
        })
    })

    audio.addEventListener("error", (e) => {
      console.error("Alternative audio source error:", e)
      setAudioError("All audio sources failed. Please try again later or download the audio instead.")
    })

    // Set the source last
    audio.src = alternativeUrl
  }

  const togglePlay = () => {
    if (!audioUrl) {
      console.error("No audio URL to play")
      return
    }

    if (isPlaying) {
      console.log("Pausing audio")
      if (audioElementRef.current) {
        audioElementRef.current.pause()
      }
      setIsPlaying(false)
      isPlayingRef.current = false
    } else {
      console.log("Starting audio playback")
      // If we already have an audio element that was paused, resume it
      if (audioElementRef.current && audioElementRef.current.paused && audioElementRef.current.src) {
        console.log("Resuming existing audio element")
        const playPromise = audioElementRef.current.play()

        if (playPromise !== undefined) {
          setIsLoading(true)
          playPromise
            .then(() => {
              console.log("Resume successful")
              setIsPlaying(true)
              isPlayingRef.current = true
              setIsLoading(false)
            })
            .catch((error) => {
              console.error("Error resuming audio:", error)
              setIsLoading(false)

              // If resuming fails, try creating a new audio element
              createAndPlayAudio()
            })
        }
      } else {
        // Otherwise create a new audio element
        createAndPlayAudio()
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (!audioElementRef.current || !duration) return

    const newTime = (value[0] / 100) * duration
    audioElementRef.current.currentTime = newTime
    setProgress(value[0])
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleDownload = async () => {
    if (!audioUrl) {
      toast({
        title: "Download Error",
        description: "No audio available to download.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDownloading(true)

      // Create a download link
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = title ? `${title}${reciter ? `-${reciter}` : ""}.mp3` : "quran-recitation.mp3"

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: "Your audio file is being downloaded.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the audio file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const retryAudio = () => {
    console.log("Retrying audio playback")
    createAndPlayAudio()
  }

  // If there's an error, show error state
  if (audioError) {
    return (
      <div className="w-full rounded-md border bg-background p-2">
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{audioError}</AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={retryAudio} className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
          {audioUrl && (
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading} className="gap-1">
              <Download className={`h-3 w-3 ${isDownloading ? "animate-pulse" : ""}`} />
              Download Instead
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-md border bg-background p-2">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex gap-1 w-full sm:w-auto justify-center sm:justify-start">
          {onPrevious && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevious}>
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
          {onNext && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2 w-full my-2 sm:my-0">
          <span className="text-xs text-muted-foreground min-w-[40px] text-center sm:text-left">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[progress]}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={handleProgressChange}
            disabled={!audioUrl || duration === 0}
          />
          <span className="text-xs text-muted-foreground min-w-[40px] text-center sm:text-left">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center gap-1">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-20"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
          {audioUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} disabled={isDownloading}>
              <Download className={`h-4 w-4 ${isDownloading ? "animate-pulse" : ""}`} />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
