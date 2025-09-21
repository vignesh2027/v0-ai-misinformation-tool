"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Brain, Target, BarChart3, User, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-white/20 bg-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">TruthGuard</h2>
              <p className="text-sm text-slate-600">AI Misinformation Detector</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                <Brain className="w-4 h-4 mr-2" />
                Checker
              </Button>
            </Link>
            <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
              <Target className="w-4 h-4 mr-2" />
              Quiz
            </Button>
            {user && (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            )}

            {loading ? (
              <div className="w-24 h-10 bg-slate-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <User className="w-4 h-4" />
                    {user.email?.split("@")[0] || "User"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/get-started">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
