"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, RefreshCw, Award, Save, RotateCcw, Trophy, Star, Flame } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface DhikrItem {
  id: string
  name: string
  arabicText: string
  translation: string
  virtue: string
  count: number
  target: number
  color: string
  animation: string
  icon: JSX.Element
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
    animation: "animate-pulse",
    icon: <Sparkles className="h-5 w-5 text-emerald-500" />,
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
    animation: "animate-bounce",
    icon: <Star className="h-5 w-5 text-blue-500" />,
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
    animation: "animate-pulse",
    icon: <Trophy className="h-5 w-5 text-purple-500" />,
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
    animation: "animate-bounce",
    icon: <Flame className="h-5 w-5 text-amber-500" />,
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
    animation: "animate-pulse",
    icon: <RefreshCw className="h-5 w-5 text-rose-500" />,
  },
]

const STORAGE_KEY = "quran_app_dhikr_counts"
const DAILY_STORAGE_KEY = "quran_app_daily_dhikr"
const ACHIEVEMENTS_KEY = "quran_app_dhikr_achievements"

interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
  icon: JSX.Element
}

const achievements: Achievement[] = [
  {
    id: "first_dhikr",
    title: "First Steps",
    description: "Complete your first dhikr",
    unlocked: false,
    icon: <Star className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: "daily_33",
    title: "Tasbeeh Master",
    description: "Complete 33 SubhanAllah in one day",
    unlocked: false,
    icon: <Award className="h-5 w-5 text-emerald-500" />,
  },
  {
    id: "streak_7",
    title: "Weekly Devotion",
    description: "Maintain a 7-day streak",
    unlocked: false,
    icon: <Flame className="h-5 w-5 text-orange-500" />,
  },
  {
    id: "all_types",
    title: "Complete Remembrance",
    description: "Recite all five types of dhikr in one day",
    unlocked: false,
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
  },
  {
    id: "thousand_dhikr",
    title: "Thousand Blessings",
    description: "Reach 1000 total dhikr recitations",
    unlocked: false,
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
  },
]

