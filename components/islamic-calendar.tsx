"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Moon } from "lucide-react"
import { useUserPreferences } from "@/contexts/user-preferences-context"

interface HijriDate {
  day: string
  month: {
    number: number
    en: string
    ar: string
  }
  year: string
  designation: {
    abbreviated: string
    expanded: string
  }
  holidays: string[]
}

interface GregorianDate {
  day: string
  month: {
    number: number
    en: string
  }
  year: string
  designation: {
    abbreviated: string
    expanded: string
  }
}

interface IslamicDate {
  hijri: HijriDate
  gregorian: GregorianDate
}

export function IslamicCalendar() {
  const { preferences } = useUserPreferences()
  const [date, setDate] = useState<IslamicDate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importantDates, setImportantDates] = useState<{ date: string; event: string }[]>([])

  useEffect(() => {
    const fetchIslamicDate = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://api.aladhan.com/v1/gToH")
        if (!response.ok) {
          throw new Error(`Failed to fetch Islamic date: ${response.status}`)
        }

        const data = await response.json()
        if (data.code === 200 && data.data) {
          setDate({
            hijri: data.data.hijri,
            gregorian: data.data.gregorian,
          })

          // Get important Islamic dates for current Hijri year
          await fetchImportantDates(data.data.hijri.year)
        } else {
          throw new Error("Invalid data received from API")
        }
      } catch (error) {
        console.error("Error fetching Islamic date:", error)
        setError("Failed to load Islamic calendar. Please try again later.")

        // Set fallback date
        const now = new Date()
        setDate({
          hijri: {
            day: "1",
            month: {
              number: 1,
              en: "Muharram",
              ar: "محرم",
            },
            year: "1445",
            designation: {
              abbreviated: "AH",
              expanded: "Anno Hegirae",
            },
            holidays: [],
          },
          gregorian: {
            day: now.getDate().toString(),
            month: {
              number: now.getMonth() + 1,
              en: now.toLocaleString("default", { month: "long" }),
            },
            year: now.getFullYear().toString(),
            designation: {
              abbreviated: "CE",
              expanded: "Common Era",
            },
          },
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchImportantDates = async (hijriYear: string) => {
      try {
        // These are approximate dates that would need to be calculated properly
        // In a real implementation, you would fetch these from an API
        setImportantDates([
          { date: `1 Muharram ${hijriYear}`, event: "Islamic New Year" },
          { date: `10 Muharram ${hijriYear}`, event: "Day of Ashura" },
          { date: `12 Rabi al-Awwal ${hijriYear}`, event: "Mawlid al-Nabi (Prophet's Birthday)" },
          { date: `1 Ramadan ${hijriYear}`, event: "Beginning of Ramadan" },
          { date: `27 Ramadan ${hijriYear}`, event: "Laylat al-Qadr (Night of Power)" },
          { date: `1 Shawwal ${hijriYear}`, event: "Eid al-Fitr" },
          { date: `10 Dhu al-Hijjah ${hijriYear}`, event: "Eid al-Adha" },
        ])
      } catch (error) {
        console.error("Error setting important dates:", error)
      }
    }

    fetchIslamicDate()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-60" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !date) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Islamic Calendar</CardTitle>
          <CardDescription>Error loading calendar data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error || "Failed to load calendar data"}</p>
        </CardContent>
      </Card>
    )
  }

  const { hijri, gregorian } = date

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-emerald-600" />
          Islamic Calendar
        </CardTitle>
        <CardDescription>Current date in Hijri and Gregorian calendars</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2 rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Today's Date:</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-background p-3">
                <p className="text-sm text-muted-foreground">Hijri</p>
                <p className="text-lg font-semibold">
                  {hijri.day} {hijri.month.en} {hijri.year} {hijri.designation.abbreviated}
                </p>
                {preferences.language === "ar" && (
                  <p className="mt-1 font-arabic text-sm" dir="rtl">
                    {hijri.day} {hijri.month.ar} {hijri.year}
                  </p>
                )}
              </div>
              <div className="rounded-md bg-background p-3">
                <p className="text-sm text-muted-foreground">Gregorian</p>
                <p className="text-lg font-semibold">
                  {gregorian.day} {gregorian.month.en} {gregorian.year} {gregorian.designation.abbreviated}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Important Islamic Dates</h3>
            <div className="space-y-2">
              {importantDates.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span className="font-medium">{item.event}</span>
                  <span className="text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
