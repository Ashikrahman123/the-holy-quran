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
        {[
          { href: "/", label: "Home", icon: Home },
          { href: "/read", label: "Read", icon: BookOpen },
          { href: "/listen", label: "Listen", icon: Headphones },
          { href: "/search", label: "Search", icon: Search },
          { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
        ].map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center">
              <Icon
                className={`h-5 w-5 ${active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
              />
              <span
                className={`mt-1 text-[10px] ${active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
