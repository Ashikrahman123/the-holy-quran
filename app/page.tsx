"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookOpen, Headphones, SearchIcon, Star, TrendingUp, BookMarked, Bookmark } from "lucide-react"
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
import { Calendar, Clock } from "lucide-react"

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
        <section className="relative">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
          <div className="container relative py-12 sm:py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
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
                </div>
              </div>
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full border-8 border-emerald-50 dark:border-emerald-950 lg:h-[500px] lg:w-[500px]">
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
        <section className="py-12 bg-emerald-50 dark:bg-emerald-950/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-white dark:bg-background border-emerald-100 dark:border-emerald-900">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <BookOpen className="h-8 w-8 text-emerald-600 mb-2" />
                  <h3 className="text-xl font-bold">{stats.totalSurahs}</h3>
                  <p className="text-sm text-muted-foreground">Surahs</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-background border-emerald-100 dark:border-emerald-900">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <BookMarked className="h-8 w-8 text-emerald-600 mb-2" />
                  <h3 className="text-xl font-bold">{stats.totalVerses}</h3>
                  <p className="text-sm text-muted-foreground">Verses</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-background border-emerald-100 dark:border-emerald-900">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
                  <h3 className="text-xl font-bold">{stats.totalWords.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground">Words</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-background border-emerald-100 dark:border-emerald-900">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  <Star className="h-8 w-8 text-emerald-600 mb-2" />
                  <h3 className="text-xl font-bold">{stats.totalLetters.toLocaleString()}</h3>
                  <p className="text-sm text-muted-foreground">Letters</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t border-b bg-muted/50">
          <div className="container py-12 sm:py-16 md:py-20">
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">Daily Verse</h2>
            <DailyAyah />
          </div>
        </section>

        {/* Inspirational Verses Section */}
        <section className="container py-12 sm:py-16 md:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Inspirational Verses</h2>
            <p className="mt-4 text-muted-foreground">Find comfort and guidance in these selected verses</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {loadingVerses
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
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
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {verse.verse_key}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="mb-4 text-right font-arabic text-lg leading-relaxed" dir="rtl">
                        {verse.text_uthmani}
                      </p>
                      <p className="text-sm text-muted-foreground">{verse.translations[0]?.text}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="ghost" size="sm" asChild>
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
        </section>

        <section className="container py-12 sm:py-16 md:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Surahs</h2>
            <p className="mt-4 text-muted-foreground">Explore some of the most read chapters of the Holy Quran</p>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse rounded-lg border bg-background p-4 sm:p-6">
                  <div className="mb-3 h-8 w-8 rounded-full bg-muted"></div>
                  <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
                  <div className="mb-4 h-4 w-1/2 rounded bg-muted"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/4 rounded bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSurahs.map((surah) => (
                <Link
                  key={surah.id}
                  href={`/read/${surah.id}`}
                  className="group relative overflow-hidden rounded-lg border bg-background p-4 sm:p-6 transition-all hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
                >
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                    {surah.verses_count} verses
                  </div>
                  <div className="mb-3 text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {surah.id}
                  </div>
                  <h3 className="mb-1 text-lg sm:text-xl font-bold">{surah.name_simple}</h3>
                  <p className="mb-3 text-xs sm:text-sm text-muted-foreground">{surah.translated_name.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2 capitalize">{surah.revelation_place}</span>
                    <span className="flex items-center">
                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Popular
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Read Surah
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 sm:mt-10 text-center">
            <Link href="/read">
              <Button variant="outline" className="gap-2">
                View All Surahs
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="container py-12 sm:py-16 md:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Islamic Learning Games</h2>
            <p className="mt-4 text-muted-foreground">
              Engage with interactive games to enhance your Islamic knowledge
            </p>
          </div>

          <Tabs defaultValue="quiz" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="quiz">Islamic Quiz</TabsTrigger>
              <TabsTrigger value="scramble">Word Scramble</TabsTrigger>
              <TabsTrigger value="memory">Memory Match</TabsTrigger>
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

        <section className="border-t bg-muted/30">
          <div className="container py-12 sm:py-16 md:py-20">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Islamic Resources</h2>
              <p className="mt-4 text-muted-foreground">Daily guidance and spiritual resources for Muslims</p>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
              {/* Main Content - Left Side (8 columns on md+) */}
              <div className="md:col-span-8 space-y-8">
                {/* Daily Ayah Card */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Daily Verse of Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DailyAyah />
                  </CardContent>
                </Card>

                {/* Islamic Articles Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Islamic Articles</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">The Importance of Prayer</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Prayer is the cornerstone of faith and the direct connection between the servant and their
                          Lord.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ChevronRight className="h-4 w-4" />
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Understanding Ramadan</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground">
                          Ramadan is a month of fasting, prayer, reflection and community for Muslims worldwide.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ChevronRight className="h-4 w-4" />
                          Read More
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* Daily Hadith Section */}
                <Card>
                  <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30">
                    <CardTitle className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5" />
                      Hadith of the Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DailyHadith />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Right Side (4 columns on md+) */}
              <div className="md:col-span-4 space-y-6">
                {/* Prayer Times Widget */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5" />
                      Prayer Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <PrayerTimesWidget />
                  </CardContent>
                </Card>

                {/* Islamic Calendar */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-emerald-50 dark:bg-emerald-950/30 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5" />
                      Islamic Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <IslamicCalendar />
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <Link
                        href="/bookmarks"
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <span>My Bookmarks</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/read/36"
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <span>Surah Ya-Sin</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/read/55"
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <span>Surah Ar-Rahman</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/read/67"
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <span>Surah Al-Mulk</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/read/112"
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <span>Surah Al-Ikhlas</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Islamic Quotes */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Islamic Quote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-muted-foreground">
                      "The world is a prison for the believer and a paradise for the disbeliever."
                      <footer className="mt-2 text-sm font-medium">— Prophet Muhammad ﷺ</footer>
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
