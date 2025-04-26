"use client"

import { useState, useEffect } from "react"
import { getTafsir } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface TafsirViewProps {
  verseKey: string
}

export function TafsirView({ verseKey }: TafsirViewProps) {
  const [tafsir, setTafsir] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
      <div className="p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Tafsir</h3>
        <p className="text-red-700 dark:text-red-400 mb-4">
          {error.includes("404")
            ? "The tafsir content for this surah could not be found. The API may not have this specific tafsir available."
            : "There was an error loading the tafsir content. This could be due to network issues or API limitations."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null)
            setIsLoading(true)
            fetchTafsir()
          }}
          className="bg-white dark:bg-gray-800"
        >
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
