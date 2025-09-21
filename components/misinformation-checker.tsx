"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  Share2,
  BookOpen,
  Lightbulb,
  History,
  Zap,
} from "lucide-react"

interface AnalysisResult {
  credibilityScore: number
  analysis: string
  references: string
  timestamp?: string
  model?: string
  textLength?: number
}

interface AnalysisHistory {
  id: string
  text: string
  score: number
  timestamp: string
}

export function MisinformationChecker() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>("")
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    setSessionId(crypto.randomUUID())
    loadAnalysisHistory()
  }, [])

  const loadAnalysisHistory = () => {
    try {
      const saved = localStorage.getItem("analysis-history")
      if (saved) {
        setAnalysisHistory(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading history:", error)
    }
  }

  const saveToHistory = (text: string, score: number) => {
    const newEntry: AnalysisHistory = {
      id: crypto.randomUUID(),
      text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
      score,
      timestamp: new Date().toISOString(),
    }

    const updated = [newEntry, ...analysisHistory].slice(0, 10)
    setAnalysisHistory(updated)
    localStorage.setItem("analysis-history", JSON.stringify(updated))
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysisProgress(0)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze text")
      }

      const analysisResult = await response.json()
      setResult(analysisResult)
      saveToHistory(text.trim(), analysisResult.credibilityScore)
      setAnalysisProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setTimeout(() => setAnalysisProgress(0), 1000)
    }
  }

  const copyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareAnalysis = async () => {
    if (!result) return

    const shareText = `I analyzed this text for misinformation and got a credibility score of ${result.credibilityScore}/100. Check it out with TruthGuard AI!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Misinformation Analysis Result",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const sampleTexts = [
    "Scientists have discovered that drinking 8 glasses of water daily is essential for health.",
    "Breaking: Local man discovers doctors hate this one weird trick to lose weight instantly!",
    "According to a peer-reviewed study published in Nature, climate change is accelerating faster than previously predicted.",
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-emerald-600" />
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Highly Credible"
    if (score >= 60) return "Moderately Credible"
    return "Low Credibility"
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Check for Misinformation</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
          Paste any text, article, or claim below and get an instant AI-powered credibility analysis
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Search className="w-5 h-5" />
              Text Analysis
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="bg-transparent">
              <History className="w-4 h-4 mr-2" />
              History ({analysisHistory.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {showHistory && analysisHistory.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Recent Analyses</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {analysisHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-slate-50"
                    onClick={() => setText(item.text.replace("...", ""))}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{item.text}</p>
                      <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                    <Badge
                      className={`ml-2 ${getScoreColor(item.score).replace("text-", "bg-").replace("-600", "-100")} ${getScoreColor(item.score).replace("-600", "-800")}`}
                    >
                      {item.score}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Try these examples:
            </h4>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(sample)}
                  className="text-xs bg-transparent hover:bg-blue-50 border-blue-200"
                >
                  Example {index + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Paste the text, article, or claim you want to fact-check here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 text-base leading-relaxed resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Analyzing content...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-500">{text.length} characters</p>
                {text.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {text.length > 1000 ? "Long" : text.length > 500 ? "Medium" : "Short"} text
                  </Badge>
                )}
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Text
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">Analysis Failed</p>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <Button
                onClick={handleAnalyze}
                variant="outline"
                size="sm"
                className="mt-3 border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
              >
                Try Again
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getScoreIcon(result.credibilityScore)}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Credibility Score</h3>
                    <p className="text-sm text-slate-600">{getScoreLabel(result.credibilityScore)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(result.credibilityScore)}`}>
                    {result.credibilityScore}
                  </div>
                  <div className="text-sm text-slate-500">out of 100</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      result.credibilityScore >= 80
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : result.credibilityScore >= 60
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                    style={{ width: `${result.credibilityScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Analysis
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.analysis)}
                    className="bg-transparent"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-slate-700 leading-relaxed bg-white/60 p-4 rounded-lg">{result.analysis}</p>
              </div>

              {result.references && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Suggested References
                  </h4>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed">{result.references}</p>
                  </div>
                </div>
              )}

              {(result.timestamp || result.model || result.textLength) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Analysis Details
                  </h4>
                  <div className="bg-white/60 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {result.model && (
                      <div>
                        <span className="font-medium text-slate-600">Model:</span>
                        <span className="ml-2 text-slate-800">{result.model}</span>
                      </div>
                    )}
                    {result.textLength && (
                      <div>
                        <span className="font-medium text-slate-600">Text Length:</span>
                        <span className="ml-2 text-slate-800">{result.textLength} chars</span>
                      </div>
                    )}
                    {result.timestamp && (
                      <div>
                        <span className="font-medium text-slate-600">Analyzed:</span>
                        <span className="ml-2 text-slate-800">{new Date(result.timestamp).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    AI Analyzed
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Fact-Checked
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Source Verified
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={shareAnalysis} className="bg-transparent">
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.snopes.com", "_blank")}
                    className="bg-transparent"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
