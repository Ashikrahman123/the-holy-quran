"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import confetti from "canvas-confetti"

interface MemoryCard {
  id: number
  content: string
  flipped: boolean
  matched: boolean
}

const islamicSymbols = [
  "🕋", // Kaaba
  "🕌", // Mosque
  "📿", // Prayer Beads
  "☪️", // Star and Crescent
  "🌙", // Crescent Moon
  "📖", // Book (Quran)
  "🌟", // Star
  "🤲", // Hands in Prayer
]

export function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(0)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameCompleted])

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === islamicSymbols.length && gameStarted) {
      setGameCompleted(true)
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
  }, [matchedPairs, gameStarted])

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards

      if (cards[firstIndex].content === cards[secondIndex].content) {
        // Match found
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex ? { ...card, matched: true } : card,
          ),
        )
        setMatchedPairs((prev) => prev + 1)
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

      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs = [...islamicSymbols, ...islamicSymbols].map((symbol, index) => ({
      id: index,
      content: symbol,
      flipped: false,
      matched: false,
    }))

    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameCompleted(false)
    setTimer(0)
  }

  const handleCardClick = (index: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Ignore click if card is already flipped or matched
    if (cards[index].flipped || cards[index].matched || flippedCards.length >= 2) {
      return
    }

    // Flip the card
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, flipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, index])
  }

  const resetGame = () => {
    initializeGame()
    setGameStarted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Islamic Memory Match</CardTitle>
        <CardDescription>Match pairs of Islamic symbols</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="text-sm">Moves: {moves}</div>
          <div className="text-sm">Time: {formatTime(timer)}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center text-2xl rounded-md cursor-pointer transition-all duration-300 transform ${
                card.flipped || card.matched
                  ? "bg-emerald-100 dark:bg-emerald-900/30 rotate-y-0"
                  : "bg-emerald-600 dark:bg-emerald-800 rotate-y-180"
              } ${card.matched ? "opacity-70" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              {(card.flipped || card.matched) && card.content}
            </div>
          ))}
        </div>

        {gameCompleted && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-md text-center">
            <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
            <p>
              You completed the game in {moves} moves and {formatTime(timer)}!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {moves <= 16 ? "Excellent memory!" : moves <= 24 ? "Good job!" : "Keep practicing!"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={resetGame} className="w-full gap-2">
          <RefreshCw className="h-4 w-4" />
          {gameCompleted ? "Play Again" : "Restart Game"}
        </Button>
      </CardFooter>
    </Card>
  )
}
