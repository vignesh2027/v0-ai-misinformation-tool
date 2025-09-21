import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Header } from "@/components/header"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Welcome back, {profile?.display_name || "User"}!
            </h1>
            <p className="text-xl text-slate-600 text-pretty max-w-3xl mx-auto leading-relaxed">
              Track your progress and view comprehensive insights into your misinformation detection skills
            </p>
          </div>

          <AnalyticsDashboard user={data.user} profile={profile} />
        </div>
      </main>
    </div>
  )
}
