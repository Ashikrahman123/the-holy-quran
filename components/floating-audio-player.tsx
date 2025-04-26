"use client"

import { useState } from "react"
import { useAudio } from "@/contexts/audio-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, X, Minimize2, Maximize2, Volume2 } from "lucide-react"

export function FloatingAudioPlayer() {
  const { audioState, pause, resume, stop, setVolume, seek } = useAudio()
  const [isMinimized, setIsMinimized] = useState(false)

  // Format time helper function
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Don't render if no audio is loaded
  if (!audioState.audioUrl) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-background rounded-lg shadow-lg border transition-all duration-300 ${
        isMinimized ? "w-16 h-16" : "w-80 p-3"
      }`}
    >
      {isMinimized ? (
        <div className="h-full w-full flex items-center justify-center">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => setIsMinimized(false)}>
            <Maximize2 className="h-5 w-5" />
            <span className="sr-only">Expand player</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="truncate flex-1">
              <p className="font-medium truncate">{audioState.title || "Quran Audio"}</p>
              {audioState.reciter && <p className="text-xs text-muted-foreground truncate">{audioState.reciter}</p>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="h-4 w-4" />
                <span className="sr-only">Minimize</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={stop}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={audioState.isPlaying ? pause : resume}>
              {audioState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="sr-only">{audioState.isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <div className="flex flex-1 items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[30px]">{formatTime(audioState.currentTime)}</span>
              <Slider
                value={[audioState.progress]}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(value) => {
                  const newTime = (value[0] / 100) * audioState.duration
                  seek(newTime)
                }}
                disabled={!audioState.duration}
              />
              <span className="text-xs text-muted-foreground min-w-[30px]">{formatTime(audioState.duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-muted-foreground" />
            <Slider
              value={[audioState.volume]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={(value) => setVolume(value[0])}
            />
          </div>
        </>
      )}
    </div>
  )
}
