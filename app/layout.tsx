import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { UserPreferencesProvider } from "@/contexts/user-preferences-context"
import { AudioProvider } from "@/contexts/audio-context"
import { FloatingAudioPlayer } from "@/components/floating-audio-player"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "The Holy Quran - Read, Listen, and Learn",
  description: "Access the Holy Quran with translations, beautiful recitations, and educational resources.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <UserPreferencesProvider>
          <AudioProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <FloatingAudioPlayer />
            </ThemeProvider>
          </AudioProvider>
        </UserPreferencesProvider>
      </body>
    </html>
  )
}
