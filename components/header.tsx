"use client"

import Link from "next/link"
import { Mountain, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden font-bold sm:inline-block">The Holy Quran</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {[
              {
                href: "/read",
                label: "Read",
                dropdown: [
                  { href: "/read", label: "All Surahs" },
                  { href: "/read/1", label: "Al-Fatihah" },
                  { href: "/read/36", label: "Ya-Sin" },
                  { href: "/read/55", label: "Ar-Rahman" },
                  { href: "/read/67", label: "Al-Mulk" },
                ],
              },
              {
                href: "/listen",
                label: "Listen",
                dropdown: [
                  { href: "/listen", label: "All Reciters" },
                  { href: "/listen?reciter=7", label: "Mishary Rashid Alafasy" },
                  { href: "/listen?reciter=1", label: "Abdul Basit Abdul Samad" },
                  { href: "/listen?reciter=3", label: "Abdul Rahman Al-Sudais" },
                ],
              },
              { href: "/search", label: "Search" },
              { href: "/bookmarks", label: "Bookmarks" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((item) => {
              if (item.dropdown) {
                return (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        className={cn(
                          "text-foreground px-0 h-9 text-base font-normal",
                          pathname.startsWith(item.href) && "text-emerald-600 dark:text-emerald-400 font-medium",
                        )}
                      >
                        {item.label}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.href} asChild>
                          <Link href={dropdownItem.href}>{dropdownItem.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center h-9 text-base font-normal text-foreground transition-colors hover:text-foreground/80",
                    pathname === item.href && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <Link href="/search" className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mb-8 flex items-center space-x-2">
                <Mountain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold">The Holy Quran</span>
              </Link>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/read"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname.startsWith("/read") && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  Read Quran
                </Link>
                <Link
                  href="/listen"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname.startsWith("/listen") && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  Listen
                </Link>
                <Link
                  href="/search"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname === "/search" && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  Search
                </Link>
                <Link
                  href="/bookmarks"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname === "/bookmarks" && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  Bookmarks
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname === "/about" && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "text-foreground transition-colors hover:text-foreground/80",
                    pathname === "/contact" && "text-emerald-600 dark:text-emerald-400 font-medium",
                  )}
                >
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
