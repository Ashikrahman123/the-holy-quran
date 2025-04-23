"use client"

export interface Bookmark {
  id: string
  verseKey: string
  chapterName: string
  verseText: string
  translation: string
  timestamp: number
}

const BOOKMARKS_KEY = "quran_bookmarks"

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return []

  const bookmarksJson = localStorage.getItem(BOOKMARKS_KEY)
  if (!bookmarksJson) return []

  try {
    return JSON.parse(bookmarksJson)
  } catch (error) {
    console.error("Error parsing bookmarks:", error)
    return []
  }
}

export function addBookmark(bookmark: Omit<Bookmark, "id" | "timestamp">): Bookmark {
  const bookmarks = getBookmarks()

  // Check if already bookmarked
  const exists = bookmarks.some((b) => b.verseKey === bookmark.verseKey)
  if (exists) {
    throw new Error("Verse already bookmarked")
  }

  const newBookmark: Bookmark = {
    ...bookmark,
    id: generateId(),
    timestamp: Date.now(),
  }

  const updatedBookmarks = [...bookmarks, newBookmark]
  saveBookmarks(updatedBookmarks)

  return newBookmark
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks()
  const updatedBookmarks = bookmarks.filter((b) => b.id !== id)
  saveBookmarks(updatedBookmarks)
}

export function isBookmarked(verseKey: string): boolean {
  const bookmarks = getBookmarks()
  return bookmarks.some((b) => b.verseKey === verseKey)
}

function saveBookmarks(bookmarks: Bookmark[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
