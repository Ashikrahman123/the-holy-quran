"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RefreshCw, Check, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface WordPuzzle {
  original: string
  scrambled: string
  hint: string
  category: string
}

const wordPuzzles: WordPuzzle[] = [
  {
    original: "RAMADAN",
    scrambled: "MARANAD",
    hint: "The holy month of fasting",
    category: "Islamic Months",
  },
  {
    original: "SALAH",
    scrambled: "LASAH",
    hint: "The ritual prayer performed five times daily",
    category: "Pillars of Islam",
  },
  {
    original: "QURAN",
    scrambled: "RANQU",
    hint: "The holy book of Islam",
    category: "Islamic Texts",
  },
  {
    original: "HAJJ",
    scrambled: "JJHA",
    hint: "The pilgrimage to Mecca",
    category: "Pillars of Islam",
  },
  {
    original: "ZAKAT",
    scrambled: "TAKAZ",
    hint: "Obligatory charity given to the poor",
    category: "Pillars of Islam",
  },
]

export function WordScramble() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(true)

  useEffect(() => {
    if (!gameActive || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleCheckAnswer(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, currentPuzzle, showResult])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value.toUpperCase())
  }

  const handleCheckAnswer = (timeUp = false) => {
    const correct = userAnswer.toUpperCase() === wordPuzzles[currentPuzzle].original

    if (correct) {
      setScore(score + 1)
    }

    setIsCorrect(correct)
    setShowResult(true)
    setGameActive(false)

    // Move to next puzzle after 2 seconds
    setTimeout(() => {
      setShowResult(false)
      setUserAnswer("")

      if (currentPuzzle < wordPuzzles.length - 1) {
        setCurrentPuzzle(currentPuzzle + 1)
        setTimeLeft(30)
        setGameActive(true)
      } else {
        setGameCompleted(true)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentPuzzle(0)
    setUserAnswer("")
    setScore(0)
    setShowResult(false)
    setIsCorrect(null)
    setGameCompleted(false)
    setTimeLeft(30)
    setGameActive(true)
  }

  const currentWord = wordPuzzles[currentPuzzle]
  const progress = ((currentPuzzle + 1) / wordPuzzles.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Islamic Word Scramble</CardTitle>
        <CardDescription>Unscramble the Islamic terms</CardDescription>
      </CardHeader>
      <CardContent>
        {!gameCompleted ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">
                  Puzzle {currentPuzzle + 1} of {wordPuzzles.length}
                </span>
                <span className={`text-xs font-medium ${timeLeft < 10 ? "text-red-500" : "text-muted-foreground"}`}>
                  Time: {timeLeft}s
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="mb-6">
              <div className="text-center mb-6">
                <span className="text-2xl font-bold tracking-widest">{currentWord.scrambled.split("").join(" ")}</span>
                <p className="mt-2 text-sm text-muted-foreground">Category: {currentWord.category}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">Hint: {currentWord.hint}</p>
                <Input
                  type="text"
                  placeholder="Type your answer here"
                  value={userAnswer}
                  onChange={handleInputChange}
                  className="text-center uppercase"
                  disabled={showResult}
                  autoComplete="off"
                />
              </div>
            </div>

            {showResult && (
              <div
                className={`p-3 rounded-md mb-4 text-center ${isCorrect ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}
              >
                {isCorrect ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>Correct! The answer is {currentWord.original}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <X className="h-5 w-5" />
                    <span>Incorrect! The answer is {currentWord.original}</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-2">Game Completed!</h3>
            <p className="text-lg mb-4">
              Your score: {score} out of {wordPuzzles.length}
            </p>
            <div className="mb-6">
              {score === wordPuzzles.length ? (
                <p className="text-green-600 dark:text-green-400">Perfect! You're a master of Islamic terms!</p>
              ) : score >= wordPuzzles.length * 0.7 ? (
                <p className="text-emerald-600 dark:text-emerald-400">Great job! You know your Islamic terms well!</p>
              ) : score >= wordPuzzles.length * 0.5 ? (
                <p className="text-amber-600 dark:text-amber-400">Good effort! Keep learning!</p>
              ) : (
                <p className="text-orange-600 dark:text-orange-400">Keep studying! You'll improve!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!gameCompleted ? (
          <Button
            onClick={() => handleCheckAnswer()}
            disabled={userAnswer.length === 0 || showResult}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Check Answer
          </Button>
        ) : (
          <Button onClick={resetGame} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Play Again
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
