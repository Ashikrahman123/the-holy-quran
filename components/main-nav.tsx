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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-foreground px-0 h-auto font-normal">
              Read
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/read">All Surahs</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/read/1">Al-Fatihah</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/read/36">Ya-Sin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/read/55">Ar-Rahman</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/read/67">Al-Mulk</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="text-foreground px-0 h-auto font-normal">
              Listen
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/listen">All Reciters</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/listen?reciter=7">Mishary Rashid Alafasy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/listen?reciter=1">Abdul Basit Abdul Samad</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/listen?reciter=3">Abdul Rahman Al-Sudais</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="link" className="text-foreground px-0 h-auto font-normal" asChild>
          <Link href="/search">Search</Link>
        </Button>
        <Button variant="link" className="text-foreground px-0 h-auto font-normal" asChild>
          <Link href="/bookmarks">Bookmarks</Link>
        </Button>
        <Button variant="link" className="text-foreground px-0 h-auto font-normal" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button variant="link" className="text-foreground px-0 h-auto font-normal" asChild>
          <Link href="/contact">Contact</Link>
        </Button>
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
