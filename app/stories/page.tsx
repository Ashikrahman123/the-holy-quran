"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, BookOpen, Clock, Star } from "lucide-react"
import { useAudio } from "@/contexts/audio-context"
import Image from "next/image"

// Define the structure for our stories
interface Story {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  audioUrl: string
  duration: string
  featured?: boolean
}

// Sample data for Islamic stories
const islamicStories: Story[] = [
  {
    id: "prophet-ibrahim",
    title: "Prophet Ibrahim and the Fire",
    description: "The story of Prophet Ibrahim (Abraham) being thrown into the fire and how Allah saved him.",
    category: "Prophets",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Ibrahim_and_the_Fire.mp3",
    duration: "8:45",
    featured: true,
  },
  {
    id: "prophet-yusuf",
    title: "Prophet Yusuf and His Brothers",
    description: "The story of Prophet Yusuf (Joseph) and his journey from slavery to kingship.",
    category: "Prophets",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Yusuf_and_His_Brothers.mp3",
    duration: "12:30",
    featured: true,
  },
  {
    id: "companions-cave",
    title: "The Companions of the Cave (Ashaab-ul-Kahf)",
    description: "The story of the young men who sought refuge in a cave and slept for 309 years.",
    category: "Quran Stories",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/People_of_the_Cave.mp3",
    duration: "10:15",
  },
  {
    id: "prophet-musa",
    title: "Prophet Musa and Pharaoh",
    description: "The story of Prophet Musa (Moses) and his confrontation with the tyrannical Pharaoh.",
    category: "Prophets",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Musa_and_Pharaoh.mp3",
    duration: "15:20",
    featured: true,
  },
  {
    id: "prophet-nuh",
    title: "Prophet Nuh and the Flood",
    description: "The story of Prophet Nuh (Noah) and the great flood that was sent by Allah.",
    category: "Prophets",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Nuh_and_the_Flood.mp3",
    duration: "9:10",
  },
  {
    id: "prophet-sulaiman",
    title: "Prophet Sulaiman and the Queen of Sheba",
    description: "The story of Prophet Sulaiman (Solomon) and his encounter with the Queen of Sheba.",
    category: "Prophets",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Sulaiman_and_Sheba.mp3",
    duration: "11:45",
  },
  {
    id: "dhul-qarnayn",
    title: "Dhul-Qarnayn and the Wall",
    description: "The story of Dhul-Qarnayn, the righteous king who built a wall to protect people from Gog and Magog.",
    category: "Quran Stories",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/Dhul_Qarnayn.mp3",
    duration: "7:50",
  },
  {
    id: "people-of-elephant",
    title: "The People of the Elephant",
    description: "The story of Abraha and his army who came to destroy the Kaaba but were defeated by Allah.",
    category: "Quran Stories",
    thumbnail: "/placeholder.svg?height=300&width=300",
    audioUrl: "https://media.blubrry.com/dreamreel/content.blubrry.com/dreamreel/People_of_Elephant.mp3",
    duration: "6:25",
  },
]

// Categories for filtering
const categories = ["All", "Prophets", "Quran Stories", "Companions", "Islamic History"]

export default function StoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const { setAudioUrl, setTitle, isPlaying, togglePlayPause } = useAudio()

  // Filter stories based on active category
  const filteredStories =
    activeCategory === "All" ? islamicStories : islamicStories.filter((story) => story.category === activeCategory)

  // Featured stories
  const featuredStories = islamicStories.filter((story) => story.featured)

  const playStory = (story: Story) => {
    setAudioUrl(story.audioUrl)
    setTitle(story.title)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container py-8 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">Islamic Stories</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Listen to inspiring stories from Islamic history and the Holy Quran
            </p>
          </div>

          {/* Featured Stories Section */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={story.thumbnail || "/placeholder.svg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <Button
                      className="absolute right-3 bottom-3 bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                      onClick={() => playStory(story)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Listen
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {story.duration}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {story.category}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* All Stories Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Browse All Stories</h2>

            {/* Category Tabs */}
            <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
              <TabsList className="w-full sm:w-auto flex flex-wrap justify-start">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Story List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStories.map((story) => (
                <Card key={story.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground mb-2">{story.category}</p>
                    <p className="text-sm line-clamp-3">{story.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs flex items-center text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {story.duration}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => playStory(story)} className="gap-1">
                        <Play className="h-3 w-3" />
                        Listen
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Educational Section */}
          <section className="mt-10 bg-muted/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Why Islamic Stories Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Moral Lessons</h3>
                <p className="text-sm text-muted-foreground">
                  Islamic stories provide timeless moral lessons that are applicable to our daily lives.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Historical Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about significant historical events mentioned in the Quran and Islamic tradition.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                  <Play className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">Engaging Format</h3>
                <p className="text-sm text-muted-foreground">
                  Audio stories make learning enjoyable and accessible for all ages and learning styles.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}
