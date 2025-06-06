"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  BookOpen,
  Headphones,
  SearchIcon,
  Star,
  TrendingUp,
  BookMarked,
  Bookmark,
  MessageCircle,
  Calendar,
  Clock,
} from "lucide-react"
import { DailyAyah } from "@/components/daily-ayah"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { PrayerTimesWidget } from "@/components/prayer-times"
import { getChapters, type Chapter, getLanguage, getRandomVerse } from "@/lib/api-service"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IslamicQuiz } from "@/components/islamic-quiz"
import { WordScramble } from "@/components/word-scramble"
import { MemoryMatch } from "@/components/memory-match"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DailyHadith } from "@/components/daily-hadith"
import { IslamicCalendar } from "@/components/islamic-calendar"
import { DhikrCounter } from "@/components/dhikr-counter"

export default function HomePage() {
  const [featuredSurahs, setFeaturedSurahs] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [inspirationalVerses, setInspirationalVerses] = useState<any[]>([])
  const [loadingVerses, setLoadingVerses] = useState(true)
  const [stats, setStats] = useState({
    totalSurahs: 114,
    totalVerses: 6236,
    totalWords: 77430,
    totalLetters: 323015,
  })

  useEffect(() => {
    const fetchSurahs = async () => {
      setLoading(true)
      try {
        const language = getLanguage()
        const chapters = await getChapters(language)

        // Get featured surahs (1, 36, 55, 67, 112, 114)
        const featured = [1, 36, 55, 67, 112, 114]
          .map((id) => chapters.find((chapter) => chapter.id === id))
          .filter(Boolean) as Chapter[]

        setFeaturedSurahs(featured)
      } catch (error) {
        console.error("Error fetching surahs:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchInspirationalVerses = async () => {
      setLoadingVerses(true)
      try {
        // Fetch 3 random verses for inspiration
        const verses = []
        for (let i = 0; i < 3; i++) {
          try {
            const verse = await getRandomVerse()
            if (verse) verses.push(verse)
          } catch (e) {
            console.error("Error fetching random verse:", e)
          }
        }

        // If API fails, use fallback verses
        if (verses.length === 0) {
          setInspirationalVerses([
            {
              verse_key: "2:286",
              text_uthmani: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
              translations: [{ text: "Allah does not burden a soul beyond what it can bear" }],
            },
            {
              verse_key: "94:5-6",
              text_uthmani: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
              translations: [
                { text: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease." },
              ],
            },
            {
              verse_key: "3:139",
              text_uthmani: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
              translations: [
                { text: "So do not weaken and do not grieve, and you will be superior if you are [true] believers." },
              ],
            },
          ])
        } else {
          setInspirationalVerses(verses)
        }
      } catch (error) {
        console.error("Error fetching inspirational verses:", error)
        // Set fallback verses
        setInspirationalVerses([
          {
            verse_key: "2:286",
            text_uthmani: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
            translations: [{ text: "Allah does not burden a soul beyond what it can bear" }],
          },
          {
            verse_key: "94:5-6",
            text_uthmani: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
            translations: [{ text: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease." }],
          },
          {
            verse_key: "3:139",
            text_uthmani: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
            translations: [
              { text: "So do not weaken and do not grieve, and you will be superior if you are [true] believers." },
            ],
          },
        ])
      } finally {
        setLoadingVerses(false)
      }
    }

    fetchSurahs()
    fetchInspirationalVerses()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
          <div className="container relative py-12 sm:py-16 md:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  The Holy Quran
                  <span className="block text-emerald-600 dark:text-emerald-400">Guidance for Humanity</span>
                </h1>
                <p className="max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl">
                  Explore the divine words of Allah through our modern, accessible platform. Read, listen, and
                  understand the Holy Quran in multiple languages.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/read">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read Quran
                    </Button>
                  </Link>
                  <Link href="/listen">
                    <Button variant="outline">
                      <Headphones className="mr-2 h-4 w-4" />
                      Listen
                    </Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline">
                      <SearchIcon className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Community
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full border-8 border-emerald-50 dark:border-emerald-950 lg:h-[400px] lg:w-[400px]">
                <Image
                  src="https://www.ahmadiyya-islam.org/wp-content/uploads/2021/04/malik-shibly-lKbz2ejxYbA-unsplash.jpg"
                  alt="Holy Quran Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quran Statistics Section */}
        <section className="py-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                <BookOpen className="h-6 w-6 text-emerald-600 mb-2" />
                <h3 className="text-xl font-bold">{stats.totalSurahs}</h3>
                <p className="text-sm text-muted-foreground">Surahs</p>
              </div>
              <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                <BookMarked className="h-6 w-6 text-emerald-600 mb-2" />
                <h3 className="text-xl font-bold">{stats.totalVerses}</h3>
                <p className="text-sm text-muted-foreground">Verses</p>
              </div>
              <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                <TrendingUp className="h-6 w-6 text-emerald-600 mb-2" />
                <h3 className="text-xl font-bold">{stats.totalWords.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Words</p>
              </div>
              <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105">
                <Star className="h-6 w-6 text-emerald-600 mb-2" />
                <h3 className="text-xl font-bold">{stats.totalLetters.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">Letters</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Section - Improved Responsive Layout */}
        <section className="container py-10">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Left Column - 8 columns on md+ */}
            <div className="md:col-span-8 space-y-6">
              {/* Daily Verse */}
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5 text-emerald-600" />
                    Daily Verse of Reflection
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 px-6">
                  <DailyAyah />
                </CardContent>
              </Card>

              {/* Dhikr Counter */}
              <Card className="overflow-hidden shadow-md">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-emerald-600" />
                    Dhikr Counter
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 px-5">
                  <DhikrCounter />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 4 columns on md+ */}
            <div className="md:col-span-4 space-y-6">
              {/* Responsive Grid for Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                {/* Prayer Times Widget */}
                <Card className="overflow-hidden shadow-md h-full">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      Prayer Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 px-5">
                    <PrayerTimesWidget />
                  </CardContent>
                </Card>

                {/* Islamic Calendar */}
                <Card className="overflow-hidden shadow-md h-full">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      Islamic Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 px-5">
                    <IslamicCalendar />
                  </CardContent>
                </Card>
              </div>

              {/* Daily Hadith */}
              <Card className="shadow-md">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookMarked className="h-5 w-5 text-emerald-600" />
                    Hadith of the Day
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 px-5">
                  <DailyHadith />
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="shadow-md">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-emerald-600" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 px-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/bookmarks"
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">My Bookmarks</span>
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Link>
                    <Link
                      href="/read/36"
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">Surah Ya-Sin</span>
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Link>
                    <Link
                      href="/read/55"
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">Surah Ar-Rahman</span>
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Link>
                    <Link
                      href="/read/67"
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">Surah Al-Mulk</span>
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Link>
                    <Link
                      href="/community"
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="font-medium">Community</span>
                      <ChevronRight className="h-4 w-4 text-emerald-600" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Surahs Section */}
        <section className="container py-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Surahs</h2>
              <Link href="/read">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse rounded-xl shadow-sm border bg-background p-5">
                    <div className="mb-3 h-8 w-8 rounded-full bg-muted"></div>
                    <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
                    <div className="mb-4 h-4 w-1/2 rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {featuredSurahs.map((surah) => (
                  <Link
                    key={surah.id}
                    href={`/read/${surah.id}`}
                    className="group relative overflow-hidden rounded-xl shadow-sm border bg-background p-5 transition-all hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                  >
                    <div className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                      {surah.verses_count} verses
                    </div>
                    <div className="mb-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{surah.id}</div>
                    <h3 className="mb-1 text-xl font-bold">{surah.name_simple}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">{surah.translated_name.name}</p>
                    <div className="mt-3 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Read Surah
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Inspirational Verses Section - Improved Responsive Design */}
        <section className="border-t border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="container py-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Inspirational Verses</h2>
              <p className="mt-2 text-muted-foreground">Find comfort and guidance in these selected verses</p>
            </div>

            <div className="grid gap-6 md:gap-8">
              {loadingVerses
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden shadow-md">
                        <CardHeader className="pb-0">
                          <Skeleton className="h-4 w-24 mb-2" />
                        </CardHeader>
                        <CardContent className="pt-4">
                          <Skeleton className="h-20 w-full mb-4" />
                          <Skeleton className="h-12 w-full" />
                        </CardContent>
                      </Card>
                    ))
                : inspirationalVerses.map((verse, index) => (
                    <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3 border-b bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
                        <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {verse.verse_key}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 px-5">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                          <div className="order-2 md:order-1">
                            <p className="text-sm text-muted-foreground">
                              {verse.translations && verse.translations[0]
                                ? verse.translations[0].text
                                : "Translation not available"}
                            </p>
                          </div>
                          <div className="order-1 md:order-2">
                            <p className="text-right font-arabic text-xl leading-relaxed" dir="rtl">
                              {verse.text_uthmani}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          <Link href={`/read/${verse.verse_key.split(":")[0]}#verse-${verse.verse_key.split(":")[1]}`}>
                            <ChevronRight className="mr-1 h-4 w-4" />
                            Read in Context
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Bookmark className="h-4 w-4" />
                          Bookmark
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </div>
        </section>

        {/* Islamic Learning Games Section */}
        <section className="container py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Islamic Learning Games</h2>
            <p className="mt-2 text-muted-foreground">
              Engage with interactive games to enhance your Islamic knowledge
            </p>
          </div>

          <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl">
              <TabsTrigger value="quiz" className="rounded-l-xl">
                Islamic Quiz
              </TabsTrigger>
              <TabsTrigger value="scramble">Word Scramble</TabsTrigger>
              <TabsTrigger value="memory" className="rounded-r-xl">
                Memory Match
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quiz">
              <div className="max-w-2xl mx-auto">
                <IslamicQuiz />
              </div>
            </TabsContent>
            <TabsContent value="scramble">
              <div className="max-w-2xl mx-auto">
                <WordScramble />
              </div>
            </TabsContent>
            <TabsContent value="memory">
              <div className="max-w-2xl mx-auto">
                <MemoryMatch />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
