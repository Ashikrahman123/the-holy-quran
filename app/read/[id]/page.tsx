"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { AudioPlayer } from "@/components/audio-player"
import { TafsirView } from "@/components/tafsir-view"
import { MultiTranslationView } from "@/components/multi-translation-view"
import { ChevronLeft, ChevronRight, Bookmark, Share2, Info, Download, Copy, RefreshCw } from "lucide-react"
import {
  getChapters,
  getChapterVerses,
  getChapterRecitation,
  updateLastRead,
  type Chapter,
  type Verse,
} from "@/lib/api-service"
import { addBookmark, isBookmarked, removeBookmark } from "@/lib/bookmarks"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MobileNav } from "@/components/mobile-nav"
import { Header } from "@/components/header"
import { LANGUAGES, type Language } from "@/lib/language"
import { useUserPreferences } from "@/contexts/user-preferences-context"

export default function SurahPage({ params }: { params: { id: string } }) {
  const { preferences, updateLanguage, updateFontSize, updateReciterId } = useUserPreferences()
  const surahId = Number.parseInt(params.id)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [reciterId, setReciterId] = useState(preferences.reciterId)
  const [audioUrl, setAudioUrl] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>(preferences.language as Language)
  const [additionalLanguages, setAdditionalLanguages] = useState<Language[]>(
    ["en", "ar", "ta"].includes(primaryLanguage) ? ["hi"] : ["en", "ta"],
  )
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const [fontSize, setFontSize] = useState(preferences.fontSize)
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null)
  const [translations, setTranslations] = useState<Record<string, Record<Language, string>>>({})

  const fetchChapterDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch chapter details
      const chapters = await getChapters(primaryLanguage)
      const currentChapter = chapters.find((c) => c.id === surahId)
      if (currentChapter) {
        setChapter(currentChapter)

        try {
          // Fetch primary language verses
          const versesData = await getChapterVerses(surahId, currentPage, 10, primaryLanguage)

          // Check if versesData and its properties exist
          if (versesData && versesData.verses) {
            setVerses(Array.isArray(versesData.verses) ? versesData.verses : [])

            // Safely access meta.total_pages with a default value of 1
            const totalPages =
              versesData.meta && typeof versesData.meta.total_pages === "number" ? versesData.meta.total_pages : 1

            setTotalPages(totalPages)

            // Fetch additional translations
            const newTranslations: Record<string, Record<Language, string>> = {}

            for (const verse of versesData.verses) {
              newTranslations[verse.verse_key] = {
                [primaryLanguage]: verse.translations[0]?.text || "",
              }

              // Fetch additional languages
              for (const lang of additionalLanguages) {
                if (lang !== primaryLanguage) {
                  try {
                    const additionalData = await getChapterVerses(surahId, currentPage, 10, lang)
                    const matchingVerse = additionalData.verses.find((v) => v.verse_key === verse.verse_key)
                    if (matchingVerse) {
                      newTranslations[verse.verse_key][lang] = matchingVerse.translations[0]?.text || ""
                    }
                  } catch (error) {
                    console.error(`Error fetching ${lang} translation:`, error)
                    newTranslations[verse.verse_key][lang] =
                      `Translation not available in ${LANGUAGES.find((l) => l.code === lang)?.name || lang}`
                  }
                }
              }
            }

            setTranslations(newTranslations)

            // Update last read position
            updateLastRead(surahId, versesData.verses[0]?.verse_number || 1)

            if (versesData.verses.length === 0) {
              console.warn("No verses returned for chapter", surahId)
            }
          } else {
            console.warn("Invalid verses data returned for chapter", surahId)
            setVerses([])
            setTotalPages(1)
          }
        } catch (versesError) {
          console.error("Error fetching verses:", versesError)
          toast({
            title: "Error Loading Verses",
            description: "Could not load verses for this surah. Please try again later.",
            variant: "destructive",
          })
          setVerses([])
          setTotalPages(1)
        }

        // Fetch audio
        try {
          // Clear previous audio URL while loading
          setAudioUrl("")

          // Small delay to ensure UI updates before fetching new audio
          setTimeout(async () => {
            try {
              const audio = await getChapterRecitation(reciterId, surahId)
              console.log("Fetched audio URL:", audio)

              // Another small delay before setting the audio URL to ensure clean state
              setTimeout(() => {
                setAudioUrl(audio)
              }, 100)
            } catch (audioError) {
              console.error("Error fetching audio:", audioError)
              setAudioUrl("")
              toast({
                title: "Audio Unavailable",
                description: "Could not load audio for this surah. You can still read the text.",
                duration: 5000,
              })
            }
          }, 200)
        } catch (audioError) {
          console.error("Error fetching audio:", audioError)
          setAudioUrl("")
          toast({
            title: "Audio Unavailable",
            description: "Could not load audio for this surah. You can still read the text.",
            duration: 5000,
          })
        }

        // Check which verses are bookmarked
        const bookmarked: Record<string, boolean> = {}
        verses.forEach((verse) => {
          bookmarked[verse.verse_key] = isBookmarked(verse.verse_key)
        })
        setBookmarkedVerses(bookmarked)
      } else {
        setError(`Surah ${surahId} not found. Please try another surah.`)
      }
    } catch (error) {
      console.error("Error fetching chapter details:", error)
      setError("Failed to load surah details. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChapterDetails()
  }, [surahId, currentPage, reciterId, primaryLanguage, additionalLanguages.join(",")])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleReciterChange = async (id: string) => {
    const reciterIdNum = Number.parseInt(id)
    setReciterId(reciterIdNum)
    updateReciterId(reciterIdNum)

    try {
      // Clear audio URL first
      setAudioUrl("")

      // Small delay before fetching new audio
      setTimeout(async () => {
        try {
          const audio = await getChapterRecitation(reciterIdNum, surahId)
          setAudioUrl(audio)
          toast({
            title: "Reciter Changed",
            description: `Now playing recitation by reciter ID ${id}`,
          })
        } catch (error) {
          console.error("Error fetching recitation:", error)
          toast({
            title: "Audio Error",
            description: "Could not load audio for this reciter. Please try another.",
            variant: "destructive",
          })
        }
      }, 200)
    } catch (error) {
      console.error("Error fetching recitation:", error)
      toast({
        title: "Audio Error",
        description: "Could not load audio for this reciter. Please try another.",
        variant: "destructive",
      })
    }
  }

  const handlePrimaryLanguageChange = (lang: string) => {
    const language = lang as Language
    setPrimaryLanguage(language)
    updateLanguage(language)

    // Update additional languages
    if (["en", "ar", "ta"].includes(language)) {
      setAdditionalLanguages((prev) =>
        prev.filter((l) => l !== language).concat(["hi"].filter((l) => !prev.includes(l) && l !== language)),
      )
    } else {
      setAdditionalLanguages((prev) =>
        prev.filter((l) => l !== language).concat(["en", "ta"].filter((l) => !prev.includes(l) && l !== language)),
      )
    }
  }

  const handleAddLanguage = (lang: Language) => {
    if (!additionalLanguages.includes(lang) && lang !== primaryLanguage) {
      setAdditionalLanguages([...additionalLanguages, lang])
      toast({
        title: "Translation Added",
        description: `Added ${LANGUAGES.find((l) => l.code === lang)?.name || lang} translation`,
      })
    }
  }

  const handleRemoveLanguage = (lang: Language) => {
    if (additionalLanguages.includes(lang)) {
      setAdditionalLanguages(additionalLanguages.filter((l) => l !== lang))
    }
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    updateFontSize(size)
  }

  const handleBookmark = (verse: Verse) => {
    try {
      if (bookmarkedVerses[verse.verse_key]) {
        // Find the bookmark ID and remove it
        removeBookmark(verse.verse_key)
        setBookmarkedVerses((prev) => ({ ...prev, [verse.verse_key]: false }))
        toast({
          title: "Bookmark removed",
          description: `Verse ${verse.verse_key} has been removed from bookmarks.`,
          duration: 3000,
        })
      } else {
        addBookmark({
          verseKey: verse.verse_key,
          chapterName: chapter?.name_simple || "",
          verseText: verse.text_uthmani,
          translation: verse.translations[0]?.text || "",
        })
        setBookmarkedVerses((prev) => ({ ...prev, [verse.verse_key]: true }))
        toast({
          title: "Bookmark added",
          description: `Verse ${verse.verse_key} has been bookmarked.`,
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error managing your bookmark.",
        duration: 3000,
      })
    }
  }

  const handleCopyVerse = (verse: Verse) => {
    const textToCopy = `${verse.text_uthmani}\n\n${verse.translations[0]?.text}\n\n(Quran ${verse.verse_key})`
    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied to clipboard",
      description: `Verse ${verse.verse_key} has been copied to your clipboard.`,
      duration: 3000,
    })
  }

  const handleShare = (verse: Verse) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Quran - ${verse.verse_key}`,
          text: `${verse.text_uthmani}\n\n${verse.translations[0]?.text}\n\n(Quran ${verse.verse_key})`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          handleCopyVerse(verse)
        })
    } else {
      handleCopyVerse(verse)
      toast({
        title: "Share not supported",
        description: "Sharing is not supported in your browser. The verse has been copied to your clipboard instead.",
        duration: 3000,
      })
    }
  }

  const handleDownloadAudio = async (verse: Verse) => {
    try {
      // Get audio for this specific verse
      const audio = await getChapterRecitation(reciterId, surahId)

      if (!audio) {
        throw new Error("No audio available")
      }

      // Create download link
      const link = document.createElement("a")
      link.href = audio
      link.download = `surah-${surahId}-verse-${verse.verse_number}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `Audio for Surah ${surahId}, Verse ${verse.verse_number} is being downloaded.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the audio. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-xl"
      case "large":
        return "text-3xl"
      default:
        return "text-2xl"
    }
  }

  const handleViewTafsir = (verseKey: string) => {
    setSelectedVerse(verseKey)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10">
            <div className="mb-6 flex items-center justify-between">
              <div className="animate-pulse">
                <div className="mb-2 h-4 w-32 rounded bg-muted"></div>
                <div className="h-8 w-64 rounded bg-muted"></div>
              </div>
            </div>

            <div className="mb-8 rounded-lg border bg-muted/30 p-4">
              <div className="animate-pulse grid gap-4">
                <div className="h-8 w-full rounded bg-muted"></div>
                <div className="h-12 w-full rounded bg-muted"></div>
              </div>
            </div>

            <div className="space-y-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded bg-muted"></div>
                      <div className="h-8 w-8 rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="mb-4 h-24 w-full rounded bg-muted"></div>
                  <div className="border-t pt-4">
                    <div className="h-16 w-full rounded bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Link href="/read">
                <Button className="mr-4 bg-emerald-600 hover:bg-emerald-700">Return to Surah List</Button>
              </Link>
              <Button onClick={fetchChapterDetails} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Surah Not Found</h1>
              <p className="mt-4 text-muted-foreground">The requested Surah could not be found.</p>
              <Link href="/read">
                <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">Return to Surah List</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    )
  }

  // Show a message if no verses are available
  if (verses.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Link
                  href="/read"
                  className="mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to All Surahs
                </Link>
                <h1 className="text-3xl font-bold">
                  {surahId}. {chapter.name_simple}
                  <span className="ml-2 text-lg font-normal text-muted-foreground">
                    ({chapter.translated_name.name})
                  </span>
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {chapter.verses_count} verses • Revealed in {chapter.revelation_place}
                </p>
              </div>
            </div>

            <Alert className="mb-6">
              <AlertTitle>No Verses Available</AlertTitle>
              <AlertDescription>
                We couldn't load the verses for this surah at the moment. Please try again later.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button onClick={fetchChapterDetails} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/read" className="mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to All Surahs
              </Link>
              <h1 className="text-3xl font-bold">
                {surahId}. {chapter.name_simple}
                <span className="ml-2 text-lg font-normal text-muted-foreground">({chapter.translated_name.name})</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {chapter.verses_count} verses • Revealed in {chapter.revelation_place}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" asChild>
                <Link href={`/about#surah-${surahId}`}>
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Link>
              </Button>
              {audioUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={audioUrl} download={`surah-${surahId}.mp3`}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Audio</span>
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="mb-8 rounded-lg border bg-muted/30 p-4">
            <div className="grid gap-4 sm:flex sm:items-center sm:justify-between">
              <div className="grid gap-4 sm:flex sm:items-center sm:gap-6">
                <div>
                  <label className="mb-1 block text-xs font-medium">Reciter</label>
                  <Select defaultValue={reciterId.toString()} onValueChange={handleReciterChange}>
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Mishary Rashid Alafasy</SelectItem>
                      <SelectItem value="1">Abdul Basit</SelectItem>
                      <SelectItem value="3">Abdul Rahman Al-Sudais</SelectItem>
                      <SelectItem value="4">Abu Bakr al-Shatri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Primary Translation</label>
                  <Select defaultValue={primaryLanguage} onValueChange={handlePrimaryLanguageChange}>
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Font Size</label>
                  <Select defaultValue={fontSize} onValueChange={handleFontSizeChange}>
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {audioUrl && (
                <AudioPlayer
                  audioUrl={audioUrl}
                  title={`Surah ${chapter.name_simple}`}
                  reciter={reciterId === 7 ? "Mishary Alafasy" : reciterId === 1 ? "Abdul Basit" : "Al-Sudais"}
                  surahNumber={surahId}
                />
              )}
            </div>
          </div>

          <div className="mb-8 rounded-lg border bg-emerald-50 p-6 text-center dark:bg-emerald-950/30">
            <div className="mb-4 text-center">
              <h2 className="mb-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
              <p className="text-emerald-700 dark:text-emerald-400">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          </div>

          <Tabs defaultValue="reading">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="tafsir">Tafsir</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="space-y-8">
              {verses.map((verse) => (
                <div key={verse.id} className="rounded-lg border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                      {verse.verse_number}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleBookmark(verse)}>
                        <Bookmark
                          className={`h-4 w-4 ${bookmarkedVerses[verse.verse_key] ? "fill-emerald-600 dark:fill-emerald-400" : ""}`}
                        />
                        <span className="sr-only">Bookmark</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyVerse(verse)}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(verse)}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleViewTafsir(verse.verse_key)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Tafsir</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownloadAudio(verse)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>

                  <MultiTranslationView
                    verseKey={verse.verse_key}
                    arabicText={verse.text_uthmani}
                    primaryLanguage={primaryLanguage}
                    translations={[
                      { language: "ar", text: verse.text_uthmani },
                      { language: primaryLanguage, text: verse.translations[0]?.text || "" },
                      ...additionalLanguages
                        .filter((lang) => lang !== primaryLanguage && translations[verse.verse_key]?.[lang])
                        .map((lang) => ({
                          language: lang,
                          text: translations[verse.verse_key]?.[lang] || "",
                        })),
                    ]}
                    onAddLanguage={handleAddLanguage}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between">
                <Button variant="outline" className="gap-2" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous Page
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next Page
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tafsir" className="space-y-6">
              {selectedVerse ? (
                <div className="rounded-lg border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Tafsir of Verse {selectedVerse}</h3>
                    <Button variant="outline" size="sm" onClick={() => setSelectedVerse(null)}>
                      Back to All Verses
                    </Button>
                  </div>
                  <TafsirView verseKey={selectedVerse} />
                </div>
              ) : (
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-xl font-semibold">Tafsir of Surah {chapter.name_simple}</h3>
                  <p className="mb-4 text-muted-foreground">
                    Select a verse from the Reading tab to view its detailed tafsir (explanation and interpretation).
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {verses.map((verse) => (
                      <Button
                        key={verse.id}
                        variant="outline"
                        className="justify-start gap-2"
                        onClick={() => handleViewTafsir(verse.verse_key)}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                          {verse.verse_number}
                        </div>
                        <span>View Tafsir</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="topics" className="space-y-6">
              <div className="rounded-lg border p-6">
                <h3 className="mb-4 text-xl font-semibold">Topics in Surah {chapter.name_simple}</h3>
                <p className="mb-4 text-muted-foreground">
                  This section categorizes the main themes and topics covered in this Surah.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">Faith & Belief</h4>
                    <p className="text-sm text-muted-foreground">
                      Verses related to faith, belief in Allah, and the unseen.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">Prayer & Worship</h4>
                    <p className="text-sm text-muted-foreground">Verses related to prayer, remembrance, and worship.</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">Ethics & Morality</h4>
                    <p className="text-sm text-muted-foreground">
                      Verses related to good character, ethics, and moral values.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">Stories & History</h4>
                    <p className="text-sm text-muted-foreground">
                      Verses containing stories of prophets and historical events.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