export function DhikrCounter() {
  const [dhikrItems, setDhikrItems] = useState<DhikrItem[]>(defaultDhikrItems)
  const [activeTab, setActiveTab] = useState("daily")
  const [dailyStreak, setDailyStreak] = useState(0)
  const [todayTotal, setTodayTotal] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [totalLifetimeCount, setTotalLifetimeCount] = useState(0)
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements)
  const [showConfetti, setShowConfetti] = useState(false)
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
        const { streak, lastDate, todayCount, lifetimeCount } = JSON.parse(dailyData)

        // Check if last saved date was today
        const today = new Date().toDateString()
        const lastSavedDate = new Date(lastDate).toDateString()

        if (lastSavedDate === today) {
          setDailyStreak(streak)
          setTodayTotal(todayCount)
          setLastSaved(new Date(lastDate))
          setTotalLifetimeCount(lifetimeCount || 0)
        } else if (new Date(lastDate).getTime() > new Date().getTime() - 48 * 60 * 60 * 1000) {
          // If last saved was yesterday, continue streak but reset today's count
          setDailyStreak(streak)
          setTodayTotal(0)
          setTotalLifetimeCount(lifetimeCount || 0)
        } else {
          // If more than a day has passed, reset streak
          setDailyStreak(0)
          setTodayTotal(0)
          setTotalLifetimeCount(lifetimeCount || 0)
        }
      }

      // Load achievements
      const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY)
      if (savedAchievements) {
        const parsedAchievements = JSON.parse(savedAchievements)
        setUserAchievements((prev) =>
          prev.map((achievement) => ({
            ...achievement,
            unlocked: parsedAchievements[achievement.id] || false,
          })),
        )
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

      // Update lifetime total
      const newLifetimeTotal = totalLifetimeCount + (newTotal - todayTotal)
      if (newTotal > todayTotal) {
        setTotalLifetimeCount(newLifetimeTotal)
      }

      // Save daily streak data
      const now = new Date()
      localStorage.setItem(
        DAILY_STORAGE_KEY,
        JSON.stringify({
          streak: dailyStreak,
          lastDate: now.toISOString(),
          todayCount: newTotal,
          lifetimeCount: newLifetimeTotal,
        }),
      )

      setLastSaved(now)

      // Check achievements
      checkAchievements(newTotal, newLifetimeTotal)
    } catch (error) {
      console.error("Error saving dhikr data:", error)
    }
  }, [dhikrItems, dailyStreak, todayTotal, totalLifetimeCount])

  // Save achievements when they change
  useEffect(() => {
    try {
      const achievementsToSave = userAchievements.reduce(
        (acc, achievement) => {
          acc[achievement.id] = achievement.unlocked
          return acc
        },
        {} as Record<string, boolean>,
      )

      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementsToSave))
    } catch (error) {
      console.error("Error saving achievements:", error)
    }
  }, [userAchievements])

  const checkAchievements = (newTotal: number, lifetimeTotal: number) => {
    const updatedAchievements = [...userAchievements]
    let newAchievementUnlocked = false

    // First dhikr achievement
    if (newTotal > 0 && !updatedAchievements.find((a) => a.id === "first_dhikr")?.unlocked) {
      updatedAchievements.find((a) => a.id === "first_dhikr")!.unlocked = true
      newAchievementUnlocked = true
    }

    // 33 SubhanAllah achievement
    const subhanAllahCount = dhikrItems.find((item) => item.id === "subhanallah")?.count || 0
    if (subhanAllahCount >= 33 && !updatedAchievements.find((a) => a.id === "daily_33")?.unlocked) {
      updatedAchievements.find((a) => a.id === "daily_33")!.unlocked = true
      newAchievementUnlocked = true
    }

    // 7-day streak achievement
    if (dailyStreak >= 7 && !updatedAchievements.find((a) => a.id === "streak_7")?.unlocked) {
      updatedAchievements.find((a) => a.id === "streak_7")!.unlocked = true
      newAchievementUnlocked = true
    }

    // All types of dhikr achievement
    const allTypesCompleted = dhikrItems.every((item) => item.count > 0)
    if (allTypesCompleted && !updatedAchievements.find((a) => a.id === "all_types")?.unlocked) {
      updatedAchievements.find((a) => a.id === "all_types")!.unlocked = true
      newAchievementUnlocked = true
    }

    // 1000 total dhikr achievement
    if (lifetimeTotal >= 1000 && !updatedAchievements.find((a) => a.id === "thousand_dhikr")?.unlocked) {
      updatedAchievements.find((a) => a.id === "thousand_dhikr")!.unlocked = true
      newAchievementUnlocked = true
    }

    if (newAchievementUnlocked) {
      setUserAchievements(updatedAchievements)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)

      const newlyUnlocked = updatedAchievements.find(
        (a) => a.unlocked && !userAchievements.find((ua) => ua.id === a.id)?.unlocked,
      )
      if (newlyUnlocked) {
        toast({
          title: "Achievement Unlocked! 🎉",
          description: `${newlyUnlocked.title}: ${newlyUnlocked.description}`,
        })
      }
    }
  }

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
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      toast({
        title: "Daily Dhikr Completed! 🎉",
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
    <Card className="w-full overflow-hidden shadow-md">
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-500 animate-confetti-1"></div>
          <div className="absolute top-0 left-1/3 w-1 h-1 bg-emerald-500 animate-confetti-2"></div>
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-500 animate-confetti-3"></div>
          <div className="absolute top-0 left-2/3 w-1 h-1 bg-purple-500 animate-confetti-4"></div>
          <div className="absolute top-0 left-3/4 w-1 h-1 bg-rose-500 animate-confetti-5"></div>
          <div className="absolute top-0 left-1/5 w-1 h-1 bg-amber-500 animate-confetti-6"></div>
        </div>
      )}

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-1.5"></div>
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Dhikr Counter
        </CardTitle>
        <CardDescription>Track your daily remembrance of Allah</CardDescription>
      </CardHeader>

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="daily" className="rounded-l-xl">
              Daily Dhikr
            </TabsTrigger>
            <TabsTrigger value="tasbeeh">Tasbeeh Counter</TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-r-xl">
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="daily" className="space-y-4">
          <CardContent className="space-y-5 pt-5 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium mb-1.5">Daily Streak</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5">
                    <Flame className="mr-1.5 h-4 w-4 text-amber-500" />
                    <span className="font-bold">{dailyStreak}</span> {dailyStreak === 1 ? "day" : "days"}
                  </Badge>
                  {lastSaved && (
                    <span className="text-xs text-muted-foreground">
                      Last updated: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={completeDaily} className="gap-1.5 h-10">
                <Trophy className="h-4 w-4 text-amber-500" />
                Complete Today
              </Button>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-lg">Total Dhikr Today</h3>
                <Badge variant="secondary" className="text-lg font-bold px-3 py-1.5">
                  {todayTotal}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Lifetime Total</span>
                <span className="font-medium">{totalLifetimeCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-5">
              {dhikrItems.map((item) => (
                <div key={item.id} className="space-y-2 bg-white dark:bg-background rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full bg-${item.color.split("-")[1]}-100 dark:bg-${item.color.split("-")[1]}-900/30`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.translation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-arabic font-bold mb-1">{item.arabicText}</p>
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
                  <Progress
                    value={(item.count / item.target) * 100}
                    className={`h-2.5 ${item.color} ${item.count >= item.target ? item.animation : ""} rounded-full`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="tasbeeh" className="space-y-4">
          <CardContent className="grid gap-5 pt-5 px-6">
            {dhikrItems.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow transition-shadow">
                <div className={`h-1.5 w-full ${item.color}`} />
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full bg-${item.color.split("-")[1]}-100 dark:bg-${item.color.split("-")[1]}-900/30`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-medium text-lg">{item.name}</h3>
                    </div>
                    <p className="text-xl font-arabic">{item.arabicText}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">{item.virtue}</p>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "text-5xl font-bold tabular-nums transition-all",
                        item.count >= item.target && "text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      {item.count}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => resetCount(item.id)}>
                        Reset
                      </Button>
                      <Button onClick={() => incrementCount(item.id)} className={item.color} size="lg">
                        Count
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <CardContent className="pt-5 px-6">
            <div className="mb-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4">
              <h3 className="font-medium text-lg mb-2">Your Progress</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You've unlocked {userAchievements.filter((a) => a.unlocked).length} of {userAchievements.length}{" "}
                achievements
              </p>
              <Progress
                value={(userAchievements.filter((a) => a.unlocked).length / userAchievements.length) * 100}
                className="h-2.5 bg-muted-foreground/20 rounded-full"
              />
            </div>

            <div className="space-y-4">
              {userAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={cn(
                    "transition-all",
                    achievement.unlocked
                      ? "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
                      : "opacity-70",
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={cn(
                        "rounded-full p-3",
                        achievement.unlocked ? "bg-amber-100 dark:bg-amber-900" : "bg-muted",
                      )}
                    >
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        {achievement.title}
                        {achievement.unlocked && <Trophy className="h-4 w-4 text-amber-500" />}
                      </h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between p-6 border-t">
        <Button variant="outline" onClick={resetAllCounts} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Progress Saved",
              description: "Your dhikr counts have been saved successfully.",
            })
          }}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          Save Progress
        </Button>
      </CardFooter>
    </Card>
  )
}
