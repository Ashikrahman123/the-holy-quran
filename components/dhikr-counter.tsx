"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, RefreshCw, Award, Save, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DhikrItem {
  id: string
  name: string
  arabicText: string
  translation: string
  virtue: string
  count: number
  target: number
  color: string
}

const defaultDhikrItems: DhikrItem[] = [
  {
    id: "subhanallah",
    name: "SubhanAllah",
    arabicText: "سُبْحَانَ ٱللَّٰهِ",
    translation: "Glory be to Allah",
    virtue: "Plants a palm tree in Paradise for each recitation",
    count: 0,
    target: 33,
    color: "bg-emerald-500",
  },
  {
    id: "alhamdulillah",
    name: "Alhamdulillah",
    arabicText: "ٱلْحَمْدُ لِلَّٰهِ",
    translation: "All praise is due to Allah",
    virtue: "Fills the scales of good deeds",
    count: 0,
    target: 33,
    color: "bg-blue-500",
  },
  {
    id: "allahuakbar",
    name: "Allahu Akbar",
    arabicText: "ٱللَّٰهُ أَكْبَرُ",
    translation: "Allah is the Greatest",
    virtue: "Fills the space between heaven and earth with reward",
    count: 0,
    target: 34,
    color: "bg-purple-500",
  },
  {
    id: "lailahaillallah",
    name: "La ilaha illallah",
    arabicText: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ",
    translation: "There is no god but Allah",
    virtue: "The best remembrance, erases sins",
    count: 0,
    target: 100,
    color: "bg-amber-500",
  },
  {
    id: "astaghfirullah",
    name: "Astaghfirullah",
    arabicText: "أَسْتَغْفِرُ ٱللَّٰهَ",
    translation: "I seek forgiveness from Allah",
    virtue: "Prophet Muhammad ﷺ sought forgiveness 100 times daily",
    count: 0,
    target: 100,
    color: "bg-rose-500",
  },
]

const STORAGE_KEY = "quran_app_dhikr_counts"
const DAILY_STORAGE_KEY = "quran_app_daily_dhikr"

export function DhikrCounter() {
  const [dhikrItems, setDhikrItems] = useState<DhikrItem[]>(defaultDhikrItems)
  const [activeTab, setActiveTab] = useState("daily")
  const [dailyStreak, setDailyStreak] = useState(0)
  const [todayTotal, setTodayTotal] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { toast } = useToast()

  // Load saved counts and streak data
  useEffect(() => {
    try {
      // Load dhikr counts
      const savedCounts = localStorage.getItem(STORAGE_KEY)
      if (savedCounts) {
        const parsedCounts = JSON.parse(savedCounts)
        setDhikrItems((prev) =>
          prev.map((item) => ({
            ...item,
            count: parsedCounts[item.id] || 0,
          })),
        )
      }

      // Load daily streak data
      const dailyData = localStorage.getItem(DAILY_STORAGE_KEY)
      if (dailyData) {
        const { streak, lastDate, todayCount } = JSON.parse(dailyData)

        // Check if last saved date was today
        const today = new Date().toDateString()
        const lastSavedDate = new Date(lastDate).toDateString()

        if (lastSavedDate === today) {
          setDailyStreak(streak)
          setTodayTotal(todayCount)
          setLastSaved(new Date(lastDate))
        } else if (new Date(lastDate).getTime() > new Date().getTime() - 48 * 60 * 60 * 1000) {
          // If last saved was yesterday, continue streak but reset today's count
          setDailyStreak(streak)
          setTodayTotal(0)
        } else {
          // If more than a day has passed, reset streak
          setDailyStreak(0)
          setTodayTotal(0)
        }
      }
    } catch (error) {
      console.error("Error loading dhikr data:", error)
    }
  }, [])

  // Save counts when they change
  useEffect(() => {
    try {
      // Save individual counts
      const countsToSave = dhikrItems.reduce(
        (acc, item) => {
          acc[item.id] = item.count
          return acc
        },
        {} as Record<string, number>,
      )

      localStorage.setItem(STORAGE_KEY, JSON.stringify(countsToSave))

      // Calculate total for today
      const newTotal = dhikrItems.reduce((sum, item) => sum + item.count, 0)
      setTodayTotal(newTotal)

      // Save daily streak data
      const now = new Date()
      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify({
          streak: dailyStreak,
          lastDate: now.toISOString(),
          todayCount: newTotal,
        }),
      )

      setLastSaved(now)
    } catch (error) {
      console.error("Error saving dhikr data:", error)
    }
  }, [dhikrItems, dailyStreak])

  const incrementCount = (id: string) => {
    setDhikrItems((prev) => prev.map((item) => (item.id === id ? { ...item, count: item.count + 1 } : item)))

    // If this is the first dhikr of a new day, increment streak
    if (todayTotal === 0 && dailyStreak === 0) {
      setDailyStreak(1)
    }
  }

  const resetCount = (id: string) => {
    setDhikrItems((prev) => prev.map((item) => (item.id === id ? { ...item, count: 0 } : item)))
  }

  const resetAllCounts = () => {
    setDhikrItems((prev) => prev.map((item) => ({ ...item, count: 0 })))
    toast({
      title: "Counters Reset",
      description: "All dhikr counters have been reset to zero.",
    })
  }

  const completeDaily = () => {
    // Check if all targets are met
    const allCompleted = dhikrItems.every((item) => item.count >= item.target)

    if (allCompleted) {
      setDailyStreak((prev) => prev + 1)
      toast({
        title: "Daily Dhikr Completed!",
        description: `You've completed your daily dhikr! Your streak is now ${dailyStreak + 1} days.`,
      })
    } else {
      toast({
        title: "Not Completed Yet",
        description: "Complete all your target counts to mark today as complete.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Dhikr Counter
        </CardTitle>
        <CardDescription>Track your daily remembrance of Allah</CardDescription>
      </CardHeader>

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily Dhikr</TabsTrigger>
            <TabsTrigger value="tasbeeh">Tasbeeh Counter</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Streak</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30">
                    <Award className="mr-1 h-3 w-3 text-amber-500" />
                    {dailyStreak} {dailyStreak === 1 ? "day" : "days"}
                  </Badge>
                  {lastSaved && (
                    <span className="text-xs text-muted-foreground">
                      Last updated: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={completeDaily}>
                <RefreshCw className="mr-1 h-4 w-4" />
                Complete Today
              </Button>
            </div>

            <div className="space-y-3">
              {dhikrItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.translation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-arabic font-bold">{item.arabicText}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.count}/{item.target}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => resetCount(item.id)}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Progress value={(item.count / item.target) * 100} className={`h-2 ${item.color}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="tasbeeh" className="space-y-4">
          <CardContent className="grid gap-4 pt-4">
            {dhikrItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className={`h-1 w-full ${item.color}`} />
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xl font-arabic">{item.arabicText}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.virtue}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold tabular-nums">{item.count}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => resetCount(item.id)}>
                        Reset
                      </Button>
                      <Button onClick={() => incrementCount(item.id)} className={item.color}>
                        Count
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetAllCounts}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Progress Saved",
              description: "Your dhikr counts have been saved successfully.",
            })
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Progress
        </Button>
      </CardFooter>
    </Card>
  )
}
