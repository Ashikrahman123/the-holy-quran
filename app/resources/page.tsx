"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { IslamicCalendar } from "@/components/islamic-calendar"
import { IslamicNews } from "@/components/islamic-news"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Newspaper, BookOpen, GraduationCap } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Islamic Resources</h1>
            <p className="text-muted-foreground">Explore Islamic calendar, news, and educational resources</p>
          </div>

          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Articles</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Learn</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <IslamicCalendar />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-xl font-semibold">Prayer Times</h2>
                  <p className="mb-4 text-muted-foreground">
                    Prayer times are calculated based on your location. Please enable location services or enter your
                    location manually.
                  </p>
                  <div className="space-y-2">
                    {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer) => (
                      <div key={prayer} className="flex items-center justify-between rounded-md bg-muted p-2">
                        <span>{prayer}</span>
                        <span className="font-medium">--:--</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-xl font-semibold">Upcoming Islamic Events</h2>
                  <div className="space-y-3">
                    <div className="rounded-md border p-3">
                      <h3 className="font-medium">Ramadan</h3>
                      <p className="text-sm text-muted-foreground">Expected to begin around March 10, 2024</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <h3 className="font-medium">Laylat al-Qadr</h3>
                      <p className="text-sm text-muted-foreground">Expected around April 6, 2024</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <h3 className="font-medium">Eid al-Fitr</h3>
                      <p className="text-sm text-muted-foreground">Expected around April 10, 2024</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <h3 className="font-medium">Hajj</h3>
                      <p className="text-sm text-muted-foreground">Expected to begin around June 14, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="news">
              <IslamicNews />
            </TabsContent>

            <TabsContent value="articles">
              <div className="rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">Featured Articles</h2>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Understanding the Five Pillars of Islam</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      An in-depth exploration of the fundamental practices that form the foundation of Islamic faith.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">By Sheikh Abdullah • 15 min read</span>
                      <a href="#" className="text-xs text-emerald-600 hover:underline">
                        Read more
                      </a>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">The Importance of Dhikr in Daily Life</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      How remembrance of Allah can bring peace and tranquility to your everyday routine.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">By Aisha Rahman • 10 min read</span>
                      <a href="#" className="text-xs text-emerald-600 hover:underline">
                        Read more
                      </a>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Islamic Ethics in the Modern World</h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Navigating contemporary challenges while staying true to Islamic principles and values.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">By Dr. Yasmin Ali • 20 min read</span>
                      <a href="#" className="text-xs text-emerald-600 hover:underline">
                        Read more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="learn">
              <div className="space-y-6">
                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-xl font-semibold">Learning Resources</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 font-medium">Quran Recitation</h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Learn proper Tajweed rules and improve your Quran recitation with guided lessons.
                      </p>
                      <a href="#" className="text-sm text-emerald-600 hover:underline">
                        Start learning
                      </a>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 font-medium">Arabic Language</h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Begin your journey to understanding the language of the Quran with our Arabic courses.
                      </p>
                      <a href="#" className="text-sm text-emerald-600 hover:underline">
                        Start learning
                      </a>
                    </div>

                    <div className="rounded-md border p-4">
                      <h3 className="mb-2 font-medium">Islamic History</h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        Explore the rich history of Islam from its beginnings to the present day.
                      </p>
                      <a href="#" className="text-sm text-emerald-600 hover:underline">
                        Start learning
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-xl font-semibold">Educational Videos</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-md border">
                      <div className="aspect-video bg-muted">
                        <div className="flex h-full items-center justify-center">
                          <span className="text-muted-foreground">Video Preview</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">Introduction to Islamic Beliefs</h3>
                        <p className="text-sm text-muted-foreground">A beginner's guide to the core beliefs in Islam</p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-md border">
                      <div className="aspect-video bg-muted">
                        <div className="flex h-full items-center justify-center">
                          <span className="text-muted-foreground">Video Preview</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">Prayer Tutorial</h3>
                        <p className="text-sm text-muted-foreground">Learn how to perform Salah correctly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
