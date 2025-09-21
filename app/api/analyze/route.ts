import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBOfakHQZ6zRgSBIwvNRKnjhY3LwvwMyhI"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const prompt = `You are an AI fact-checking assistant designed for students. 
Your job is to analyze input text and detect if it contains misinformation. 

Analyze the following text for:
1. Factual accuracy and verifiability
2. Source credibility indicators
3. Emotional manipulation tactics
4. Logical fallacies or inconsistencies
5. Missing context or cherry-picked data

Provide a credibility score (0–100) where:
- 80-100: Highly credible, well-sourced, factual
- 60-79: Moderately credible, some concerns
- 40-59: Questionable credibility, significant issues
- 20-39: Low credibility, likely misleading
- 0-19: Very low credibility, likely false

Format the output as JSON:
{
  "credibilityScore": XX,
  "analysis": "Clear, educational explanation of why this content may be trustworthy or misleading. Focus on teaching students what to look for.",
  "references": "Suggest specific types of sources or fact-checking websites students should consult to verify this information."
}

Text to analyze: "${text}"`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API")
    }

    const generatedText = data.candidates[0].content.parts[0].text

    // Try to parse JSON from the response
    let result
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // Fallback: create a structured response from the text
      result = {
        credibilityScore: 50, // Default middle score
        analysis: generatedText.replace(/```json|```/g, "").trim(),
        references:
          "Please verify this information with trusted news sources like Reuters, AP News, BBC, or fact-checking websites like Snopes, FactCheck.org, or PolitiFact.",
      }
    }

    // Ensure credibility score is within bounds
    if (typeof result.credibilityScore !== "number" || result.credibilityScore < 0 || result.credibilityScore > 100) {
      result.credibilityScore = Math.max(0, Math.min(100, Number.parseInt(String(result.credibilityScore)) || 50))
    }

    try {
      const supabase = createClient()
      const sessionId = request.headers.get("x-session-id") || "anonymous"

      await supabase.from("misinformation_checks").insert({
        session_id: sessionId,
        text_content: text.substring(0, 1000), // Limit text length for storage
        credibility_score: result.credibilityScore,
        analysis: result.analysis,
        references: result.references,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Don't fail the request if database insert fails
    }

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      model: "gemini-1.5-flash",
      textLength: text.length,
    })
  } catch (error) {
    console.error("Error analyzing text:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze text. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
