"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { LanguageSelector } from "@/components/language-selector"
import { Search, Bookmark, Trash2, ExternalLink, Copy, Share2 } from "lucide-react"
import { getBookmarks, removeBookmark, type Bookmark as BookmarkType } from "@/lib/bookmarks"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      setLoading(true)
      try {
        const savedBookmarks = getBookmarks()
        setBookmarks(savedBookmarks)
      } catch (error) {
        console.error("Error loading bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookmarks()
  }, [])

  const handleRemoveBookmark = (id: string) => {
    try {
      removeBookmark(id)
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id))
      toast({
        title: "Bookmark removed",
        description: "The bookmark has been removed successfully.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error removing your bookmark.",
        duration: 3000,
      })
    }
  }

  const handleCopyVerse = (bookmark: BookmarkType) => {
    const textToCopy = `${bookmark.verseText}\n\n${bookmark.translation}\n\n(Quran ${bookmark.verseKey})`
    navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied to clipboard",
      description: `Verse ${bookmark.verseKey} has been copied to your clipboard.`,
      duration: 3000,
    })
  }

  const handleShare = (bookmark: BookmarkType) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Quran - ${bookmark.verseKey}`,
          text: `${bookmark.verseText}\n\n${bookmark.translation}\n\n(Quran ${bookmark.verseKey})`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      handleCopyVerse(bookmark)
      toast({
        title: "Share not supported",
        description: "Sharing is not supported in your browser. The verse has been copied to your clipboard instead.",
        duration: 3000,
      })
    }
  }

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
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold">My Bookmarks</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Access your saved verses from the Holy Quran</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="h-5 w-32 rounded bg-muted"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded bg-muted"></div>
                      <div className="h-8 w-8 rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="mb-3 h-16 w-full rounded bg-muted"></div>
                  <div className="h-12 w-full rounded bg-muted"></div>
                </div>
              ))}
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Link
                      href={`/read/${bookmark.verseKey.split(":")[0]}`}
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Surah {bookmark.chapterName} : Verse {bookmark.verseKey.split(":")[1]}
                    </Link>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyVerse(bookmark)}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(bookmark)}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/read/${bookmark.verseKey.split(":")[0]}`}>
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Go to Surah</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3 text-right">
                    <p className="font-arabic text-lg leading-relaxed text-emerald-800 dark:text-emerald-200" dir="rtl">
                      {bookmark.verseText}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-muted-foreground">{bookmark.translation}</p>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Bookmarked on {new Date(bookmark.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bookmark className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No Bookmarks Yet</h2>
              <p className="mb-4 text-muted-foreground">
                You haven't bookmarked any verses yet. Start reading the Quran and bookmark verses to access them here.
              </p>
              <Link href="/read">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Start Reading</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  )
}
