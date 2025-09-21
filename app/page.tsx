import { MisinformationChecker } from "@/components/misinformation-checker"
import { QuizSection } from "@/components/quiz-section"
import { StatsSection } from "@/components/stats-section"
import { EnhancedFeatures } from "@/components/enhanced-features"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              AI-Powered Truth Detector
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 text-pretty max-w-3xl mx-auto leading-relaxed">
              Combat misinformation with advanced AI analysis. Get instant credibility scores, learn through interactive
              quizzes, and become a digital literacy expert.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Gamified Learning</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Trusted Sources</span>
            </div>
          </div>
        </section>

        {/* Main Checker Section */}
        <MisinformationChecker />

        {/* Enhanced Features Section */}
        <EnhancedFeatures />

        {/* Stats Section */}
        <StatsSection />

        {/* Quiz Section */}
        <QuizSection />
      </main>
    </div>
  )
}
