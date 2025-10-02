"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface IslamicDate {
  day: number
  month: string
  year: number
  gregorianDate: string
}

interface IslamicEvent {
  date: string
  name: string
  type: "religious" | "historical" | "special"
  description?: string
}

const islamicMonths = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhul-Qi'dah",
  "Dhul-Hijjah",
]

const islamicEvents: IslamicEvent[] = [
  {
    date: "1-1",
    name: "Islamic New Year",
    type: "religious",
    description: "Beginning of the Islamic calendar year",
  },
  {
    date: "10-1",
    name: "Day of Ashura",
    type: "religious",
    description: "Day of fasting and remembrance",
  },
  {
    date: "12-3",
    name: "Mawlid an-Nabi",
    type: "religious",
    description: "Birth of Prophet Muhammad (PBUH)",
  },
  {
    date: "27-7",
    name: "Isra and Mi'raj",
    type: "religious",
    description: "Night Journey of Prophet Muhammad (PBUH)",
  },
  {
    date: "15-8",
    name: "Laylat al-Bara'at",
    type: "religious",
    description: "Night of Forgiveness",
  },
  {
    date: "1-9",
    name: "Beginning of Ramadan",
    type: "religious",
    description: "Start of the holy month of fasting",
  },
  {
    date: "21-9",
    name: "Laylat al-Qadr (estimated)",
    type: "religious",
    description: "Night of Decree",
  },
  {
    date: "1-10",
    name: "Eid al-Fitr",
    type: "religious",
    description: "Festival of Breaking the Fast",
  },
  {
    date: "9-12",
    name: "Day of Arafah",
    type: "religious",
    description: "Day of Hajj pilgrimage",
  },
  {
    date: "10-12",
    name: "Eid al-Adha",
    type: "religious",
    description: "Festival of Sacrifice",
  },
]

export function IslamicCalendar() {
  const [currentDate, setCurrentDate] = useState<IslamicDate | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [todayEvents, setTodayEvents] = useState<IslamicEvent[]>([])

  // Simplified Hijri date conversion (in a real app, use a proper library)
  const convertToHijri = (gregorianDate: Date): IslamicDate => {
    // This is a simplified conversion - in production, use a proper Hijri calendar library
    const hijriEpoch = new Date("622-07-16") // Approximate start of Hijri calendar
    const daysDiff = Math.floor((gregorianDate.getTime() - hijriEpoch.getTime()) / (1000 * 60 * 60 * 24))

    // Simplified calculation (not astronomically accurate)
    const hijriYear = Math.floor(daysDiff / 354) + 1
    const dayOfYear = daysDiff % 354
    const hijriMonth = Math.floor(dayOfYear / 29.5)
    const hijriDay = Math.floor(dayOfYear % 29.5) + 1

    return {
      day: hijriDay,
      month: islamicMonths[hijriMonth] || islamicMonths[0],
      year: hijriYear,
      gregorianDate: gregorianDate.toLocaleDateString(),
    }
  }

  const getEventsForDate = (day: number, month: number): IslamicEvent[] => {
    const dateKey = `${day}-${month + 1}`
    return islamicEvents.filter((event) => event.date === dateKey)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "religious":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      case "historical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "special":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedMonth((prev) => {
      if (direction === "next") {
        return (prev + 1) % 12
      } else {
        return prev === 0 ? 11 : prev - 1
      }
    })
  }

  useEffect(() => {
    const today = new Date()
    const hijriDate = convertToHijri(today)
    setCurrentDate(hijriDate)

    // Set current month
    const currentMonthIndex = islamicMonths.indexOf(hijriDate.month)
    setSelectedMonth(currentMonthIndex >= 0 ? currentMonthIndex : 0)

    // Get today's events
    const events = getEventsForDate(hijriDate.day, currentMonthIndex)
    setTodayEvents(events)
  }, [])

  if (!currentDate) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
    )
  }

  const currentMonthEvents = islamicEvents.filter((event) => {
    const [, month] = event.date.split("-")
    return Number.parseInt(month) === selectedMonth + 1
  })

  return (
    <div className="space-y-4">
      {/* Current Date */}
      <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
        <div className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
          {currentDate.day} {currentDate.month} {currentDate.year} AH
        </div>
        <div className="text-sm text-emerald-600 dark:text-emerald-400">{currentDate.gregorianDate}</div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">{islamicMonths[selectedMonth]}</h3>
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Today's Events
          </h4>
          {todayEvents.map((event, index) => (
            <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
              <div className="flex items-center gap-2">
                <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                <span className="text-sm font-medium">{event.name}</span>
              </div>
              {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Month Events */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {islamicMonths[selectedMonth]} Events
        </h4>
        {currentMonthEvents.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {currentMonthEvents.map((event, index) => {
              const [day] = event.date.split("-")
              return (
                <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">{day}</span>
                    <Badge className={getEventTypeColor(event.type)} variant="outline">
                      {event.type}
                    </Badge>
                    <span className="font-medium">{event.name}</span>
                  </div>
                  {event.description && <p className="text-xs text-muted-foreground mt-1 ml-8">{event.description}</p>}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No special events this month</p>
        )}
      </div>
    </div>
  )
}
