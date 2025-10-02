"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Trophy, Clock, Target, Zap, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import confetti from "canvas-confetti"

interface MemoryCard {
  id: number
  content: string
  flipped: boolean
  matched: boolean
  category: string
}

interface GameStats {
  moves: number
  matches: number
  timeElapsed: number
  score: number
  perfectMatches: number
  streak: number
}

const islamicSymbols = [
  { symbol: "🕋", name: "Kaaba", category: "Holy Places" },
  { symbol: "🕌", name: "Mosque", category: "Holy Places" },
  { symbol: "📿", name: "Prayer Beads", category: "Prayer Items" },
  { symbol: "☪️", name: "Star and Crescent", category: "Symbols" },
  { symbol: "🌙", name: "Crescent Moon", category: "Symbols" },
  { symbol: "📖", name: "Holy Book", category: "Religious Items" },
  { symbol: "🌟", name: "Star", category: "Symbols" },
  { symbol: "🤲", name: "Hands in Prayer", category: "Prayer Items" },
  { symbol: "🕯️", name: "Candle", category: "Religious Items" },
  { symbol: "🎭", name: "Islamic Art", category: "Culture" },
  { symbol: "🏺", name: "Islamic Pottery", category: "Culture" },
  { symbol: "🗝️", name: "Key to Knowledge", category: "Symbols" },
]

interface GameMode {
  name: string
  pairs: number
  timeLimit: number
  description: string
  difficulty: "easy" | "medium" | "hard"
}

const gameModes: GameMode[] = [
  {
    name: "Beginner",
    pairs: 6,
    timeLimit: 120,
    description: "6 pairs • 2 minutes",
    difficulty: "easy",
  },
  {
    name: "Intermediate",
    pairs: 8,
    timeLimit: 180,
    description: "8 pairs • 3 minutes",
    difficulty: "medium",
  },
  {
    name: "Expert",
    pairs: 12,
    timeLimit: 240,
    description: "12 pairs • 4 minutes",
    difficulty: "hard",
  },
]

