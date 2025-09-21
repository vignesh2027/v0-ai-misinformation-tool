import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "TruthGuard - AI-Powered Misinformation Detection Tool",
  description:
    "Combat misinformation with advanced AI analysis. Get instant credibility scores, learn through interactive quizzes, and become a digital literacy expert.",
  generator: "v0.app",
  keywords: "misinformation, fact-checking, AI, education, digital literacy, students, truth detection, fake news",
  authors: [{ name: "TruthGuard Team" }],
  creator: "TruthGuard",
  publisher: "TruthGuard",
  openGraph: {
    title: "TruthGuard - AI-Powered Misinformation Detection",
    description: "Combat misinformation with advanced AI analysis and interactive learning.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TruthGuard - AI-Powered Misinformation Detection",
    description: "Combat misinformation with advanced AI analysis and interactive learning.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <meta
          name="description"
          content="AI-powered tool for students to detect misinformation and improve digital literacy through interactive fact-checking and gamified learning."
        />
        <meta name="keywords" content="misinformation, fact-checking, AI, education, digital literacy, students" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
        <Suspense fallback={null}>
          <Toaster />
          {children}
        </Suspense>
      </body>
    </html>
  )
}
