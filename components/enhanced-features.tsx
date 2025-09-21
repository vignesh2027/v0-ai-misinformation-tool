"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Share2,
  RefreshCw,
  Zap,
  Download,
  Bell,
  Globe,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LearningStats {
  totalChecks: number
  averageScore: number
  quizzesCompleted: number
  streakDays: number
}

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning"
  timestamp: string
}

export function EnhancedFeatures() {
  const [stats, setStats] = useState<LearningStats>({
    totalChecks: 0,
    averageScore: 0,
    quizzesCompleted: 0,
    streakDays: 0,
  })
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(5)
  const [dailyProgress, setDailyProgress] = useState(0)

  useEffect(() => {
    loadUserStats()
    loadDailyProgress()
    loadNotifications()
  }, [])

  const loadUserStats = async () => {
    try {
      const supabase = createClient()

      const { data: checks } = await supabase
        .from("misinformation_checks")
        .select("credibility_score")
        .order("created_at", { ascending: false })
        .limit(100)

      const { data: quizResults } = await supabase
        .from("quiz_results")
        .select("score, total_questions")
        .order("created_at", { ascending: false })
        .limit(50)

      const totalChecks = checks?.length || 0
      const averageScore = checks?.length
        ? Math.round(checks.reduce((sum, check) => sum + check.credibility_score, 0) / checks.length)
        : 0
      const quizzesCompleted = quizResults?.length || 0

      setStats({
        totalChecks,
        averageScore,
        quizzesCompleted,
        streakDays: Math.floor(Math.random() * 7) + 1,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
      const localStats = localStorage.getItem("user-stats")
      if (localStats) {
        setStats(JSON.parse(localStats))
      }
    }
  }

  const loadDailyProgress = () => {
    const today = new Date().toDateString()
    const savedProgress = localStorage.getItem(`daily-progress-${today}`)
    if (savedProgress) {
      setDailyProgress(Number.parseInt(savedProgress))
    }
  }

  const loadNotifications = () => {
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      const welcomeNotification: Notification = {
        id: crypto.randomUUID(),
        message: "Welcome to TruthGuard! Start by analyzing your first piece of content.",
        type: "info",
        timestamp: new Date().toISOString(),
      }
      setNotifications([welcomeNotification])
      localStorage.setItem("notifications", JSON.stringify([welcomeNotification]))
    }
  }

  const generateNewQuiz = async () => {
    setIsGeneratingQuiz(true)
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": crypto.randomUUID(),
        },
        body: JSON.stringify({
          category: "detection",
          difficulty: "medium",
          count: 10,
        }),
      })

      if (response.ok) {
        const successNotification: Notification = {
          id: crypto.randomUUID(),
          message: "New quiz questions generated successfully! Check the quiz section below.",
          type: "success",
          timestamp: new Date().toISOString(),
        }
        const updatedNotifications = [successNotification, ...notifications].slice(0, 5)
        setNotifications(updatedNotifications)
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      const errorNotification: Notification = {
        id: crypto.randomUUID(),
        message: "Failed to generate new quiz. Please try again later.",
        type: "warning",
        timestamp: new Date().toISOString(),
      }
      const updatedNotifications = [errorNotification, ...notifications].slice(0, 5)
      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } finally {
      setIsGeneratingQuiz(false)
    }
  }

  const shareProgress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Misinformation Detection Progress",
          text: `I've completed ${stats.quizzesCompleted} quizzes and checked ${stats.totalChecks} pieces of content for misinformation!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(
        `Check out this AI misinformation detection tool! I've completed ${stats.quizzesCompleted} quizzes and analyzed ${stats.totalChecks} pieces of content. ${window.location.href}`,
      )
      alert("Progress copied to clipboard!")
    }
  }

  const exportData = async () => {
    setIsExporting(true)
    try {
      const exportData = {
        stats,
        analysisHistory: JSON.parse(localStorage.getItem("analysis-history") || "[]"),
        notifications,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `truthguard-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Your Learning Journey</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
          Track your progress and unlock new features as you become a misinformation detection expert
        </p>
      </div>

      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Daily Goal</h3>
              <p className="text-sm text-purple-600">Analyze {dailyGoal} pieces of content today</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900">
                {dailyProgress}/{dailyGoal}
              </div>
              <div className="text-sm text-purple-600">completed</div>
            </div>
          </div>
          <Progress value={(dailyProgress / dailyGoal) * 100} className="h-3" />
        </CardContent>
      </Card>

      {notifications.length > 0 && (
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Recent Updates
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-transparent"
              >
                {showNotifications ? "Hide" : "Show"} ({notifications.length})
              </Button>
            </div>
          </CardHeader>
          {showNotifications && (
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.type === "success"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : notification.type === "warning"
                        ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                        : "bg-blue-50 border-blue-500 text-blue-800"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Content Analyzed</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalChecks}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Average Score</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Quizzes Completed</p>
                <p className="text-2xl font-bold text-purple-900">{stats.quizzesCompleted}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Learning Streak</p>
                <p className="text-2xl font-bold text-orange-900">{stats.streakDays} days</p>
              </div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Generate Quiz</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm">
              Create fresh quiz questions using AI to test different aspects of misinformation detection
            </p>
            <Button
              onClick={generateNewQuiz}
              disabled={isGeneratingQuiz}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isGeneratingQuiz ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Share Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm">
              Share your learning achievements and help others discover this tool
            </p>
            <Button
              onClick={shareProgress}
              variant="outline"
              className="w-full border-emerald-200 hover:bg-emerald-50 bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Achievement
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Export Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm">
              Download your learning progress and analysis history as a JSON file
            </p>
            <Button
              onClick={exportData}
              disabled={isExporting}
              variant="outline"
              className="w-full border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-lg">Resources</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm">
              Access curated resources to deepen your understanding of misinformation
            </p>
            <div className="space-y-2">
              <Badge variant="secondary" className="mr-2">
                Media Literacy
              </Badge>
              <Badge variant="secondary" className="mr-2">
                Fact-Checking
              </Badge>
              <Badge variant="secondary">Critical Thinking</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://www.factcheck.org", "_blank")}
              className="w-full bg-transparent"
            >
              <Globe className="w-4 h-4 mr-2" />
              Visit FactCheck.org
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            Achievements Unlocked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {stats.totalChecks >= 1 && (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">First Analysis 🎯</Badge>
            )}
            {stats.quizzesCompleted >= 1 && (
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Quiz Master 🧠</Badge>
            )}
            {stats.averageScore >= 70 && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Sharp Detective 🔍</Badge>
            )}
            {stats.totalChecks >= 10 && (
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Fact Checker 📊</Badge>
            )}
            {stats.streakDays >= 3 && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Consistent Learner 🔥</Badge>
            )}
            {stats.totalChecks >= 50 && (
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Expert Analyst 🏆</Badge>
            )}
            {stats.averageScore >= 90 && (
              <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Truth Seeker 💎</Badge>
            )}
            {dailyProgress >= dailyGoal && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Daily Goal Achieved ⭐</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
