"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, AlertTriangle, CheckCircle, Brain, Target, Clock, RefreshCw, Trophy, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AnalyticsData {
  totalChecks: number
  totalQuizzes: number
  averageCredibility: number
  recentActivity: any[]
  credibilityDistribution: any[]
  quizPerformance: any[]
  categoryBreakdown: any[]
  timeSeriesData: any[]
}

interface AnalyticsDashboardProps {
  user: any
  profile: any
}

export function AnalyticsDashboard({ user, profile }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Fetch user's analysis history
      const { data: analysisHistory } = await supabase
        .from("analysis_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100)

      // Fetch user's quiz attempts
      const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("*, quiz_questions(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100)

      // Process data for analytics
      const totalChecks = analysisHistory?.length || 0
      const totalQuizzes = quizAttempts?.length || 0
      const averageCredibility = analysisHistory?.length
        ? Math.round(analysisHistory.reduce((sum, check) => sum + check.credibility_score, 0) / analysisHistory.length)
        : 0

      // Credibility distribution
      const credibilityRanges = [
        { name: "High (80-100)", value: 0, color: "#10b981" },
        { name: "Medium (60-79)", value: 0, color: "#f59e0b" },
        { name: "Low (0-59)", value: 0, color: "#ef4444" },
      ]

      analysisHistory?.forEach((check) => {
        if (check.credibility_score >= 80) credibilityRanges[0].value++
        else if (check.credibility_score >= 60) credibilityRanges[1].value++
        else credibilityRanges[2].value++
      })

      // Quiz performance over time
      const quizPerformance =
        quizAttempts?.reduce((acc: any[], attempt) => {
          const existingQuiz = acc.find((q) => q.date === attempt.created_at.split("T")[0])
          if (existingQuiz) {
            existingQuiz.correct += attempt.is_correct ? 1 : 0
            existingQuiz.total += 1
          } else {
            acc.push({
              date: attempt.created_at.split("T")[0],
              correct: attempt.is_correct ? 1 : 0,
              total: 1,
              score: 0,
            })
          }
          return acc
        }, []) || []

      // Calculate scores
      quizPerformance.forEach((quiz) => {
        quiz.score = Math.round((quiz.correct / quiz.total) * 100)
      })

      // Category breakdown based on quiz questions
      const categoryBreakdown =
        quizAttempts?.reduce((acc: any[], attempt) => {
          const category = attempt.quiz_questions?.category || "Other"
          const existing = acc.find((c) => c.category === category)
          if (existing) {
            existing.attempts += 1
            existing.correct += attempt.is_correct ? 1 : 0
          } else {
            acc.push({
              category,
              attempts: 1,
              correct: attempt.is_correct ? 1 : 0,
              avgScore: 0,
            })
          }
          return acc
        }, []) || []

      // Calculate average scores
      categoryBreakdown.forEach((cat) => {
        cat.avgScore = Math.round((cat.correct / cat.attempts) * 100)
      })

      // Time series data (last 7 days)
      const timeSeriesData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dateStr = date.toISOString().split("T")[0]

        const dayChecks = analysisHistory?.filter((check) => check.created_at.startsWith(dateStr)).length || 0

        const dayQuizzes = quizAttempts?.filter((attempt) => attempt.created_at.startsWith(dateStr)).length || 0

        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          checks: dayChecks,
          quizzes: dayQuizzes,
        }
      })

      setData({
        totalChecks,
        totalQuizzes,
        averageCredibility,
        recentActivity: [...(analysisHistory?.slice(0, 5) || []), ...(quizAttempts?.slice(0, 5) || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
        credibilityDistribution: credibilityRanges,
        quizPerformance: quizPerformance.slice(-10),
        categoryBreakdown,
        timeSeriesData,
      })

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [user.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading your analytics...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          No data available. Start using the misinformation checker and taking quizzes to see your analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{profile?.display_name || "User"}</h3>
                <p className="text-slate-600">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-semibold text-slate-900">
                  {profile?.accuracy_rate ? `${profile.accuracy_rate.toFixed(1)}%` : "0%"} Accuracy
                </span>
              </div>
              <p className="text-sm text-slate-600">{profile?.quizzes_completed || 0} quizzes completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        <Button onClick={loadAnalytics} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Articles Analyzed</p>
                <p className="text-3xl font-bold text-slate-900">{data.totalChecks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-slate-500">Personal progress</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Quiz Questions</p>
                <p className="text-3xl font-bold text-slate-900">{data.totalQuizzes}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-slate-500">Questions answered</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Credibility</p>
                <p className="text-3xl font-bold text-slate-900">{data.averageCredibility}%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-slate-500">Of analyzed content</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Quiz Accuracy</p>
                <p className="text-3xl font-bold text-slate-900">
                  {profile?.accuracy_rate ? `${profile.accuracy_rate.toFixed(0)}%` : "0%"}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-slate-500">Overall performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credibility">Credibility</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Activity Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="checks" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="quizzes" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Quiz Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credibility" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Your Credibility Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.credibilityDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.credibilityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle>Analysis Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.credibilityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge variant="secondary">{item.value} articles</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Your Quiz Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.quizPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Your Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {activity.credibility_score !== undefined ? (
                          <AlertTriangle className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Brain className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {activity.credibility_score !== undefined ? "Article Analyzed" : "Quiz Question"}
                        </p>
                        <p className="text-sm text-slate-600">
                          {activity.credibility_score !== undefined
                            ? `Credibility: ${activity.credibility_score}/100`
                            : `${activity.is_correct ? "Correct" : "Incorrect"} answer`}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">{new Date(activity.created_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
