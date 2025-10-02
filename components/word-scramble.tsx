"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RefreshCw, Check, X, Trophy, Zap, Target, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"

interface WordPuzzle {
  original: string
  scrambled: string
  hint: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

const wordPuzzles: WordPuzzle[] = [
  // Easy words (3-5 letters)
  {
    original: "ALLAH",
    scrambled: "HALAL",
    hint: "The name of God in Arabic",
    category: "Names of Allah",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "ISLAM",
    scrambled: "MAILS",
    hint: "The religion of peace and submission",
    category: "Religion",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "QURAN",
    scrambled: "RANQU",
    hint: "The holy book of Islam",
    category: "Islamic Texts",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "HAJJ",
    scrambled: "JJHA",
    hint: "The pilgrimage to Mecca",
    category: "Pillars of Islam",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "SALAH",
    scrambled: "LASAH",
    hint: "The ritual prayer performed five times daily",
    category: "Pillars of Islam",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "ZAKAT",
    scrambled: "TAKAZ",
    hint: "Obligatory charity given to the poor",
    category: "Pillars of Islam",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "SAWM",
    scrambled: "MAWS",
    hint: "Fasting during Ramadan",
    category: "Pillars of Islam",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "IMAN",
    scrambled: "MAIN",
    hint: "Faith or belief in Islam",
    category: "Beliefs",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "DUNYA",
    scrambled: "YANUD",
    hint: "The worldly life",
    category: "Islamic Terms",
    difficulty: "easy",
    points: 10,
  },
  {
    original: "JANNAH",
    scrambled: "HANJAN",
    hint: "Paradise in Islam",
    category: "Afterlife",
    difficulty: "easy",
    points: 10,
  },
  // Medium words (6-8 letters)
  {
    original: "RAMADAN",
    scrambled: "MARANAD",
    hint: "The holy month of fasting",
    category: "Islamic Months",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "MUHAMMAD",
    scrambled: "DAMMAHUM",
    hint: "The final Prophet of Islam",
    category: "Prophets",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "IBRAHIM",
    scrambled: "MIHARBI",
    hint: "The Prophet known as the friend of Allah",
    category: "Prophets",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "MAKKAH",
    scrambled: "HAMKKA",
    hint: "The holiest city in Islam",
    category: "Holy Places",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "MADINAH",
    scrambled: "HANDIMA",
    hint: "The city of the Prophet",
    category: "Holy Places",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "SHAHADA",
    scrambled: "HADASAH",
    hint: "The declaration of faith",
    category: "Pillars of Islam",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "TAWHID",
    scrambled: "HIWTAD",
    hint: "The oneness of Allah",
    category: "Beliefs",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "SUNNAH",
    scrambled: "HANSUN",
    hint: "The way of the Prophet",
    category: "Islamic Terms",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "UMMAH",
    scrambled: "HAMMU",
    hint: "The global Muslim community",
    category: "Community",
    difficulty: "medium",
    points: 20,
  },
  {
    original: "JIHAD",
    scrambled: "HAJID",
    hint: "Struggle in the way of Allah",
    category: "Islamic Terms",
    difficulty: "medium",
    points: 20,
  },
  // Hard words (9+ letters)
  {
    original: "ALHAMDULILLAH",
    scrambled: "HALLAMDUHILLA",
    hint: "Praise be to Allah",
    category: "Dhikr",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "SUBHANALLAH",
    scrambled: "HANSALLABU",
    hint: "Glory be to Allah",
    category: "Dhikr",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "ASTAGHFIRULLAH",
    scrambled: "GHAFIRULLAHAS",
    hint: "I seek forgiveness from Allah",
    category: "Dhikr",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "BISMILLAH",
    scrambled: "MILLAHBIS",
    hint: "In the name of Allah",
    category: "Dhikr",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "MASHAALLAH",
    scrambled: "ALLAHMASHA",
    hint: "What Allah has willed",
    category: "Expressions",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "INSHALLAH",
    scrambled: "ALLAHSHIN",
    hint: "If Allah wills",
    category: "Expressions",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "BARAKALLAHU",
    scrambled: "ALLAHUKARAB",
    hint: "May Allah bless",
    category: "Expressions",
    difficulty: "hard",
    points: 30,
  },
  {
    original: "ASSALAMU",
    scrambled: "MUASALAS",
    hint: "Peace be upon (greeting)",
    category: "Greetings",
    difficulty: "hard",
    points: 30,
  },
]

interface GameState {
  currentPuzzle: number
  userAnswer: string
  score: number
  totalScore: number
  showResult: boolean
  isCorrect: boolean | null
  gameCompleted: boolean
  timeLeft: number
  gameActive: boolean
  streak: number
  hintsUsed: number
  puzzles: WordPuzzle[]
  difficulty: "easy" | "medium" | "hard" | "mixed"
  isChecking: boolean
}

export function WordScramble() {
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzle: 0,
    userAnswer: "",
    score: 0,
    totalScore: 0,
    showResult: false,
    isCorrect: null,
    gameCompleted: false,
    timeLeft: 45,
    gameActive: false,
    streak: 0,
    hintsUsed: 0,
    puzzles: [],
    difficulty: "mixed",
    isChecking: false,
  })

  const [showHint, setShowHint] = useState(false)

  const selectPuzzles = (difficulty: "easy" | "medium" | "hard" | "mixed", count = 10): WordPuzzle[] => {
    let filteredPuzzles: WordPuzzle[]

    if (difficulty === "mixed") {
      filteredPuzzles = [...wordPuzzles]
    } else {
      filteredPuzzles = wordPuzzles.filter((p) => p.difficulty === difficulty)
    }

    // Shuffle and select random puzzles
    const shuffled = [...filteredPuzzles].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  const startGame = (difficulty: "easy" | "medium" | "hard" | "mixed") => {
    const selectedPuzzles = selectPuzzles(difficulty, 10)
    setGameState({
      currentPuzzle: 0,
      userAnswer: "",
      score: 0,
      totalScore: 0,
      showResult: false,
      isCorrect: null,
      gameCompleted: false,
      timeLeft: difficulty === "hard" ? 60 : difficulty === "medium" ? 50 : 45,
      gameActive: true,
      streak: 0,
      hintsUsed: 0,
      puzzles: selectedPuzzles,
      difficulty,
      isChecking: false,
    })
    setShowHint(false)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState.gameActive && gameState.timeLeft > 0 && !gameState.showResult) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    } else if (gameState.timeLeft === 0 && !gameState.showResult) {
      handleCheckAnswer(true)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.gameActive, gameState.timeLeft, gameState.showResult])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState((prev) => ({
      ...prev,
      userAnswer: e.target.value.toUpperCase(),
    }))
  }

  const handleCheckAnswer = (timeUp = false) => {
    // Set checking state
    setGameState((prev) => ({
      ...prev,
      isChecking: true,
      gameActive: false,
    }))

    // Simulate checking delay
    setTimeout(() => {
      const currentWord = gameState.puzzles[gameState.currentPuzzle]
      const correct = gameState.userAnswer.toUpperCase() === currentWord.original

      let points = 0
      let newStreak = gameState.streak

      if (correct) {
        points = currentWord.points
        // Bonus points for streak
        if (gameState.streak >= 2) {
          points += Math.floor(points * 0.5) // 50% bonus for streak
        }
        // Bonus for not using hints
        if (!showHint) {
          points += 5
        }
        // Time bonus
        if (gameState.timeLeft > 30) {
          points += 10
        }
        newStreak = gameState.streak + 1
      } else {
        newStreak = 0
      }

      setGameState((prev) => ({
        ...prev,
        isCorrect: correct,
        showResult: true,
        isChecking: false,
        score: correct ? prev.score + points : prev.score,
        totalScore: prev.totalScore + points,
        streak: newStreak,
      }))

      if (correct && newStreak >= 3) {
        // Celebration for streak
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          })
        } catch (error) {
          console.error("Confetti error:", error)
        }
      }

      // Move to next puzzle after delay
      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          showResult: false,
          userAnswer: "",
        }))

        if (gameState.currentPuzzle < gameState.puzzles.length - 1) {
          setGameState((prev) => ({
            ...prev,
            currentPuzzle: prev.currentPuzzle + 1,
            timeLeft: prev.difficulty === "hard" ? 60 : prev.difficulty === "medium" ? 50 : 45,
            gameActive: true,
          }))
          setShowHint(false)
        } else {
          setGameState((prev) => ({
            ...prev,
            gameCompleted: true,
          }))
        }
      }, 2000)
    }, 1000) // 1 second checking delay
  }

  const useHint = () => {
    if (!showHint && gameState.hintsUsed < 3) {
      setShowHint(true)
      setGameState((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
      }))
    }
  }

  const resetGame = () => {
    setGameState({
      currentPuzzle: 0,
      userAnswer: "",
      score: 0,
      totalScore: 0,
      showResult: false,
      isCorrect: null,
      gameCompleted: false,
      timeLeft: 45,
      gameActive: false,
      streak: 0,
      hintsUsed: 0,
      puzzles: [],
      difficulty: "mixed",
      isChecking: false,
    })
    setShowHint(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  if (!gameState.gameActive && !gameState.gameCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-emerald-500" />
            Islamic Word Scramble
          </CardTitle>
          <CardDescription>
            Unscramble Islamic terms and earn points! Choose your difficulty level to begin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => startGame("easy")} className="h-20 flex-col bg-green-600 hover:bg-green-700">
              <span className="font-semibold">Easy</span>
              <span className="text-xs opacity-75">3-5 letters • 10 pts</span>
            </Button>
            <Button onClick={() => startGame("medium")} className="h-20 flex-col bg-yellow-600 hover:bg-yellow-700">
              <span className="font-semibold">Medium</span>
              <span className="text-xs opacity-75">6-8 letters • 20 pts</span>
            </Button>
            <Button onClick={() => startGame("hard")} className="h-20 flex-col bg-red-600 hover:bg-red-700">
              <span className="font-semibold">Hard</span>
              <span className="text-xs opacity-75">9+ letters • 30 pts</span>
            </Button>
            <Button onClick={() => startGame("mixed")} className="h-20 flex-col bg-blue-600 hover:bg-blue-700">
              <span className="font-semibold">Mixed</span>
              <span className="text-xs opacity-75">All levels • Bonus pts</span>
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold">Game Features:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Streak bonuses</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Time bonuses</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span>Hint system</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                <span>Achievement system</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState.gameCompleted) {
    const percentage = (gameState.score / (gameState.puzzles.length * 30)) * 100
    let achievement = ""
    if (percentage >= 90) achievement = "🏆 Master Scholar!"
    else if (percentage >= 75) achievement = "🌟 Islamic Scholar!"
    else if (percentage >= 60) achievement = "📚 Knowledge Seeker!"
    else if (percentage >= 40) achievement = "🎯 Learning Student!"
    else achievement = "🌱 Keep Learning!"

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Game Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">{gameState.score}</div>
          <p className="text-xl font-semibold">{achievement}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="font-semibold">Correct Answers</div>
              <div className="text-2xl font-bold text-blue-600">
                {gameState.puzzles.filter((_, i) => i < gameState.currentPuzzle + 1).length}
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="font-semibold">Best Streak</div>
              <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="font-semibold">Hints Used</div>
              <div className="text-2xl font-bold text-green-600">{gameState.hintsUsed}/3</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="font-semibold">Difficulty</div>
              <Badge className={getDifficultyColor(gameState.difficulty)}>
                {gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)}
              </Badge>
            </div>
          </div>

          <Progress value={percentage} className="w-full" />
          <p className="text-sm text-muted-foreground">{Math.round(percentage)}% Score</p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button onClick={resetGame} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button onClick={() => startGame(gameState.difficulty)}>New Game</Button>
        </CardFooter>
      </Card>
    )
  }

  const currentWord = gameState.puzzles[gameState.currentPuzzle]
  const progress = ((gameState.currentPuzzle + 1) / gameState.puzzles.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(currentWord.difficulty)}>{currentWord.difficulty}</Badge>
            <Badge variant="outline">{currentWord.category}</Badge>
            {gameState.streak > 0 && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <Zap className="h-3 w-3 mr-1" />
                {gameState.streak}x streak
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-mono font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${gameState.timeLeft <= 15 ? "text-red-500 font-bold" : ""}`}>
                {gameState.timeLeft}s
              </span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Puzzle {gameState.currentPuzzle + 1} of {gameState.puzzles.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold tracking-widest mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            {currentWord.scrambled.split("").join(" ")}
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Points:</span>
            <Badge variant="secondary">{currentWord.points}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Category: {currentWord.category}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={useHint}
              disabled={showHint || gameState.hintsUsed >= 3}
              className="text-xs"
            >
              💡 Hint ({3 - gameState.hintsUsed} left)
            </Button>
          </div>

          {showHint && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm">
                <strong>Hint:</strong> {currentWord.hint}
              </p>
            </div>
          )}

          <Input
            type="text"
            placeholder="Type your answer here"
            value={gameState.userAnswer}
            onChange={handleInputChange}
            className="text-center uppercase text-lg font-bold"
            disabled={gameState.showResult}
            autoComplete="off"
            autoFocus
          />
        </div>

        {gameState.showResult && (
          <div
            className={`p-4 rounded-lg text-center ${
              gameState.isCorrect
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {gameState.isCorrect ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">Correct! +{currentWord.points} points</span>
                </div>
                {gameState.streak > 1 && (
                  <div className="text-sm">
                    <Zap className="h-4 w-4 inline mr-1" />
                    Streak bonus! {gameState.streak}x multiplier
                  </div>
                )}
                <div className="text-sm">
                  The answer is: <strong>{currentWord.original}</strong>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <X className="h-5 w-5" />
                <span>
                  Incorrect! The answer is <strong>{currentWord.original}</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => handleCheckAnswer()}
          disabled={gameState.userAnswer.length === 0 || gameState.showResult || gameState.isChecking}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {gameState.isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking...
            </>
          ) : (
            "Check Answer"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
