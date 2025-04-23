"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { LanguageSelector } from "@/components/language-selector"
import { Search, Play, Download, Clock, Headphones } from "lucide-react"
import { getReciters, getChapters, getChapterRecitation, type Reciter, type Chapter } from "@/lib/api"
import { AudioPlayer } from "@/components/audio-player"
import { Toaster } from "@/components/ui/toaster"

export default function ListenPage() {
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReciter, setSelectedReciter] = useState<string>("")
  const [selectedSurah, setSelectedSurah] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("murattal")
  const [currentAudio, setCurrentAudio] = useState<string>("")
  const [currentPlaying, setCurrentPlaying] = useState<{ reciter: string; surah: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Initialize with empty arrays to prevent undefined errors
        setReciters([])
        setFilteredReciters([])
        setChapters([])

        const [recitersData, chaptersData] = await Promise.all([getReciters(), getChapters()])

        // Only update state if we got valid data
        if (Array.isArray(recitersData)) {
          setReciters(recitersData)
          setFilteredReciters(recitersData)
        }

        if (Array.isArray(chaptersData)) {
          setChapters(chaptersData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Ensure we have empty arrays rather than undefined
        setReciters([])
        setFilteredReciters([])
        setChapters([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm && Array.isArray(reciters)) {
      const filtered = reciters.filter((reciter) =>
        reciter.reciter_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredReciters(filtered)
    } else {
      setFilteredReciters(reciters)
    }
  }, [searchTerm, reciters])

  const handleReciterSelect = (id: string) => {
    setSelectedReciter(id)
  }

  const handleSurahSelect = (id: string) => {
    setSelectedSurah(id)
  }

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style)
  }

  const handleSearch = () => {
    // The search is already handled by the useEffect above
  }

  const handlePlay = async (reciterId: number, surahId: number) => {
    try {
      const audioUrl = await getChapterRecitation(reciterId, surahId)
      setCurrentAudio(audioUrl)

      const reciter = reciters.find((r) => r.id === reciterId)
      const surah = chapters.find((c) => c.id === surahId)

      if (reciter && surah) {
        setCurrentPlaying({
          reciter: reciter.reciter_name,
          surah: surah.name_simple,
        })
      }
    } catch (error) {
      console.error("Error fetching audio:", error)
    }
  }

  const featuredReciters = [
    {
      id: 7,
      name: "Mishary Rashid Alafasy",
      origin: "Kuwait",
      image: "/placeholder.svg?height=300&width=300",
      surahs: 114,
    },
    {
      id: 1,
      name: "Abdul Basit Abdul Samad",
      origin: "Egypt",
      image: "/placeholder.svg?height=300&width=300",
      surahs: 114,
    },
    {
      id: 3,
      name: "Abdul Rahman Al-Sudais",
      origin: "Saudi Arabia",
      image: "/placeholder.svg?height=300&width=300",
      surahs: 114,
    },
    {
      id: 4,
      name: "Abu Bakr al-Shatri",
      origin: "Saudi Arabia",
      image: "/placeholder.svg?height=300&width=300",
      surahs: 114,
    },
  ]

  const popularSurahs = [
    {
      id: 1,
      name: "Al-Fatihah (The Opening)",
      duration: "1:20",
    },
    {
      id: 36,
      name: "Ya-Sin",
      duration: "23:45",
    },
    {
      id: 55,
      name: "Ar-Rahman (The Beneficent)",
      duration: "18:32",
    },
    {
      id: 67,
      name: "Al-Mulk (The Sovereignty)",
      duration: "12:15",
    },
    {
      id: 112,
      name: "Al-Ikhlas (The Sincerity)",
      duration: "0:45",
    },
    {
      id: 114,
      name: "An-Nas (Mankind)",
      duration: "0:58",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Listen to The Holy Quran</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Listen to beautiful recitations from renowned Qaris around the world
            </p>
          </div>

          {currentAudio && (
            <div className="mb-6 rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentPlaying?.surah}</h3>
                  <p className="text-sm text-muted-foreground">Recited by {currentPlaying?.reciter}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <a href={currentAudio} download={`${currentPlaying?.surah}-${currentPlaying?.reciter}.mp3`}>
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
              <AudioPlayer audioUrl={currentAudio} />
            </div>
          )}

          <div className="mb-8 sm:mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Select Reciter</label>
              <Select onValueChange={handleReciterSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Reciter" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading reciters...
                    </SelectItem>
                  ) : (
                    Array.isArray(reciters) &&
                    reciters.map((reciter) => (
                      <SelectItem key={reciter.id} value={reciter.id.toString()}>
                        {reciter.reciter_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Select Surah</label>
              <Select onValueChange={handleSurahSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Surah" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading surahs...
                    </SelectItem>
                  ) : (
                    Array.isArray(chapters) &&
                    chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id.toString()}>
                        {chapter.id}. {chapter.name_simple}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Recitation Style</label>
              <Select defaultValue={selectedStyle} onValueChange={handleStyleSelect}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="murattal">Murattal</SelectItem>
                  <SelectItem value="mujawwad">Mujawwad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Search Reciters</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {selectedReciter && selectedSurah && (
            <div className="mb-8 text-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handlePlay(Number.parseInt(selectedReciter), Number.parseInt(selectedSurah))}
              >
                <Play className="mr-2 h-4 w-4" />
                Play Selected Recitation
              </Button>
            </div>
          )}

          <div className="mb-8 sm:mb-10">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Featured Reciters</h2>
              <Button variant="link" className="text-emerald-600 dark:text-emerald-400">
                View All
              </Button>
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredReciters.map((reciter, index) => (
                <div
                  key={index}
                  className="group rounded-lg border bg-background p-4 transition-all hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                >
                  <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={reciter.image || "/placeholder.svg"}
                      alt={reciter.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-1 font-semibold">{reciter.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{reciter.origin}</p>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => handlePlay(reciter.id, 1)} // Play Al-Fatiha by default
                    >
                      <Headphones className="h-3 w-3" />
                      Listen
                    </Button>
                    <span className="text-xs text-muted-foreground">{reciter.surahs} Surahs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold">Popular Surahs</h2>
              <Button variant="link" className="text-emerald-600 dark:text-emerald-400">
                View All Surahs
              </Button>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularSurahs.map((surah, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 transition-all hover:border-emerald-200 hover:shadow-sm dark:hover:border-emerald-800"
                >
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    {surah.id}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{surah.name}</div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {surah.duration}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handlePlay(7, surah.id)} // Use Mishary by default
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hidden sm:flex" asChild>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePlay(7, surah.id).then(() => {
                            if (currentAudio) {
                              const link = document.createElement("a")
                              link.href = currentAudio
                              link.download = `surah-${surah.id}.mp3`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }
                          })
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
