"use client"

import { useState, useEffect } from "react"
import { getTafsir } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TafsirViewProps {
  verseKey: string
}

export function TafsirView({ verseKey }: TafsirViewProps) {
  const [tafsir, setTafsir] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTafsir = async () => {
    setLoading(true)
    setError(null)
    try {
      const tafsirText = await getTafsir(verseKey)
      setTafsir(tafsirText)
    } catch (err) {
      console.error("Error fetching tafsir:", err)
      setError("Failed to load tafsir for this verse. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTafsir()
  }, [verseKey])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{error}</p>
        <p className="text-sm text-muted-foreground mb-4">
          We're experiencing issues connecting to our tafsir database. This might be due to network issues or temporary
          API unavailability.
        </p>
        <Button onClick={fetchTafsir} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: tafsir }} />
      {!tafsir && <p className="text-muted-foreground text-center py-4">No tafsir available for this verse.</p>}
    </div>
  )
}