export function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    score: 0,
    perfectMatches: 0,
    streak: 0,
  })
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  // Initialize game
  const initializeGame = (mode: GameMode) => {
    // Select random symbols for the game
    const selectedSymbols = [...islamicSymbols].sort(() => Math.random() - 0.5).slice(0, mode.pairs)

    // Create pairs of cards
    const cardPairs = [...selectedSymbols, ...selectedSymbols].map((item, index) => ({
      id: index,
      content: item.symbol,
      flipped: false,
      matched: false,
      category: item.category,
    }))

    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setGameStats({
      moves: 0,
      matches: 0,
      timeElapsed: 0,
      score: 0,
      perfectMatches: 0,
      streak: 0,
    })
    setGameCompleted(false)
    setSelectedMode(mode)
    setTimeLeft(mode.timeLimit)
    setShowPreview(true)

    // Show preview for 3 seconds
    setTimeout(() => {
      setShowPreview(false)
      setGameStarted(true)
    }, 3000)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStarted && !gameCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
        setGameStats((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }))
      }, 1000)
    } else if (timeLeft === 0 && gameStarted) {
      // Time's up
      setGameCompleted(true)
      setGameStarted(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameCompleted, timeLeft])

  // Check for game completion
  useEffect(() => {
    if (selectedMode && gameStats.matches === selectedMode.pairs && gameStarted) {
      setGameCompleted(true)
      setGameStarted(false)

      // Calculate final score
      const timeBonus = Math.max(0, timeLeft * 10)
      const moveBonus = Math.max(0, (selectedMode.pairs * 2 - gameStats.moves) * 50)
      const perfectBonus = gameStats.perfectMatches * 100
      const finalScore = timeBonus + moveBonus + perfectBonus

      setGameStats((prev) => ({
        ...prev,
        score: finalScore,
      }))

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch (error) {
        console.error("Confetti error:", error)
      }
    }
  }, [gameStats.matches, selectedMode, gameStarted, timeLeft])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.content === secondCard.content) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex ? { ...card, matched: true } : card,
          ),
        )

        setGameStats((prev) => {
          const newMatches = prev.matches + 1
          const isPerfectMatch = prev.moves === newMatches * 2 - 2 // Perfect if no wrong moves
          const newStreak = isPerfectMatch ? prev.streak + 1 : 0

          return {
            ...prev,
            matches: newMatches,
            perfectMatches: isPerfectMatch ? prev.perfectMatches + 1 : prev.perfectMatches,
            streak: newStreak,
          }
        })

        setFlippedCards([])
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, flipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }

      setGameStats((prev) => ({
        ...prev,
        moves: prev.moves + 1,
      }))
    }
  }, [flippedCards, cards])

  const handleCardClick = (index: number) => {
    // Ignore click if card is already flipped, matched, or if we have 2 cards flipped
    if (cards[index].flipped || cards[index].matched || flippedCards.length >= 2 || showPreview) {
      return
    }

    // Flip the card
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, flipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, index])
  }

  const resetGame = () => {
    setCards([])
    setFlippedCards([])
    setGameStats({
      moves: 0,
      matches: 0,
      timeElapsed: 0,
      score: 0,
      perfectMatches: 0,
      streak: 0,
    })
    setGameCompleted(false)
    setGameStarted(false)
    setSelectedMode(null)
    setTimeLeft(0)
    setShowPreview(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
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

  const getPerformanceRating = () => {
    if (!selectedMode) return ""
    const efficiency = (selectedMode.pairs * 2) / gameStats.moves
    if (efficiency >= 0.9) return "🏆 Perfect!"
    if (efficiency >= 0.8) return "🌟 Excellent!"
    if (efficiency >= 0.7) return "👍 Great!"
    if (efficiency >= 0.6) return "👌 Good!"
    return "💪 Keep practicing!"
  }

  if (!gameStarted && !gameCompleted && !selectedMode) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-emerald-500" />
            Islamic Memory Match
          </CardTitle>
          <CardDescription>
            Match pairs of Islamic symbols and test your memory! Choose your difficulty level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {gameModes.map((mode, index) => (
              <Button
                key={index}
                onClick={() => initializeGame(mode)}
                className="h-16 flex justify-between items-center p-4"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <Badge className={getDifficultyColor(mode.difficulty)}>{mode.name}</Badge>
                  <span className="font-semibold">{mode.description}</span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>
                    Grid: {Math.ceil(Math.sqrt(mode.pairs * 2))}×{Math.ceil(Math.sqrt(mode.pairs * 2))}
                  </div>
                  <div>Time: {Math.floor(mode.timeLimit / 60)}m</div>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold">Scoring System:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Time bonus: 10 pts/sec</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span>Move bonus: 50 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Perfect match: 100 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Streak multiplier</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showPreview) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Get Ready!</CardTitle>
          <CardDescription>Memorize the positions - game starts in 3 seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`grid gap-2 ${selectedMode?.pairs === 6 ? "grid-cols-4" : selectedMode?.pairs === 8 ? "grid-cols-4" : "grid-cols-6"}`}
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="aspect-square flex items-center justify-center text-2xl rounded-md bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-800"
              >
                {card.content}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            {timeLeft > 0 ? "Congratulations!" : "Time's Up!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">{gameStats.score}</div>
          <p className="text-xl font-semibold">{getPerformanceRating()}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="font-semibold">Moves</div>
              <div className="text-2xl font-bold text-blue-600">{gameStats.moves}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="font-semibold">Matches</div>
              <div className="text-2xl font-bold text-green-600">
                {gameStats.matches}/{selectedMode?.pairs}
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="font-semibold">Perfect Matches</div>
              <div className="text-2xl font-bold text-purple-600">{gameStats.perfectMatches}</div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="font-semibold">Time</div>
              <div className="text-2xl font-bold text-yellow-600">{formatTime(gameStats.timeElapsed)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={(gameStats.matches / (selectedMode?.pairs || 1)) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Completion: {Math.round((gameStats.matches / (selectedMode?.pairs || 1)) * 100)}%
            </p>
          </div>

          {selectedMode && (
            <Badge className={getDifficultyColor(selectedMode.difficulty)}>{selectedMode.name} Mode</Badge>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button onClick={resetGame} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Game
          </Button>
          {selectedMode && (
            <Button onClick={() => initializeGame(selectedMode)}>
              <Trophy className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {selectedMode && <Badge className={getDifficultyColor(selectedMode.difficulty)}>{selectedMode.name}</Badge>}
            {gameStats.streak > 0 && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <Zap className="h-3 w-3 mr-1" />
                {gameStats.streak}x streak
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="font-mono">{gameStats.moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${timeLeft <= 30 ? "text-red-500 font-bold" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        <Progress value={(gameStats.matches / (selectedMode?.pairs || 1)) * 100} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Matches: {gameStats.matches}/{selectedMode?.pairs} • Score: {gameStats.score}
        </p>
      </CardHeader>
      <CardContent>
        <div
          className={`grid gap-2 ${selectedMode?.pairs === 6 ? "grid-cols-4" : selectedMode?.pairs === 8 ? "grid-cols-4" : "grid-cols-6"}`}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center text-2xl rounded-md cursor-pointer transition-all duration-300 transform ${
                card.flipped || card.matched
                  ? "bg-emerald-100 dark:bg-emerald-900/30 rotate-y-0 border-2 border-emerald-200 dark:border-emerald-800"
                  : "bg-emerald-600 dark:bg-emerald-800 rotate-y-180 hover:bg-emerald-700 dark:hover:bg-emerald-700"
              } ${card.matched ? "opacity-70 ring-2 ring-green-400" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {(card.flipped || card.matched) && card.content}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full gap-2" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Restart Game
        </Button>
      </CardFooter>
    </Card>
  )
}
