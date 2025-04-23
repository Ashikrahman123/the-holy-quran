"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Bookmark, Share2, PlayCircle, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Header } from "@/components/header"
import { TafsirView } from "@/components/tafsir-view"
import { MultiTranslationView } from "@/components/multi-translation-view"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useUserPreferences } from "@/contexts/user-preferences-context"
import { getLanguageDetails } from "@/lib/language"
import {
  getChapters,
  getChapterVerses,
  updateLastRead,
  getVerseRecitation,
  type Chapter,
  type Verse,
} from "@/lib/api-service"
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/bookmarks"
import { useAudio } from "@/contexts/audio-context"

export default function ChapterPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const highlightVerse = searchParams.get("highlight")
  const chapterId = Number(params.id)
  const { preferences } = useUserPreferences()
  const { toast } = useToast()
  const { playAudio } = useAudio()

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showTafsir, setShowTafsir] = useState<string | null>(null)
  const [showTranslations, setShowTranslations] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const highlightedVerseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch chapter details
        const chaptersData = await getChapters()
        const currentChapter = chaptersData.find((c) => c.id === chapterId || c.number === chapterId)

        if (!currentChapter) {
          setError("Chapter not found. Please try another chapter.")
          setLoading(false)
          return
        }

        setChapter(currentChapter)

        // Fetch verses
        const versesData = await getChapterVerses(
          currentChapter.id || currentChapter.number,
          currentPage,
          10,
          preferences.language,
        )
        setVerses(versesData.verses)
        setTotalPages(versesData.meta.total_pages)

        // Update last read
        updateLastRead(currentChapter.id || currentChapter.number, 1)
      } catch (error) {
        console.error("Error fetching chapter data:", error)
        setError("Failed to load chapter data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchChapterData()
  }, [chapterId, currentPage, preferences.language])

  useEffect(() => {
    // Scroll to highlighted verse if specified
    if (highlightVerse && !loading) {
      const verseElement = document.getElementById(`verse-${highlightVerse}`)
      if (verseElement) {
        setTimeout(() => {
          verseElement.scrollIntoView({ behavior: "smooth", block: "center" })
          verseElement.classList.add("bg-yellow-100", "dark:bg-yellow-900/30")
          setTimeout(() => {
            verseElement.classList.remove("bg-yellow-100", "dark:bg-yellow-900/30")
            verseElement.classList.add("transition-colors", "duration-1000")
          }, 2000)
        }, 500)
      }
    }
  }, [highlightVerse, loading, verses])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo(0, 0)
    }
  }

  const handleBookmarkToggle = (verse: Verse) => {
    try {
      const verseKey = verse.verse_key || `${chapterId}:${verse.numberInSurah || verse.verse_number}`

      if (isBookmarked(verseKey)) {
        removeBookmark(verseKey)
        toast({
          title: "Bookmark removed",
          description: `Verse ${verseKey} has been removed from your bookmarks.`,
          duration: 3000,
        })
      } else {
        addBookmark({
          verseKey,
          chapterName: chapter?.name_simple || chapter?.englishName || "",
          verseText: verse.text_uthmani || verse.text || "",
          translation: verse.translations?.[0]?.text || "",
        })
        toast({
          title: "Bookmark added",
          description: `Verse ${verseKey} has been added to your bookmarks.`,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "There was an error managing your bookmark.",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const handlePlayAudio = async (verse: Verse) => {
    try {
      const verseKey = verse.verse_key || `${chapterId}:${verse.numberInSurah || verse.verse_number}`
      const audioUrl = await getVerseRecitation(preferences.reciterId, verseKey)

      if (audioUrl) {
        playAudio({
          title: `Surah ${chapter?.name_simple || chapter?.englishName} - Verse ${verse.numberInSurah || verse.verse_number}`,
          src: audioUrl,
          verseKey,
        })
      } else {
        toast({
          title: "Audio not available",
          description: "Could not load audio for this verse.",
          duration: 3000,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error playing audio:", error)
      toast({
        title: "Error",
        description: "There was an error playing the audio.",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const handleShowTafsir = (verseKey: string) => {
    setShowTafsir(showTafsir === verseKey ? null : verseKey)
    setShowTranslations(null)
  }

  const handleShowTranslations = (verseKey: string) => {
    setShowTranslations(showTranslations === verseKey ? null : verseKey)
    setShowTafsir(null)
  }

  const handleShare = async (verse: Verse) => {
    try {
      const verseKey = verse.verse_key || `${chapterId}:${verse.numberInSurah || verse.verse_number}`
      const shareText = `${verse.text_uthmani || verse.text}\n\n${verse.translations?.[0]?.text || ""}\n\nSurah ${
        chapter?.name_simple || chapter?.englishName
      } (${verseKey})`

      if (navigator.share) {
        await navigator.share({
          title: `Quran - ${verseKey}`,
          text: shareText,
          url: `${window.location.origin}/read/${chapterId}?highlight=${verse.numberInSurah || verse.verse_number}#verse-${verse.numberInSurah || verse.verse_number}`,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to clipboard",
          description: "Verse text has been copied to your clipboard.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error sharing verse:", error)
      toast({
        title: "Error",
        description: "There was an error sharing this verse.",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  const languageDetails = getLanguageDetails(preferences.language)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-6">
          {loading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-lg border p-6">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 p-6 text-center dark:border-red-800">
              <h2 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">{error}</h2>
              <p className="mb-4 text-muted-foreground">Please try another chapter or check your connection.</p>
              <Button asChild>
                <Link href="/read">Return to Chapters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {chapter?.name_simple || chapter?.englishName}{" "}
                    <span className="text-muted-foreground">
                      ({chapter?.translated_name?.name || chapter?.englishNameTranslation})
                    </span>
                  </h1>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/read">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {chapter?.revelation_place || chapter?.revelationType} •{" "}
                  {chapter?.verses_count || chapter?.numberOfAyahs} verses
                </p>
              </div>

              <div className="mb-6 space-y-6">
                {verses.map((verse) => {
                  const verseKey = verse.verse_key || `${chapterId}:${verse.numberInSurah || verse.verse_number}`
                  const verseNumber = verse.numberInSurah || verse.verse_number
                  const isBookmarked_ = isBookmarked(verseKey)
                  const isHighlighted = highlightVerse && Number(highlightVerse) === verseNumber

                  return (
                    <div
                      key={verseKey}
                      id={`verse-${verseNumber}`}
                      className={`rounded-lg border p-4 transition-all ${
                        isHighlighted ? "bg-yellow-100 dark:bg-yellow-900/30" : ""
                      }`}
                      ref={isHighlighted ? highlightedVerseRef : null}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                            {verseNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleBookmarkToggle(verse)}
                            title={isBookmarked_ ? "Remove bookmark" : "Add bookmark"}
                          >
                            <Bookmark className={`h-4 w-4 ${isBookmarked_ ? "fill-current text-yellow-500" : ""}`} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePlayAudio(verse)}
                            title="Play audio"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleShowTranslations(verseKey)}
                            title="Show translations"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleShare(verse)}
                            title="Share verse"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4 text-right">
                        <p
                          className="font-arabic text-xl leading-relaxed text-emerald-800 dark:text-emerald-200 md:text-2xl"
                          dir="rtl"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          {verse.text_uthmani || verse.text}
                        </p>
                      </div>

                      <div className="border-t pt-3">
                        <p
                          className="text-muted-foreground"
                          dir={languageDetails.direction}
                          style={{ fontFamily: languageDetails.fontFamily }}
                        >
                          {verse.translations && verse.translations[0] ? verse.translations[0].text : ""}
                        </p>
                      </div>

                      {showTafsir === verseKey && <TafsirView verseKey={verseKey} language={preferences.language} />}

                      {showTranslations === verseKey && <MultiTranslationView verseKey={verseKey} />}
                    </div>
                  )
                })}
              </div>

              <div className="mb-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
