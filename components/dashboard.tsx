"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserMemories } from "@/components/user-memories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, BookmarkIcon, Clock, Heart } from "lucide-react"
import Link from "next/link"

export function Dashboard() {
  const { user, isLoading } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Welcome Section */}
        <Card className="border-emerald-100 overflow-hidden">
          <div className="md:flex">
            <div className="p-6 md:flex-1">
              <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                {user ? `Welcome, ${user.name || "Believer"}` : "Welcome to The Holy Quran Website"}
              </h1>
              <p className="text-gray-600 mb-6">
                {user
                  ? "Continue your spiritual journey with personalized content"
                  : "Begin your spiritual journey with the Holy Quran"}
              </p>

              {!user && !isLoading && (
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-emerald-200">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-emerald-50 p-6 md:w-1/3 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <p className="text-emerald-800 font-medium">Explore the Holy Quran</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="recent" className="data-[state=active]:bg-emerald-50">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Activity
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-emerald-50">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="data-[state=active]:bg-emerald-50">
                  <BookmarkIcon className="h-4 w-4 mr-2" />
                  Bookmarks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Continue Reading</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-3">
                        <div className="p-3 border rounded bg-slate-50">
                          <p className="font-medium">Surah Al-Fatiha</p>
                          <p className="text-sm text-gray-600">Last read 2 hours ago</p>
                          <Button className="mt-2 bg-emerald-600 hover:bg-emerald-700" asChild>
                            <Link href="/read/1">Continue Reading</Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-3">Sign in to track your reading progress</p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                          <Link href="/read">Start Reading</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Your Favorite Surahs</CardTitle>
                    <CardDescription>Quickly access your favorite chapters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-3">
                        <div className="p-3 border rounded bg-slate-50">
                          <p className="font-medium">No favorites yet</p>
                          <p className="text-sm text-gray-600">Add surahs to your favorites while reading</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-3">Sign in to save your favorite surahs</p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Your Bookmarks</CardTitle>
                    <CardDescription>Verses you've bookmarked for later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <div className="space-y-3">
                        <div className="p-3 border rounded bg-slate-50">
                          <p className="font-medium">No bookmarks yet</p>
                          <p className="text-sm text-gray-600">Bookmark verses while reading</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-3">Sign in to save bookmarks</p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - User Memories */}
          <div className="md:col-span-1">
            <UserMemories />
          </div>
        </div>
      </div>
    </div>
  )
}
