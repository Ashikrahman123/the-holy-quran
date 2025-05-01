import Link from "next/link"
import { Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MainNav() {
  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Mountain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden font-bold sm:inline-block">The Holy Quran</span>
      </Link>
      <nav className="hidden gap-6 md:flex items-center">
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
                  <Button variant="link" className="text-foreground px-0 h-9 text-base font-normal">
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
            <Button key={item.href} variant="link" className="text-foreground px-0 h-9 text-base font-normal" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          )
        })}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
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
            <Link href="/read" className="text-foreground transition-colors hover:text-foreground/80">
              Read Quran
            </Link>
            <Link href="/listen" className="text-foreground transition-colors hover:text-foreground/80">
              Listen
            </Link>
            <Link href="/search" className="text-foreground transition-colors hover:text-foreground/80">
              Search
            </Link>
            <Link href="/bookmarks" className="text-foreground transition-colors hover:text-foreground/80">
              Bookmarks
            </Link>
            <Link href="/about" className="text-foreground transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link href="/contact" className="text-foreground transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
