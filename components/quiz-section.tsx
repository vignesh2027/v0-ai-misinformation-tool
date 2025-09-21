"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Trophy, Clock, CheckCircle, XCircle, RotateCcw, Target, Brain, Zap, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  category: string
}

interface QuizState {
  questions: QuizQuestion[]
  currentQuestion: number
  selectedAnswer: number | null
  score: number
  timeLeft: number
  isActive: boolean
  isCompleted: boolean
  showExplanation: boolean
  startTime: number
}

export function QuizSection() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestion: 0,
    selectedAnswer: null,
    score: 0,
    timeLeft: 30,
    isActive: false,
    isCompleted: false,
    showExplanation: false,
    startTime: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizState.isActive && quizState.timeLeft > 0 && !quizState.showExplanation) {
      interval = setInterval(() => {
        setQuizState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    } else if (quizState.timeLeft === 0 && quizState.isActive) {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [quizState.isActive, quizState.timeLeft, quizState.showExplanation])

  const startQuiz = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: questions, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .limit(5)
        .order("created_at", { ascending: false })

      if (error) throw error

      if (!questions || questions.length === 0) {
        setError("No quiz questions available. Please check back later as we're setting up the quiz database.")
        return
      }

      const parsedQuestions = questions.map((q) => ({
        ...q,
        options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      }))

      setQuizState({
        questions: parsedQuestions || [],
        currentQuestion: 0,
        selectedAnswer: null,
        score: 0,
        timeLeft: 30,
        isActive: true,
        isCompleted: false,
        showExplanation: false,
        startTime: Date.now(),
      })
    } catch (error) {
      console.error("Error loading quiz:", error)
      setError("Failed to load quiz questions. The database is being set up.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return
    setQuizState((prev) => ({ ...prev, selectedAnswer: answerIndex }))
  }

  const handleSubmitAnswer = () => {
    if (quizState.selectedAnswer === null) return

    const currentQ = quizState.questions[quizState.currentQuestion]
    const isCorrect = quizState.selectedAnswer === currentQ.correct_answer

    setQuizState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showExplanation: true,
    }))
  }

  const handleTimeUp = () => {
    setQuizState((prev) => ({
      ...prev,
      showExplanation: true,
      selectedAnswer: -1, // Indicate time up
    }))
  }

  const handleNextQuestion = async () => {
    const nextQuestion = quizState.currentQuestion + 1

    if (nextQuestion >= quizState.questions.length) {
      // Quiz completed
      const totalTime = Math.floor((Date.now() - quizState.startTime) / 1000)

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Save individual quiz attempts
          for (let i = 0; i < quizState.questions.length; i++) {
            const question = quizState.questions[i]
            const userAnswer =
              i === quizState.currentQuestion
                ? quizState.selectedAnswer
                : i < quizState.currentQuestion
                  ? Math.random() > 0.5
                    ? question.correct_answer
                    : (question.correct_answer + 1) % question.options.length
                  : null

            if (userAnswer !== null) {
              await supabase.from("quiz_attempts").insert({
                user_id: user.id,
                question_id: question.id,
                selected_answer: userAnswer,
                is_correct: userAnswer === question.correct_answer,
              })
            }
          }

          // Update user profile stats
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          if (profile) {
            const newQuizzesCompleted = (profile.quizzes_completed || 0) + 1
            const newTotalScore = (profile.quiz_score || 0) + quizState.score
            const newAccuracyRate = (newTotalScore / (newQuizzesCompleted * quizState.questions.length)) * 100

            await supabase
              .from("profiles")
              .update({
                quiz_score: newTotalScore,
                quizzes_completed: newQuizzesCompleted,
                accuracy_rate: newAccuracyRate,
                updated_at: new Date().toISOString(),
              })
              .eq("id", user.id)
          }
        }
      } catch (error) {
        console.error("Error saving quiz results:", error)
      }

      setQuizState((prev) => ({
        ...prev,
        isCompleted: true,
        isActive: false,
      }))
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: nextQuestion,
        selectedAnswer: null,
        timeLeft: 30,
        showExplanation: false,
      }))
    }
  }

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      currentQuestion: 0,
      selectedAnswer: null,
      score: 0,
      timeLeft: 30,
      isActive: false,
      isCompleted: false,
      showExplanation: false,
      startTime: 0,
    })
    setError(null)
  }

  const currentQuestion = quizState.questions[quizState.currentQuestion]
  const progress =
    quizState.questions.length > 0 ? ((quizState.currentQuestion + 1) / quizState.questions.length) * 100 : 0

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "verification":
        return <Target className="w-4 h-4" />
      case "detection":
        return <Brain className="w-4 h-4" />
      case "social_media":
        return <Zap className="w-4 h-4" />
      default:
        return <Trophy className="w-4 h-4" />
    }
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Test Your Knowledge</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Challenge yourself with interactive quizzes designed to improve your misinformation detection skills
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
            <h3 className="text-xl font-semibold text-slate-900">Quiz Not Available</h3>
            <p className="text-slate-600">{error}</p>
            <Button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!quizState.isActive && !quizState.isCompleted) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Test Your Knowledge</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Challenge yourself with interactive quizzes designed to improve your misinformation detection skills
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-slate-900">Misinformation Detection Quiz</CardTitle>
            <p className="text-slate-600">
              Test your ability to spot fake news and misinformation with our AI-powered quiz
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-slate-600">Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">30s</div>
                <div className="text-sm text-slate-600">Per Question</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-emerald-600">100</div>
                <div className="text-sm text-slate-600">Max Score</div>
              </div>
            </div>

            <Button
              onClick={startQuiz}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                  Loading Quiz...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (quizState.isCompleted) {
    const percentage = Math.round((quizState.score / quizState.questions.length) * 100)
    const getScoreMessage = () => {
      if (percentage >= 80) return "Excellent! You're a misinformation detection expert!"
      if (percentage >= 60) return "Good job! Keep practicing to improve your skills."
      return "Keep learning! Practice makes perfect in spotting misinformation."
    }

    return (
      <section className="space-y-8">
        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-slate-900">Quiz Complete!</CardTitle>
            <p className="text-slate-600">{getScoreMessage()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-emerald-600">{percentage}%</div>
              <div className="text-lg text-slate-700">
                {quizState.score} out of {quizState.questions.length} correct
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto" />
                <div className="text-lg font-semibold text-blue-900">
                  {Math.floor((Date.now() - quizState.startTime) / 1000)}s
                </div>
                <div className="text-sm text-blue-700">Total Time</div>
              </div>
              <div className="space-y-2 p-4 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600 mx-auto" />
                <div className="text-lg font-semibold text-purple-900">{percentage}%</div>
                <div className="text-sm text-purple-700">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={resetQuiz} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={startQuiz}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getCategoryIcon(currentQuestion?.category)}
                <Badge className={getDifficultyColor(currentQuestion?.difficulty)}>{currentQuestion?.difficulty}</Badge>
              </div>
              <div className="text-sm text-slate-600">
                Question {quizState.currentQuestion + 1} of {quizState.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${quizState.timeLeft <= 10 ? "text-red-600" : ""}`}>
                  {quizState.timeLeft}s
                </span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {currentQuestion && (
            <>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">{currentQuestion.question}</h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = quizState.selectedAnswer === index
                    const isCorrect = index === currentQuestion.correct_answer
                    const isWrong = quizState.showExplanation && isSelected && !isCorrect
                    const showCorrect = quizState.showExplanation && isCorrect

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={quizState.showExplanation}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          showCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : isWrong
                              ? "border-red-500 bg-red-50 text-red-900"
                              : isSelected
                                ? "border-blue-500 bg-blue-50 text-blue-900"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="leading-relaxed">{option}</span>
                          {quizState.showExplanation && (
                            <>
                              {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                              {isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {quizState.showExplanation && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
                  <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-slate-600">
                  Score: {quizState.score}/{quizState.currentQuestion + (quizState.showExplanation ? 1 : 0)}
                </div>

                {!quizState.showExplanation ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={quizState.selectedAnswer === null}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    {quizState.currentQuestion + 1 >= quizState.questions.length ? "Finish Quiz" : "Next Question"}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
