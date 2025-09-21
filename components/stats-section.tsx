"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Shield, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      value: "10,000+",
      label: "Texts Analyzed",
      description: "Misinformation detected and prevented",
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      value: "5,000+",
      label: "Students Helped",
      description: "Learning digital literacy skills",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      value: "95%",
      label: "Accuracy Rate",
      description: "AI-powered fact-checking precision",
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      value: "1,200+",
      label: "Quizzes Completed",
      description: "Interactive learning sessions",
    },
  ]

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Making a Difference</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
          Join thousands of students in the fight against misinformation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">{stat.icon}</div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-lg font-semibold text-slate-700">{stat.label}</div>
                <div className="text-sm text-slate-500 text-pretty">{stat.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
