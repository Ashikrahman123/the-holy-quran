"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { SearchIcon, Bookmark, ExternalLink, History } from "lucide-react"
import { searchQuran, getChapters, type SearchResult, type Chapter } from "@/lib/api-service"
import { addBookmark, isBookmarked } from "@/lib/bookmarks"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { useUserPreferences } from "@/contexts/user-preferences-context"
import { LANGUAGES, type Language } from "@/lib/language"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SearchPage() {
  const { preferences } = useUserPreferences()
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [recentSearches, setRecentSearches] = useState<{ term: string; results: number; date: string }[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load recent searches from localStorage
    const loadRecentSearches = () => {
      if (typeof window === "undefined") return

      const savedSearches = localStorage.getItem("quran_app_recent_searches")
      if (savedSearches) {
        try {
          setRecentSearches(JSON.parse(savedSearches))
        } catch (error) {
          console.error("Error parsing recent searches:", error)
        }
      }
    }

    // Load chapters for search suggestions
    const loadChapters = async () => {
      try {
        const chaptersData = await getChapters()
        setChapters(chaptersData)
      } catch (error) {
        console.error("Error loading chapters:", error)
      }
    }

    loadRecentSearches()
    loadChapters()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const language = preferences.language as Language

      // Check if search term is a chapter number
      const chapterNumber = Number.parseInt(searchTerm)
      if (!isNaN(chapterNumber) && chapterNumber >= 1 && chapterNumber <= 114) {
        // Redirect to the chapter page
        window.location.href = `/read/${chapterNumber}`
        return
      }

      // Check if search term is a verse reference (e.g., "2:255")
      const verseRegex = /^(\d+):(\d+)$/
      const verseMatch = searchTerm.match(verseRegex)
      if (verseMatch) {
        const [, surah, verse] = verseMatch
        window.location.href = `/read/${surah}#verse-${verse}`
        return
      }

      // Check if search term matches a chapter name
      const matchedChapter = chapters.find(
        (chapter) =>
          chapter.name_simple?.toLowerCase() === searchTerm.toLowerCase() ||
          chapter.englishName?.toLowerCase() === searchTerm.toLowerCase() ||
          chapter.englishNameTranslation?.toLowerCase() === searchTerm.toLowerCase(),
      )

      if (matchedChapter) {
        window.location.href = `/read/${matchedChapter.id}`
        return
      }

      // Perform regular search
      const data = await searchQuran(searchTerm, 20, language)

      if (data.search.results.length === 0) {
        setError(`No results found for "${searchTerm}". Please try a different search term.`)
      } else {
        setResults(data.search.results)

        // Save to recent searches
        const newSearch = {
          term: searchTerm,
          results: data.search.total_results,
          date: new Date().toLocaleDateString(),
        }

        const updatedSearches = [newSearch, ...recentSearches.filter((s) => s.term !== searchTerm).slice(0, 4)]
        setRecentSearches(updatedSearches)

        if (typeof window !== "undefined") {
          localStorage.setItem("quran_app_recent_searches", JSON.stringify(updatedSearches))
        }
      }
    } catch (error) {
      console.error("Error searching:", error)
      setError("There was an error performing your search. Please try again.")
      toast({
        title: "Search Error",
        description: "There was an error performing your search. Please try again.",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleBookmark = (result: SearchResult) => {
    try {
      const verseKey = `${result.surah}:${result.verse}`
      if (!isBookmarked(verseKey)) {
        addBookmark({
          verseKey,
          chapterName: result.surah.toString(),
          verseText: result.text,
          translation: result.text,
        })

        toast({
          title: "Bookmark added",
          description: `Verse ${verseKey} has been bookmarked.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "Already bookmarked",
          description: "This verse is already in your bookmarks.",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding your bookmark.",
        duration: 3000,
      })
    }
  }

  const popularTopics = [
    {
      name: "Prayer (Salah)",
      keywords: ["prayer", "salah", "salat"],
      description: "Verses related to the importance and method of prayer in Islam",
    },
    {
      name: "Mercy",
      keywords: ["mercy", "compassion", "rahman", "raheem"],
      description: "Verses highlighting Allah's mercy and compassion towards His creation",
    },
    {
      name: "Patience (Sabr)",
      keywords: ["patience", "sabr"],
      description: "Verses encouraging patience during hardship and trials",
    },
    {
      name: "Forgiveness",
      keywords: ["forgiveness", "forgive", "pardon"],
      description: "Verses about seeking and granting forgiveness",
    },
    {
      name: "Gratitude (Shukr)",
      keywords: ["gratitude", "thankful", "shukr"],
      description: "Verses emphasizing the importance of being grateful to Allah",
    },
    {
      name: "Charity",
      keywords: ["charity", "giving", "zakat", "sadaqah"],
      description: "Verses about the virtues of charity and helping others",
    },
  ]

  const currentLanguage = LANGUAGES.find((lang) => lang.code === preferences.language) || LANGUAGES[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Search The Holy Quran</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Search for verses, topics, or keywords in the Holy Quran
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 sm:top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by verse number (e.g., 2:255), surah name, or keywords..."
                className="pl-10 py-2 sm:py-6 text-base sm:text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                dir={currentLanguage.direction}
                style={{ fontFamily: currentLanguage.fontFamily }}
              />
              <Button
                className="absolute right-1 top-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {popularTopics.slice(0, 5).map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm(topic.keywords[0])
                    handleSearch()
                  }}
                >
                  {topic.name.split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>

          {error && (
            <Card className="mb-8 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {results.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Search Results for "{searchTerm}"</h2>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const verseKey = `${result.surah}:${result.verse}`
                  return (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Link
                          href={`/read/${result.surah}#verse-${result.verse}`}
                          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Surah {result.surah} : Verse {result.verse}
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleBookmark(result)}
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/read/${result.surah}#verse-${result.verse}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="mb-3 text-right">
                        <p
                          className="font-arabic text-lg leading-relaxed text-emerald-800 dark:text-emerald-200"
                          dir="rtl"
                          style={{ fontFamily: "Amiri, serif" }}
                        >
                          {result.text}
                        </p>
                      </div>
                      <div className="border-t pt-3">
                        <p
                          className="text-muted-foreground"
                          dir={currentLanguage.direction}
                          style={{ fontFamily: currentLanguage.fontFamily }}
                        >
                          {result.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="verses">Verses</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Recent Searches</h2>
                  {recentSearches.length > 0 ? (
                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="rounded-lg border p-3 sm:p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:hover:border-emerald-800 cursor-pointer"
                          onClick={() => {
                            setSearchTerm(search.term)
                            handleSearch()
                          }}
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{search.term}</span>
                          </div>
                          <p className="mb-2 text-xs sm:text-sm text-muted-foreground">
                            {search.results} results found
                          </p>
                          <div className="text-xs text-muted-foreground">Searched on {search.date}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No recent searches</p>
                  )}
                </div>

                <div>
                  <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Popular Topics</h2>
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {popularTopics.map((topic, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-3 sm:p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:hover:border-emerald-800 cursor-pointer"
                        onClick={() => {
                          setSearchTerm(topic.keywords[0])
                          handleSearch()
                        }}
                      >
                        <h3 className="mb-2 font-medium">{topic.name}</h3>
                        <p className="mb-2 text-xs sm:text-sm text-muted-foreground">{topic.description}</p>
                        <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                          <Button variant="link" className="h-auto p-0 text-xs text-emerald-600 dark:text-emerald-400">
                            Search verses
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="verses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Search by Verse Reference</CardTitle>
                    <CardDescription>Enter a verse reference like "2:255" (Surah 2, Verse 255)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., 2:255, 1:1, 36:1"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button onClick={handleSearch}>Search</Button>
                      </div>
                      <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                        {[
                          { surah: 1, verse: 1, name: "Al-Fatihah" },
                          { surah: 2, verse: 255, name: "Ayatul Kursi" },
                          { surah: 36, verse: 1, name: "Ya-Sin" },
                          { surah: 55, verse: 1, name: "Ar-Rahman" },
                        ].map((item, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            onClick={() => {
                              setSearchTerm(`${item.surah}:${item.verse}`)
                              handleSearch()
                            }}
                          >
                            {item.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Search by Topic</CardTitle>
                    <CardDescription>Explore verses related to common Islamic topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {popularTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-start text-left"
                          onClick={() => {
                            setSearchTerm(topic.keywords[0])
                            handleSearch()
                          }}
                        >
                          <span className="font-medium">{topic.name}</span>
                          <span className="text-xs text-muted-foreground mt-1">{topic.description}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Search History</CardTitle>
                    <CardDescription>Your recent searches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentSearches.length > 0 ? (
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              setSearchTerm(search.term)
                              handleSearch()
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <History className="h-4 w-4 text-muted-foreground" />
                              <span>{search.term}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{search.results} results</span>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <SearchIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No search history yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
