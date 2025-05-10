import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserPreferencesProvider } from "@/contexts/user-preferences-context"
import { AudioProvider } from "@/contexts/audio-context"
import { FloatingAudioPlayer } from "@/components/floating-audio-player"
import { FloatingChatbot } from "@/components/floating-chatbot"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "The Holy Quran - Guidance for Humanity",
  description: "Explore the divine words of Allah through our modern, accessible platform.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <UserPreferencesProvider>
              <AudioProvider>
                {children}
                <FloatingAudioPlayer />
                <FloatingChatbot />
              </AudioProvider>
            </UserPreferencesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
