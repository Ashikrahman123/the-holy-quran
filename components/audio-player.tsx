"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAudio } from "@/contexts/audio-context"

interface AudioPlayerProps {
  audioUrl?: string
  onNext?: () => void
  onPrevious?: () => void
  title?: string
  reciter?: string
  surahNumber?: number
}

export function AudioPlayer({ audioUrl, onNext, onPrevious, title, reciter, surahNumber }: AudioPlayerProps) {
  const { audioState, play, pause, resume, setVolume, seek } = useAudio()
  const { toast } = useToast()

  // Check if this player is controlling the current audio
  const isCurrentPlayer = audioState.audioUrl === audioUrl

  // Determine if this player should show as playing
  const isPlaying = isCurrentPlayer && audioState.isPlaying

  // Format time helper function
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const togglePlay = () => {
    if (!audioUrl) return

    if (isCurrentPlayer) {
      // If we're already playing this audio, toggle play/pause
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
    } else {
      // If we're not playing this audio, start playing it
      play(audioUrl, title, reciter, surahNumber)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (!isCurrentPlayer || !audioState.duration) return

    const newTime = (value[0] / 100) * audioState.duration
    seek(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
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
    }
  }

  const handleNext = () => {
    if (onNext) onNext()
  }

  const handlePrevious = () => {
    if (onPrevious) onPrevious()
  }

  // If there's an error with this specific audio URL, show error state
  const hasError = isCurrentPlayer && audioState.audioUrl && !audioState.isPlaying && audioState.currentTime === 0

  if (hasError) {
    return (
      <div className="w-full rounded-md border bg-background p-2">
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>
            There was an error playing the audio. Please try again or use an alternative source.
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => play(audioUrl!, title, reciter, surahNumber)}
            className="gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
          {audioUrl && (
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
              <Download className="h-3 w-3" />
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevious}>
              <SkipBack className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlay} disabled={!audioUrl}>
            {isCurrentPlayer && audioState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
          {onNext && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNext}>
              <SkipForward className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2 w-full my-2 sm:my-0">
          <span className="text-xs text-muted-foreground min-w-[40px] text-center sm:text-left">
            {isCurrentPlayer ? formatTime(audioState.currentTime) : "0:00"}
          </span>
          <Slider
            value={[isCurrentPlayer ? audioState.progress : 0]}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={handleProgressChange}
            disabled={!isCurrentPlayer || !audioState.duration}
          />
          <span className="text-xs text-muted-foreground min-w-[40px] text-center sm:text-left">
            {isCurrentPlayer ? formatTime(audioState.duration) : "0:00"}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <div className="flex items-center gap-1">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[audioState.volume]}
              max={100}
              step={1}
              className="w-20"
              onValueChange={handleVolumeChange}
            />
          </div>
          {audioUrl && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
