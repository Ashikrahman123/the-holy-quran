"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import { getChapters, type Chapter, getLanguage } from "@/lib/api"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { LANGUAGES, type Language } from "@/lib/language"

export default function ReadPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [filteredChapters, setFilteredChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJuz, setSelectedJuz] = useState<string>("")
  const [language, setLanguage] = useState<Language>(getLanguage())

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true)
      try {
        const lang = getLanguage()
        setLanguage(lang)
        const data = await getChapters(lang)
        setChapters(data)
        setFilteredChapters(data)
      } catch (error) {
        console.error("Error fetching chapters:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = chapters.filter(
        (chapter) =>
          chapter.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.translated_name.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chapter.id.toString().includes(searchTerm),
      )
      setFilteredChapters(filtered)
    } else {
      setFilteredChapters(chapters)
    }
  }, [searchTerm, chapters])

  const handleSurahSelect = (id: string) => {
    if (id) {
      window.location.href = `/read/${id}`
    }
  }

  const handleJuzSelect = (juz: string) => {
    setSelectedJuz(juz)
    // In a real implementation, you would filter chapters by juz
    // This would require additional API data about which chapters are in which juz
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language)
    // Refetch chapters with the new language
    const fetchChaptersWithLanguage = async () => {
      setLoading(true)
      try {
        const data = await getChapters(lang as Language)
        setChapters(data)
        setFilteredChapters(data)
      } catch (error) {
        console.error("Error fetching chapters:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchChaptersWithLanguage()
  }

  const handleSearch = () => {
    // The search is already handled by the useEffect above
  }

  const recentlyRead = [
    { id: 1, name: "Al-Fatihah", verse: 5 },
    { id: 36, name: "Ya-Sin", verse: 12 },
    { id: 55, name: "Ar-Rahman", verse: 7 },
    { id: 67, name: "Al-Mulk", verse: 3 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Read The Holy Quran</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Select a Surah to begin reading or use the search to find specific verses
            </p>
          </div>

          <div className="mb-8 sm:mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Select Surah</label>
              <Select onValueChange={handleSurahSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Surah" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id.toString()}>
                      {chapter.id}. {chapter.name_simple}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Select Juz</label>
              <Select onValueChange={handleJuzSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Juz" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(30)].map((_, i) => (
                    <SelectItem key={i} value={`${i + 1}`}>
                      Juz {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Translation</label>
              <Select defaultValue={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
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
              <label className="mb-2 block text-sm font-medium">Search Surahs</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-10 rounded-lg border bg-muted/30 p-4 sm:p-6">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold">Recently Read</h2>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyRead.map((item) => (
                <Link
                  key={item.id}
                  href={`/read/${item.id}`}
                  className="group flex items-center gap-3 rounded-md border bg-background p-3 transition-colors hover:border-emerald-200 hover:shadow-sm dark:hover:border-emerald-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Last read: Verse {item.verse}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold">All Surahs</h2>
            {loading ? (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted"></div>
                      <div className="h-5 w-24 rounded bg-muted"></div>
                    </div>
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/read/${chapter.id}`}
                    className="group flex items-center justify-between rounded-md border p-3 transition-colors hover:border-emerald-200 hover:bg-muted/30 hover:shadow-sm dark:hover:border-emerald-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                        {chapter.id}
                      </div>
                      <div>
                        <div className="font-medium">{chapter.name_simple}</div>
                        <div className="text-xs text-muted-foreground">{chapter.translated_name.name}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
