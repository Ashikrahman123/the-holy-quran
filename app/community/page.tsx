"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Filter } from "lucide-react"
import { CommunityPost } from "@/components/community-post"
import { CreatePostForm } from "@/components/create-post-form"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")
  const { toast } = useToast()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
          <div className="container relative py-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Islamic Community
                <span className="block text-emerald-600 dark:text-emerald-400">Share Knowledge & Inspiration</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                Connect with fellow Muslims, share Islamic teachings, and find inspiration in our community space.
              </p>
            </div>
          </div>
        </section>

        {/* Community Content */}
        <section className="container py-8">
          <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="grid grid-cols-3 w-[400px]">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="teachings">Teachings</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Create Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreatePostForm />
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>Be respectful and kind to others</li>
                      <li>Share authentic Islamic knowledge</li>
                      <li>Cite sources when sharing information</li>
                      <li>Avoid controversial topics</li>
                      <li>No self-promotion or spam</li>
                      <li>Respect different scholarly opinions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="md:col-span-6">
                <TabsContent value="feed" className="mt-0">
                  <div className="space-y-6">
                    <CommunityPost
                      id="1"
                      author={{
                        name: "Abdullah Ahmad",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "abdullah_ahmad",
                      }}
                      content="The Prophet Muhammad (peace be upon him) said: 'The best of you are those who are best to their families, and I am the best of you to my family.' (Tirmidhi)"
                      timestamp="2 hours ago"
                      likes={24}
                      comments={5}
                      type="quote"
                    />

                    <CommunityPost
                      id="2"
                      author={{
                        name: "Aisha Rahman",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "aisha_r",
                      }}
                      content="Just finished reading Surah Al-Kahf as part of my Friday routine. The story of the people of the cave always reminds me of the importance of faith in difficult times. What's your favorite part of this beautiful surah?"
                      timestamp="5 hours ago"
                      likes={18}
                      comments={12}
                      type="discussion"
                    />

                    <CommunityPost
                      id="3"
                      author={{
                        name: "Imam Yusuf",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "imam_yusuf",
                      }}
                      content="Today's reminder: The five daily prayers are a pillar of Islam and a means of purification. The Prophet (PBUH) said: 'If there was a river at the door of anyone of you and he took a bath in it five times a day, would you notice any dirt on him?' They said, 'Not a trace of dirt would be left.' The Prophet added, 'That is the example of the five prayers with which Allah blots out evil deeds.'"
                      timestamp="1 day ago"
                      likes={56}
                      comments={8}
                      type="teaching"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="teachings" className="mt-0">
                  <div className="space-y-6">
                    <CommunityPost
                      id="4"
                      author={{
                        name: "Imam Yusuf",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "imam_yusuf",
                      }}
                      content="Today's reminder: The five daily prayers are a pillar of Islam and a means of purification. The Prophet (PBUH) said: 'If there was a river at the door of anyone of you and he took a bath in it five times a day, would you notice any dirt on him?' They said, 'Not a trace of dirt would be left.' The Prophet added, 'That is the example of the five prayers with which Allah blots out evil deeds.'"
                      timestamp="1 day ago"
                      likes={56}
                      comments={8}
                      type="teaching"
                    />

                    <CommunityPost
                      id="5"
                      author={{
                        name: "Dr. Fatima Ali",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "dr_fatima",
                      }}
                      content="Understanding Zakat: Zakat is not just a pillar of Islam but a means of purifying wealth and helping those in need. The Quran mentions: 'Take from their wealth a charity by which you purify and sanctify them' (9:103). Zakat is due on wealth that reaches the nisab (minimum amount) and has been held for one lunar year. The standard rate is 2.5% of qualifying wealth."
                      timestamp="3 days ago"
                      likes={42}
                      comments={15}
                      type="teaching"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-0">
                  <div className="space-y-6">
                    <CommunityPost
                      id="6"
                      author={{
                        name: "Zaynab Khan",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "zaynab_k",
                      }}
                      content="I'm trying to improve my tajweed when reciting Quran. Does anyone have recommendations for good online resources or teachers who can help with proper pronunciation?"
                      timestamp="12 hours ago"
                      likes={8}
                      comments={14}
                      type="question"
                    />

                    <CommunityPost
                      id="7"
                      author={{
                        name: "Omar Farooq",
                        image: "/placeholder.svg?height=40&width=40",
                        username: "omar_f",
                      }}
                      content="What is the proper way to make up missed prayers? I've been very busy with work lately and have missed some prayers. I want to make them up correctly."
                      timestamp="2 days ago"
                      likes={12}
                      comments={20}
                      type="question"
                    />
                  </div>
                </TabsContent>
              </div>

              {/* Right Sidebar */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <p className="font-medium">#RamadanPreparation</p>
                        <p className="text-sm text-muted-foreground">125 posts</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="font-medium">#FridayReminder</p>
                        <p className="text-sm text-muted-foreground">98 posts</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="font-medium">#QuranReflection</p>
                        <p className="text-sm text-muted-foreground">87 posts</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="font-medium">#IslamicParenting</p>
                        <p className="text-sm text-muted-foreground">64 posts</p>
                      </div>
                      <div>
                        <p className="font-medium">#DailyDua</p>
                        <p className="text-sm text-muted-foreground">52 posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Active Scholars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>IY</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Imam Yusuf</p>
                          <p className="text-sm text-muted-foreground">Islamic Studies Teacher</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>FA</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Dr. Fatima Ali</p>
                          <p className="text-sm text-muted-foreground">Islamic Jurisprudence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>MH</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Mufti Hassan</p>
                          <p className="text-sm text-muted-foreground">Hadith Scholar</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Tabs>
        </section>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
