"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "How many chapters (Surahs) are there in the Quran?",
    options: ["99", "114", "120", "144"],
    correctAnswer: 1,
  },
  {
    id: 2,
    text: "Which Surah is known as the heart of the Quran?",
    options: ["Al-Fatiha", "Ya-Sin", "Al-Ikhlas", "Al-Baqarah"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "Which prophet is mentioned the most in the Quran?",
    options: ["Ibrahim (Abraham)", "Musa (Moses)", "Isa (Jesus)", "Muhammad"],
    correctAnswer: 1,
  },
  {
    id: 4,
    text: "Which is the longest Surah in the Quran?",
    options: ["Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa"],
    correctAnswer: 1,
  },
  {
    id: 5,
    text: "How many verses are in Surah Al-Fatiha?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
]

export function IslamicQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = () => {
    // Check if answer is correct
    const correct = selectedOption === quizQuestions[currentQuestion].correctAnswer
    if (correct) {
      setScore(score + 1)
    }

    setIsCorrect(correct)
    setShowResult(true)

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      setShowResult(false)
      setSelectedOption(null)

      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setIsCorrect(null)
    setQuizCompleted(false)
  }

  const currentQuizQuestion = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Islamic Knowledge Quiz</CardTitle>
        <CardDescription>Test your knowledge of the Holy Quran and Islam</CardDescription>
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="mt-1 text-xs text-right text-muted-foreground">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{currentQuizQuestion.text}</h3>

              <RadioGroup value={selectedOption?.toString()} className="space-y-3">
                {currentQuizQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 rounded-md border p-3 ${
                      showResult && index === currentQuizQuestion.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : showResult && index === selectedOption && index !== currentQuizQuestion.correctAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : ""
                    }`}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      onClick={() => handleOptionSelect(index)}
                      disabled={showResult}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {showResult && index === currentQuizQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showResult && index === selectedOption && index !== currentQuizQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {showResult && (
              <div
                className={`p-3 rounded-md mb-4 ${isCorrect ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}
              >
                {isCorrect ? "Correct answer!" : "Incorrect answer!"}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
            <p className="text-lg mb-4">
              Your score: {score} out of {quizQuestions.length}
            </p>
            <div className="mb-6">
              {score === quizQuestions.length ? (
                <p className="text-green-600 dark:text-green-400">Excellent! Perfect score!</p>
              ) : score >= quizQuestions.length * 0.7 ? (
                <p className="text-emerald-600 dark:text-emerald-400">
                  Great job! You know your Islamic knowledge well!
                </p>
              ) : score >= quizQuestions.length * 0.5 ? (
                <p className="text-amber-600 dark:text-amber-400">Good effort! Keep learning!</p>
              ) : (
                <p className="text-orange-600 dark:text-orange-400">Keep studying! You'll improve!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!quizCompleted ? (
          <Button
            onClick={handleNextQuestion}
            disabled={selectedOption === null || showResult}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        ) : (
          <Button onClick={resetQuiz} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
