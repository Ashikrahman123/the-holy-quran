"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="hidden md:flex md:gap-6 lg:gap-8">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Home
      </Link>
      <Link
        href="/read"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/read") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Read Quran
      </Link>
      <Link
        href="/listen"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/listen") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Listen
      </Link>
      <Link
        href="/search"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/search") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Search
      </Link>
      <Link
        href="/bookmarks"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/bookmarks") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Bookmarks
      </Link>
      <Link
        href="/resources"
        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
          isActive("/resources") ? "text-emerald-600" : "text-foreground"
        }`}
      >
        Resources
      </Link>
    </nav>
  )
}
