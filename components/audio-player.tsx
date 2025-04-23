"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Download, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAudio } from "@/contexts/audio-context"

interface AudioPlayerProps {
  audioUrl?: string
  onNext?: () => void
  onPrevious?: () => void
  title?: string
  reciter?: string
  surahNumber?: number
  minimal?: boolean
}

export function AudioPlayer({
  audioUrl,
  onNext,
  onPrevious,
  title,
  reciter,
  surahNumber,
  minimal = false,
}: AudioPlayerProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const {
    setAudioUrl,
    isPlaying,
    togglePlayPause,
    setTitle,
    setReciter,
    setSurahNumber,
    progress,
    duration,
    currentTime,
    setCurrentTime,
    volume,
    setVolume,
    loading,
    error,
  } = useAudio()

  // Update context when props change
  useEffect(() => {
    if (audioUrl) {
      setAudioUrl(audioUrl)
    }
    if (title) {
      setTitle(title)
    }
    if (reciter) {
      setReciter(reciter)
    }
    if (surahNumber) {
      setSurahNumber(surahNumber)
    }
  }, [audioUrl, title, reciter, surahNumber, setAudioUrl, setTitle, setReciter, setSurahNumber])

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgressChange = (value: number[]) => {
    if (!duration) return
    const newTime = (value[0] / 100) * duration
    setCurrentTime(newTime)
  }

  const handleDownload = async () => {
    if (!audioUrl) return

    try {
      setIsDownloading(true)
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = title ? `${title}${reciter ? `-${reciter}` : ""}.mp3` : "quran-recitation.mp3"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (error && !minimal) {
    return (
      <div className="w-full rounded-md border bg-background p-2">
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setAudioUrl(audioUrl || null)} className="gap-1">
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

  if (minimal) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlayPause} disabled={loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="w-32 text-xs">
          {title ? (
            <div className="truncate">{title}</div>
          ) : (
            <div className="h-3 w-24 animate-pulse rounded bg-muted"></div>
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
            onClick={togglePlayPause}
            disabled={!audioUrl || loading}
          >
            {loading ? (
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
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            {showVolumeSlider && (
              <div className="absolute -left-16 bottom-10 bg-background rounded-md border p-2 shadow-md">
                <Slider
                  orientation="vertical"
                  value={[volume]}
                  max={100}
                  step={1}
                  className="h-24"
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
            )}
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
