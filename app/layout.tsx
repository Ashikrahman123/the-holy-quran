import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserPreferencesProvider } from "@/contexts/user-preferences-context"
import { AudioProvider } from "@/contexts/audio-context"
import { FloatingAudioPlayer } from "@/components/floating-audio-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "The Holy Quran - Guidance for Humanity",
  description: "Explore the divine words of Allah through our modern, accessible platform.",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserPreferencesProvider>
            <AudioProvider>
              {children}
              <FloatingAudioPlayer />
            </AudioProvider>
          </UserPreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
