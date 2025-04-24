"use client"

import { useState, useEffect } from "react"
import { Home, BookOpen, Headphones, Search, Bookmark } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine active link
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-5">
        <Link href="/" className="flex flex-col items-center justify-center">
          <Home
            className={`h-5 w-5 ${isActive("/") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          />
          <span
            className={`mt-1 text-[10px] ${isActive("/") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            Home
          </span>
        </Link>
        <Link href="/read" className="flex flex-col items-center justify-center">
          <BookOpen
            className={`h-5 w-5 ${isActive("/read") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          />
          <span
            className={`mt-1 text-[10px] ${isActive("/read") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            Read
          </span>
        </Link>
        <Link href="/listen" className="flex flex-col items-center justify-center">
          <Headphones
            className={`h-5 w-5 ${isActive("/listen") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          />
          <span
            className={`mt-1 text-[10px] ${isActive("/listen") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            Listen
          </span>
        </Link>
        <Link href="/search" className="flex flex-col items-center justify-center">
          <Search
            className={`h-5 w-5 ${isActive("/search") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          />
          <span
            className={`mt-1 text-[10px] ${isActive("/search") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            Search
          </span>
        </Link>
        <Link href="/bookmarks" className="flex flex-col items-center justify-center">
          <Bookmark
            className={`h-5 w-5 ${isActive("/bookmarks") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          />
          <span
            className={`mt-1 text-[10px] ${isActive("/bookmarks") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            Bookmarks
          </span>
        </Link>
      </div>
    </div>
  )
}
