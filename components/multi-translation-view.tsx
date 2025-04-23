"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { LANGUAGES, type Language } from "@/lib/language"

interface Translation {
  language: Language
  text: string
}

interface MultiTranslationViewProps {
  verseKey: string
  arabicText: string
  translations: Translation[]
  onAddLanguage?: (language: Language) => void
  primaryLanguage: Language
}

export function MultiTranslationView({
  verseKey,
  arabicText,
  translations,
  onAddLanguage,
  primaryLanguage,
}: MultiTranslationViewProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")

  // Always show Arabic and primary language, then others when expanded
  const prioritizedTranslations = [
    // Arabic is always first if it exists in translations
    ...translations.filter((t) => t.language === "ar"),
    // Primary language is second if it's not Arabic
    ...translations.filter((t) => t.language === primaryLanguage && t.language !== "ar"),
    // Then English if it's not the primary language
    ...translations.filter((t) => t.language === "en" && t.language !== primaryLanguage && t.language !== "ar"),
    // Then Tamil if it's not the primary language
    ...translations.filter(
      (t) => t.language === "ta" && t.language !== primaryLanguage && t.language !== "ar" && t.language !== "en",
    ),
    // Then all others
    ...translations.filter(
      (t) => t.language !== "ar" && t.language !== primaryLanguage && t.language !== "en" && t.language !== "ta",
    ),
  ]

  // Show only 3 translations by default, show all when expanded
  const visibleTranslations = expanded ? prioritizedTranslations : prioritizedTranslations.slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Always show Arabic text at the top */}
      <div className="mb-4 text-right">
        <p
          className="font-arabic text-2xl leading-relaxed text-emerald-800 dark:text-emerald-200"
          dir="rtl"
          style={{ fontFamily: "Amiri, serif" }}
        >
          {arabicText}
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="mb-4 w-auto inline-flex">
            <TabsTrigger value="all">All Translations</TabsTrigger>
            {prioritizedTranslations.map((translation) => (
              <TabsTrigger key={translation.language} value={translation.language}>
                {LANGUAGES.find((lang) => lang.code === translation.language)?.name || translation.language}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-3">
          {visibleTranslations.map((translation) => {
            const langDetails = LANGUAGES.find((lang) => lang.code === translation.language)
            return (
              <Card key={translation.language}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-medium">{langDetails?.name || translation.language}</h4>
                    <span className="text-xs text-muted-foreground">{langDetails?.nativeName}</span>
                  </div>
                  <p
                    className="text-muted-foreground"
                    dir={langDetails?.direction || "ltr"}
                    style={{ fontFamily: langDetails?.fontFamily }}
                  >
                    {translation.text}
                  </p>
                </CardContent>
              </Card>
            )
          })}

          {prioritizedTranslations.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show {prioritizedTranslations.length - 3} More Translations
                </>
              )}
            </Button>
          )}

          {onAddLanguage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                // Find a language that's not already in the translations
                const availableLanguages = LANGUAGES.map((lang) => lang.code).filter(
                  (code) => !translations.some((t) => t.language === code),
                )
                if (availableLanguages.length > 0) {
                  onAddLanguage(availableLanguages[0])
                }
              }}
            >
              Add Another Translation
            </Button>
          )}
        </TabsContent>

        {prioritizedTranslations.map((translation) => {
          const langDetails = LANGUAGES.find((lang) => lang.code === translation.language)
          return (
            <TabsContent key={translation.language} value={translation.language}>
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-medium">{langDetails?.name || translation.language}</h4>
                    <span className="text-xs text-muted-foreground">{langDetails?.nativeName}</span>
                  </div>
                  <p
                    className="text-muted-foreground"
                    dir={langDetails?.direction || "ltr"}
                    style={{ fontFamily: langDetails?.fontFamily }}
                  >
                    {translation.text}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
