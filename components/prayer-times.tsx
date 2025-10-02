"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface PrayerTime {
  name: string
  time: string
  arabic: string
}

interface LocationData {
  city: string
  country: string
  latitude: number
  longitude: number
}

export function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextPrayer, setNextPrayer] = useState<string>("")
  const [timeToNext, setTimeToNext] = useState<string>("")
  const { toast } = useToast()

  const calculatePrayerTimes = (lat: number, lng: number, date: Date = new Date()) => {
    // Simplified prayer time calculation (in a real app, use a proper library like adhan)
    const times = [
      { name: "Fajr", time: "05:30", arabic: "الفجر" },
      { name: "Dhuhr", time: "12:15", arabic: "الظهر" },
      { name: "Asr", time: "15:45", arabic: "العصر" },
      { name: "Maghrib", time: "18:20", arabic: "المغرب" },
      { name: "Isha", time: "19:50", arabic: "العشاء" },
    ]

    // Adjust times based on location (simplified)
    const timeZoneOffset = Math.round(lng / 15)
    return times.map((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      const adjustedHours = (hours + timeZoneOffset + 24) % 24
      return {
        ...prayer,
        time: `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      }
    })
  }

  const getNextPrayer = (times: PrayerTime[]) => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    for (const prayer of times) {
      const [hours, minutes] = prayer.time.split(":").map(Number)
      const prayerTime = hours * 60 + minutes

      if (prayerTime > currentTime) {
        const diff = prayerTime - currentTime
        const hoursLeft = Math.floor(diff / 60)
        const minutesLeft = diff % 60
        return {
          name: prayer.name,
          timeLeft: `${hoursLeft}h ${minutesLeft}m`,
        }
      }
    }

    // If no prayer left today, next is Fajr tomorrow
    const fajrTime = times[0].time.split(":").map(Number)
    const fajrMinutes = fajrTime[0] * 60 + fajrTime[1]
    const minutesUntilMidnight = 24 * 60 - currentTime
    const totalMinutes = minutesUntilMidnight + fajrMinutes
    const hoursLeft = Math.floor(totalMinutes / 60)
    const minutesLeft = totalMinutes % 60

    return {
      name: "Fajr",
      timeLeft: `${hoursLeft}h ${minutesLeft}m`,
    }
  }

  const fetchLocation = async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords

            try {
              // Get location name from coordinates
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
              )
              const data = await response.json()

              const locationData: LocationData = {
                city: data.city || data.locality || "Unknown",
                country: data.countryName || "Unknown",
                latitude,
                longitude,
              }

              setLocation(locationData)

              // Calculate prayer times
              const times = calculatePrayerTimes(latitude, longitude)
              setPrayerTimes(times)

              // Get next prayer
              const next = getNextPrayer(times)
              setNextPrayer(next.name)
              setTimeToNext(next.timeLeft)

              // Cache the data
              localStorage.setItem(
                "prayerTimesData",
                JSON.stringify({
                  location: locationData,
                  times,
                  date: new Date().toDateString(),
                }),
              )
            } catch (error) {
              console.error("Error fetching location name:", error)
              // Use coordinates as fallback
              const locationData: LocationData = {
                city: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                country: "Coordinates",
                latitude,
                longitude,
              }
              setLocation(locationData)

              const times = calculatePrayerTimes(latitude, longitude)
              setPrayerTimes(times)

              const next = getNextPrayer(times)
              setNextPrayer(next.name)
              setTimeToNext(next.timeLeft)
            }
          },
          (error) => {
            console.error("Geolocation error:", error)
          },
        )
      } else {
        useFallbackLocation()
      }
    } catch (error) {
      console.error("Error getting location:", error)
    }
  }

  const useFallbackLocation = () => {
    const meccaLocation: LocationData = {
      city: "Mecca",
      country: "Saudi Arabia",
      latitude: 21.4225,
      longitude: 39.8262,
    }

    setLocation(meccaLocation)
    const times = calculatePrayerTimes(meccaLocation.latitude, meccaLocation.longitude)
    setPrayerTimes(times)

    const next = getNextPrayer(times)
    setNextPrayer(next.name)
    setTimeToNext(next.timeLeft)

    toast({
      title: "Location not available",
      description: "Showing prayer times for Mecca",
      duration: 3000,
    })
  }

  const refreshPrayerTimes = () => {
    setLoading(true)
    localStorage.removeItem("prayerTimesData")
    fetchLocation()
  }

  useEffect(() => {
    const loadPrayerTimes = async () => {
      setLoading(true)

      try {
        const cached = localStorage.getItem("prayerTimesData")
        const today = new Date().toDateString()

        if (cached) {
          const { location: cachedLocation, times, date } = JSON.parse(cached)
          if (date === today) {
            setLocation(cachedLocation)
            setPrayerTimes(times)

            const next = getNextPrayer(times)
            setNextPrayer(next.name)
            setTimeToNext(next.timeLeft)
            setLoading(false)
            return
          }
        }

        await fetchLocation()
      } catch (error) {
        console.error("Error loading prayer times:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPrayerTimes()

    // Update countdown every minute
    const interval = setInterval(() => {
      if (prayerTimes.length > 0) {
        const next = getNextPrayer(prayerTimes)
        setNextPrayer(next.name)
        setTimeToNext(next.timeLeft)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!location) {
      useFallbackLocation()
    }
  }, [location])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading prayer times...</span>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded bg-muted animate-pulse">
              <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
              <div className="h-4 w-12 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Location and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {location?.city}, {location?.country}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={refreshPrayerTimes} className="h-8 w-8 p-0">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Next Prayer */}
      {nextPrayer && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next Prayer:</span>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            >
              {nextPrayer}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">in {timeToNext}</span>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="space-y-2">
        {prayerTimes.map((prayer, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              prayer.name === nextPrayer
                ? "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"
                : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{prayer.name}</span>
              <span className="text-xs text-muted-foreground">{prayer.arabic}</span>
            </div>
            <span className="text-sm font-mono font-medium">{prayer.time}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">Times are calculated based on your location</div>
    </div>
  )
}
