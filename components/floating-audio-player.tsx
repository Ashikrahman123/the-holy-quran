"use client"

import { useEffect, useState } from "react"
import { AudioPlayer } from "@/components/audio-player"
import { useAudio } from "@/contexts/audio-context"
import { X, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingAudioPlayer() {
  const { audioUrl, isPlaying, title, reciter } = useAudio()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show the player when there's audio to play
  useEffect(() => {
    if (audioUrl) {
      setIsVisible(true)
    }
  }, [audioUrl])

  if (!isVisible || !audioUrl) {
    return null
  }

  const handleClose = () => {
    setIsVisible(false)
    setIsExpanded(false)
  }

  return (
    <div
      className={cn(
        "fixed bottom-16 md:bottom-4 left-0 right-0 z-40 transition-all duration-300 ease-in-out px-4",
        isExpanded ? "h-36 sm:h-48" : "h-12",
      )}
    >
      <div className="mx-auto max-w-3xl bg-background border rounded-lg shadow-lg overflow-hidden">
        <div
          className="flex items-center justify-between p-2 border-b cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <AudioPlayer minimal audioUrl={audioUrl} />
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="p-4">
            <AudioPlayer audioUrl={audioUrl} title={title || undefined} reciter={reciter || undefined} />
          </div>
        )}
      </div>
    </div>
  )
}
