"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Heart, Star, Volume2, VolumeX } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import namesData from "@/data/99-names-of-allah.json"

interface Name {
  name: string
  transliteration: string
  number: number
  found: string
  en: {
    meaning: string
    desc: string
  }
  fr: {
    meaning: string
    desc: string
  }
}

export default function NamesOfAllahPage() {
  const [names] = useState<Name[]>(namesData.data)
  const [filteredNames, setFilteredNames] = useState<Name[]>(names)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedName, setSelectedName] = useState<Name | null>(null)
  const [language, setLanguage] = useState<"en" | "fr">("en")
  const [isPlaying, setIsPlaying] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const filtered = names.filter(
      (name) =>
        name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name[language].meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.number.toString().includes(searchTerm),
    )
    setFilteredNames(filtered)
  }, [searchTerm, names, language])

  const playPronunciation = (name: Name) => {
    // Simple text-to-speech for Arabic pronunciation
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(name.transliteration)
      utterance.lang = "ar-SA"
      utterance.rate = 0.7

      utterance.onstart = () => setIsPlaying(name.number)
      utterance.onend = () => setIsPlaying(null)

      speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Audio not supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      })
    }
  }

  const stopPronunciation = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsPlaying(null)
    }
  }

  const addToFavorites = (name: Name) => {
    // Store in localStorage for now
    const favorites = JSON.parse(localStorage.getItem("favorite_names") || "[]")
    if (!favorites.find((fav: Name) => fav.number === name.number)) {
      favorites.push(name)
      localStorage.setItem("favorite_names", JSON.stringify(favorites))
      toast({
        title: "Added to Favorites",
        description: `${name.transliteration} has been added to your favorites.`,
      })
    } else {
      toast({
        title: "Already in Favorites",
        description: `${name.transliteration} is already in your favorites.`,
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 py-16">
          <div className="container relative">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                The 99 Names of Allah
                <span className="block text-emerald-600 dark:text-emerald-400 text-2xl md:text-3xl mt-2">
                  أسماء الله الحسنى
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Learn and memorize the beautiful names of Allah (Asma ul-Husna) with their meanings, benefits, and
                Quranic references. Each name reveals a divine attribute of the Almighty.
              </p>

              {/* Language Toggle */}
              <div className="flex justify-center gap-2">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  English
                </Button>
                <Button
                  variant={language === "fr" ? "default" : "outline"}
                  onClick={() => setLanguage("fr")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Français
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, meaning, or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Found {filteredNames.length} of {names.length} names
              </p>
            </div>
          </div>
        </section>

        {/* Names Grid */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNames.map((name) => (
                <Card
                  key={name.number}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-emerald-500"
                  onClick={() => setSelectedName(name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                      >
                        #{name.number}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isPlaying === name.number) {
                              stopPronunciation()
                            } else {
                              playPronunciation(name)
                            }
                          }}
                        >
                          {isPlaying === name.number ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToFavorites(name)
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-center space-y-2">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 arabic-text">
                        {name.name}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{name.transliteration}</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">{name[language].meaning}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{name[language].desc}</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <BookOpen className="h-3 w-3" />
                        <span>Found in: {name.found}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Benefits of Learning the 99 Names
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The Prophet Muhammad (peace be upon him) said: "Allah has ninety-nine names, whoever memorizes them will
                enter Paradise."
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Spiritual Connection</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Deepen your relationship with Allah by understanding His beautiful attributes and qualities.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inner Peace</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reciting and reflecting on these names brings tranquility and peace to the heart.
                </p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enhanced Worship</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use these names in your prayers and supplications for more meaningful worship.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Detailed View Modal */}
        {selectedName && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="text-center border-b">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    #{selectedName.number}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedName(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <CardTitle className="space-y-4">
                  <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 arabic-text">
                    {selectedName.name}
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedName.transliteration}
                  </div>
                  <div className="text-xl text-emerald-700 dark:text-emerald-300">{selectedName[language].meaning}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedName[language].desc}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Found in Quran</h3>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{selectedName.found}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      if (isPlaying === selectedName.number) {
                        stopPronunciation()
                      } else {
                        playPronunciation(selectedName)
                      }
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isPlaying === selectedName.number ? (
                      <>
                        <VolumeX className="mr-2 h-4 w-4" />
                        Stop Audio
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Pronunciation
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => addToFavorites(selectedName)}>
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
