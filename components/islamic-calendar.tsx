"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface HijriDate {
  day: number
  month: number
  monthName: string
  year: number
  format: string
}

export function IslamicCalendar() {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<string[]>([])

  useEffect(() => {
    const fetchHijriDate = async () => {
      setIsLoading(true)

      try {
        // Get current date in format DD-MM-YYYY
        const today = new Date()
        const day = String(today.getDate()).padStart(2, "0")
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const year = today.getFullYear()
        const formattedDate = `${day}-${month}-${year}`

        // Try to fetch from API with specific date
        const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-cache",
        })

        if (response.ok) {
          const data = await response.json()

          if (data.code === 200 && data.data && data.data.hijri) {
            const hijri = data.data.hijri

            setHijriDate({
              day: Number.parseInt(hijri.day),
              month: Number.parseInt(hijri.month.number),
              monthName: hijri.month.en,
              year: Number.parseInt(hijri.year),
              format: hijri.date,
            })

            // Set upcoming events based on month
            setUpcomingEventsForMonth(Number.parseInt(hijri.month.number))

            // Cache the result in localStorage to reduce API calls
            localStorage.setItem(
              "hijriDate",
              JSON.stringify({
                date: hijri.date,
                day: Number.parseInt(hijri.day),
                month: Number.parseInt(hijri.month.number),
                monthName: hijri.month.en,
                year: Number.parseInt(hijri.year),
                timestamp: Date.now(),
              }),
            )
          } else {
            throw new Error("Invalid API response")
          }
        } else {
          throw new Error(`API error: ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching Hijri date:", error)

        // Try to use cached data first
        const cachedData = localStorage.getItem("hijriDate")
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData)
            // Use cached data if it's less than 24 hours old
            if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
              setHijriDate({
                day: parsed.day,
                month: parsed.month,
                monthName: parsed.monthName,
                year: parsed.year,
                format: parsed.date,
              })
              setUpcomingEventsForMonth(parsed.month)
              setIsLoading(false)
              return
            }
          } catch (e) {
            console.error("Error parsing cached Hijri date:", e)
          }
        }

        // Fallback: Calculate approximate Hijri date
        const today = new Date()

        // More accurate approximation
        // Hijri calendar is roughly 354 days per year (vs 365 for Gregorian)
        // This means Hijri years are about 3% shorter
        const gregorianYear = today.getFullYear()
        const gregorianDayOfYear = Math.floor((today - new Date(gregorianYear, 0, 0)) / (1000 * 60 * 60 * 24))

        // Approximate conversion
        // Starting from known point: Jan 1, 2023 was roughly 4 Jumada al-Akhirah 1444
        const knownGregorianDate = new Date(2023, 0, 1)
        const knownHijriYear = 1444
        const knownHijriMonth = 6 // Jumada al-Akhirah
        const knownHijriDay = 4

        // Calculate days between known date and today
        const daysDiff = Math.floor((today - knownGregorianDate) / (1000 * 60 * 60 * 24))

        // Convert to Hijri days (accounting for shorter year)
        const hijriDaysDiff = Math.floor(daysDiff * 1.03)

        // Calculate new Hijri date
        let hijriYear = knownHijriYear
        let hijriMonth = knownHijriMonth
        let hijriDay = knownHijriDay + hijriDaysDiff

        // Adjust for month lengths (approximating 30 days per month)
        while (hijriDay > 30) {
          hijriDay -= 30
          hijriMonth++

          if (hijriMonth > 12) {
            hijriMonth = 1
            hijriYear++
          }
        }

        const monthNames = [
          "Muharram",
          "Safar",
          "Rabi al-Awwal",
          "Rabi al-Thani",
          "Jumada al-Awwal",
          "Jumada al-Thani",
          "Rajab",
          "Sha'ban",
          "Ramadan",
          "Shawwal",
          "Dhu al-Qadah",
          "Dhu al-Hijjah",
        ]

        setHijriDate({
          day: hijriDay,
          month: hijriMonth,
          monthName: monthNames[hijriMonth - 1],
          year: hijriYear,
          format: `${hijriDay} ${monthNames[hijriMonth - 1]} ${hijriYear}`,
        })

        // Set upcoming events based on calculated month
        setUpcomingEventsForMonth(hijriMonth)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHijriDate()
  }, [])

  const setUpcomingEventsForMonth = (month: number) => {
    const events: string[] = []

    switch (month) {
      case 1: // Muharram
        events.push("Islamic New Year (1 Muharram)")
        events.push("Day of Ashura (10 Muharram)")
        break
      case 3: // Rabi al-Awwal
        events.push("Mawlid al-Nabi - Prophet's Birthday (12 Rabi al-Awwal)")
        break
      case 7: // Rajab
        events.push("Laylat al-Miraj - Night Journey (27 Rajab)")
        break
      case 8: // Sha'ban
        events.push("Laylat al-Bara'at - Night of Forgiveness (15 Sha'ban)")
        break
      case 9: // Ramadan
        events.push("Beginning of Ramadan (1 Ramadan)")
        events.push("Laylat al-Qadr - Night of Power (27 Ramadan)")
        break
      case 10: // Shawwal
        events.push("Eid al-Fitr (1 Shawwal)")
        break
      case 12: // Dhu al-Hijjah
        events.push("Day of Arafah (9 Dhu al-Hijjah)")
        events.push("Eid al-Adha (10 Dhu al-Hijjah)")
        break
      default:
        events.push("No major Islamic events this month")
    }

    setUpcomingEvents(events)
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : hijriDate ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100 rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold">
                {hijriDate.day}
              </div>
              <div>
                <p className="font-medium">{hijriDate.monthName}</p>
                <p className="text-xs text-muted-foreground">{hijriDate.year} AH</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline">
                {new Date().toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>

          <div className="pt-2 border-t">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Upcoming Events</h4>
            <ul className="space-y-1">
              {upcomingEvents.map((event, index) => (
                <li key={index} className="text-xs flex items-start">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Unable to load Islamic calendar data.</p>
      )}
    </div>
  )
}
