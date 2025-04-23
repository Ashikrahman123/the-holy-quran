"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUserPreferences, saveUserPreferences, type UserPreferences } from "@/lib/api-service"
import type { Language } from "@/lib/language"

interface UserPreferencesContextType {
  preferences: UserPreferences
  updateLanguage: (language: Language) => void
  updateFontSize: (fontSize: string) => void
  updateTheme: (theme: string) => void
  updateReciterId: (reciterId: number) => void
  isLoaded: boolean
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: "en",
    fontSize: "medium",
    theme: "system",
    reciterId: 1,
    lastRead: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const storedPreferences = getUserPreferences()
    setPreferences(storedPreferences)
    setIsLoaded(true)
  }, [])

  const updateLanguage = (language: Language) => {
    setPreferences((prev) => {
      const updated = { ...prev, language }
      saveUserPreferences(updated)
      return updated
    })
  }

  const updateFontSize = (fontSize: string) => {
    setPreferences((prev) => {
      const updated = { ...prev, fontSize }
      saveUserPreferences(updated)
      return updated
    })
  }

  const updateTheme = (theme: string) => {
    setPreferences((prev) => {
      const updated = { ...prev, theme }
      saveUserPreferences(updated)
      return updated
    })
  }

  const updateReciterId = (reciterId: number) => {
    setPreferences((prev) => {
      const updated = { ...prev, reciterId }
      saveUserPreferences(updated)
      return updated
    })
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateLanguage,
        updateFontSize,
        updateTheme,
        updateReciterId,
        isLoaded,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider")
  }
  return context
}
