"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Brain, Target, Users, CheckCircle, ArrowRight, Play, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = [
  {
    id: 1,
    title: "Learn the Basics",
    description: "Understand how misinformation spreads and learn detection techniques",
    icon: BookOpen,
    color: "from-blue-600 to-indigo-600",
    features: [
      "Identify common misinformation patterns",
      "Learn source verification techniques",
      "Understand emotional manipulation tactics",
    ],
  },
  {
    id: 2,
    title: "Practice with AI",
    description: "Use our AI-powered tool to analyze real-world examples",
    icon: Brain,
    color: "from-purple-600 to-pink-600",
    features: [
      "Analyze news articles and social media posts",
      "Get instant credibility scores",
      "Learn from detailed AI explanations",
    ],
  },
  {
    id: 3,
    title: "Test Your Skills",
    description: "Take interactive quizzes to measure your progress",
    icon: Target,
    color: "from-emerald-600 to-green-600",
    features: ["Timed quiz challenges", "Track your accuracy over time", "Earn achievements and badges"],
  },
  {
    id: 4,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed analytics",
    icon: BarChart3,
    color: "from-orange-600 to-red-600",
    features: ["Personal dashboard with stats", "Progress tracking over time", "Compare with other learners"],
  },
]

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const handleStartJourney = () => {
    router.push("/auth/sign-up")
  }

  const handleTryDemo = () => {
    router.push("/#checker")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Start Your Journey to Digital Literacy
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 text-pretty max-w-3xl mx-auto leading-relaxed">
            Learn to identify misinformation, verify sources, and become a critical thinker in the digital age.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={handleStartJourney}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Button>
            <Button
              onClick={handleTryDemo}
              variant="outline"
              className="px-8 py-3 text-lg border-2 border-slate-300 hover:border-slate-400 bg-transparent"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
          </div>
        </div>

        {/* Learning Path */}
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Your Learning Path</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow our structured approach to master misinformation detection
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm font-medium text-slate-700">{currentStep}/4 Steps</span>
            </div>
            <Progress value={(currentStep / 4) * 100} className="h-3" />
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <Card
                  key={step.id}
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "ring-2 ring-blue-500 shadow-xl scale-105"
                      : isCompleted
                        ? "bg-emerald-50 border-emerald-200"
                        : "hover:shadow-lg hover:scale-102"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-slate-900">{step.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            Step {step.id}
                          </Badge>
                        </div>
                      </div>
                      {isCompleted && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Section */}
          <div className="text-center space-y-8 pt-12">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Ready to Begin?</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Join thousands of learners who are building critical thinking skills and fighting misinformation.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-sm text-slate-600">Active Learners</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-slate-600">Accuracy Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">24/7</div>
                    <div className="text-sm text-slate-600">AI Support</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleStartJourney}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Start Learning Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href="/auth/login">
                    <Button variant="outline" className="px-8 py-3 w-full sm:w-auto bg-transparent">
                      Already have an account?
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
