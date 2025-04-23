"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrayerTimes, type PrayerTimes } from "@/lib/api"
import { Clock, MapPin } from "lucide-react"

interface PrayerTimesWidgetProps {
  city?: string
  country?: string
}

export function PrayerTimesWidget({ city = "Tiruchirappalli", country = "India" }: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true)
      try {
        const times = await getPrayerTimes(city, country)
        setPrayerTimes(times)
      } catch (error) {
        console.error("Error fetching prayer times:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrayerTimes()

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [city, country])

  const formatTime = (timeStr: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeStr.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getNextPrayer = () => {
    if (!prayerTimes) return null

    const prayers = [
      { name: "Fajr", time: prayerTimes.timings.Fajr },
      { name: "Sunrise", time: prayerTimes.timings.Sunrise },
      { name: "Dhuhr", time: prayerTimes.timings.Dhuhr },
      { name: "Asr", time: prayerTimes.timings.Asr },
      { name: "Maghrib", time: prayerTimes.timings.Maghrib },
      { name: "Isha", time: prayerTimes.timings.Isha },
    ]

    const now = currentTime
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeMinutes = currentHours * 60 + currentMinutes

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":")
      const prayerTimeMinutes = Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10)

      if (prayerTimeMinutes > currentTimeMinutes) {
        return prayer
      }
    }

    // If all prayers for today have passed, return Fajr for tomorrow
    return { name: "Fajr (Tomorrow)", time: prayerTimes.timings.Fajr }
  }

  const nextPrayer = getNextPrayer()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <div className="h-4 bg-muted rounded w-40 animate-pulse"></div>
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prayerTimes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prayer Times</CardTitle>
          <CardDescription>Could not load prayer times</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Prayer Times
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {city}, {country} • {prayerTimes.date.readable}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm font-medium">Next Prayer</div>
          <div className="mt-1 flex items-center justify-between rounded-md bg-emerald-50 p-2 dark:bg-emerald-900/30">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">{nextPrayer?.name}</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {nextPrayer ? formatTime(nextPrayer.time) : ""}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Fajr</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Fajr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Sunrise</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Sunrise)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Dhuhr</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Dhuhr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Asr</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Asr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Maghrib</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Maghrib)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Isha</span>
            <span className="text-sm font-medium">{formatTime(prayerTimes.timings.Isha)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
