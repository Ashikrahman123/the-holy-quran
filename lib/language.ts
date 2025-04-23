"use client"

export type Language = "en" | "ar" | "ur" | "fr" | "id" | "tr" | "es" | "ta"

export interface LanguageOption {
  code: Language
  name: string
  nativeName: string
  direction: "ltr" | "rtl"
  fontFamily?: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", fontFamily: "Amiri, serif" },
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", direction: "ltr", fontFamily: "'Noto Sans Tamil', sans-serif" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
]

export function getLanguageDetails(code: Language): LanguageOption {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0]
}

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"

  try {
    const storedPreferences = localStorage.getItem("quran_app_user_preferences")
    if (!storedPreferences) return "en"

    const preferences = JSON.parse(storedPreferences)
    return preferences.language || "en"
  } catch (error) {
    console.error("Error getting language from localStorage:", error)
    return "en"
  }
}
