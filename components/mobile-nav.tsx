"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Headphones, Search, BookMarked } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center ${
            isActive("/") ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <Home className="mb-1 h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/read"
          className={`flex flex-col items-center justify-center ${
            isActive("/read") ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <BookOpen className="mb-1 h-5 w-5" />
          <span className="text-xs">Read</span>
        </Link>
        <Link
          href="/listen"
          className={`flex flex-col items-center justify-center ${
            isActive("/listen") ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <Headphones className="mb-1 h-5 w-5" />
          <span className="text-xs">Listen</span>
        </Link>
        <Link
          href="/search"
          className={`flex flex-col items-center justify-center ${
            isActive("/search") ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <Search className="mb-1 h-5 w-5" />
          <span className="text-xs">Search</span>
        </Link>
        <Link
          href="/resources"
          className={`flex flex-col items-center justify-center ${
            isActive("/resources") ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          <BookMarked className="mb-1 h-5 w-5" />
          <span className="text-xs">Resources</span>
        </Link>
      </div>
    </div>
  )
}
