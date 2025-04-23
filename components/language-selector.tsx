"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { type Language, LANGUAGES } from "@/lib/language"
import { useUserPreferences } from "@/contexts/user-preferences-context"

interface LanguageSelectorProps {
  onChange?: (language: Language) => void
}

export function LanguageSelector({ onChange }: LanguageSelectorProps) {
  const { preferences, updateLanguage, isLoaded } = useUserPreferences()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (lang: Language) => {
    updateLanguage(lang)
    if (onChange) {
      onChange(lang)
    }
  }

  if (!mounted || !isLoaded) return null

  const currentLanguage = LANGUAGES.find((l) => l.code === preferences.language) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={preferences.language === lang.code ? "bg-muted" : ""}
          >
            <span className="mr-2">{lang.nativeName}</span>
            <span className="text-muted-foreground">({lang.name})</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
