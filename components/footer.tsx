import Link from "next/link"
import { Mountain } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">The Holy Quran</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Providing access to the Holy Quran with translations, recitations, and educational resources.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Read</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/read" className="text-muted-foreground transition-colors hover:text-foreground">
                  All Surahs
                </Link>
              </li>
              <li>
                <Link href="/read/1" className="text-muted-foreground transition-colors hover:text-foreground">
                  Al-Fatihah
                </Link>
              </li>
              <li>
                <Link href="/read/36" className="text-muted-foreground transition-colors hover:text-foreground">
                  Ya-Sin
                </Link>
              </li>
              <li>
                <Link href="/read/55" className="text-muted-foreground transition-colors hover:text-foreground">
                  Ar-Rahman
                </Link>
              </li>
              <li>
                <Link href="/read/67" className="text-muted-foreground transition-colors hover:text-foreground">
                  Al-Mulk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Listen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listen" className="text-muted-foreground transition-colors hover:text-foreground">
                  All Reciters
                </Link>
              </li>
              <li>
                <Link
                  href="/listen?reciter=mishary"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mishary Rashid Alafasy
                </Link>
              </li>
              <li>
                <Link
                  href="/listen?reciter=abdul-basit"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Abdul Basit Abdul Samad
                </Link>
              </li>
              <li>
                <Link
                  href="/listen?reciter=al-sudais"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Abdul Rahman Al-Sudais
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="text-muted-foreground transition-colors hover:text-foreground">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-muted-foreground transition-colors hover:text-foreground">
                  Copyright
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} The Holy Quran. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/share/1AQo5CHwYF/?mibextid=wwXIfr" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="https://x.com/ashikr142?s=11" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link href="https://www.instagram.com/mohamed_ashik_rahman_?igsh=MTN3eHNsNjl5MHVqeQ%3D%3D&utm_source=qr" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="https://youtube.com/@islamandinnovations?si=CKt6nmKUuz9Otpsc" className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="sr-only">YouTube</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </Link>
              <Link
  href="https://www.linkedin.com/in/mohamed-asik-rahman-ameerdeen-2661b01b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" // replace with your LinkedIn URL
  className="text-muted-foreground transition-colors hover:text-foreground"
>
  <span className="sr-only">LinkedIn</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
</Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
