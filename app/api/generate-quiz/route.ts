import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBOfakHQZ6zRgSBIwvNRKnjhY3LwvwMyhI"

export async function POST(request: NextRequest) {
  try {
    const { category = "general", difficulty = "medium", count = 5 } = await request.json()

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const prompt = `Generate ${count} multiple-choice quiz questions about misinformation detection and digital literacy.

Category: ${category}
Difficulty: ${difficulty}

Each question should:
1. Test practical skills for identifying misinformation
2. Be educational and age-appropriate for students
3. Include 4 answer options with only one correct answer
4. Have a clear explanation for why the correct answer is right

Format as JSON array:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Educational explanation of the correct answer",
    "difficulty": "${difficulty}",
    "category": "${category}"
  }
]

Focus on practical scenarios students might encounter on social media, news websites, or in everyday digital interactions.`

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Failed to generate quiz questions")
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    // Try to parse JSON from the response
    let questions
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON array found in response")
      }
    } catch (parseError) {
      // Fallback to empty array if parsing fails
      questions = []
    }

    try {
      const supabase = createClient()
      const sessionId = request.headers.get("x-session-id") || "anonymous"

      for (const question of questions) {
        await supabase.from("quiz_questions").insert({
          question: question.question,
          options: question.options,
          correct_answer: question.correct_answer,
          explanation: question.explanation,
          difficulty: question.difficulty,
          category: question.category,
          session_id: sessionId,
        })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Don't fail the request if database insert fails
    }

    return NextResponse.json({
      questions,
      generated_at: new Date().toISOString(),
      model: "gemini-1.5-flash",
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 })
  }
}
