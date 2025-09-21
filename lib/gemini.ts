interface GeminiConfig {
  temperature?: number
  topK?: number
  topP?: number
  maxOutputTokens?: number
}

interface SafetySetting {
  category: string
  threshold: string
}

export class GeminiClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta"
  }

  async generateContent(prompt: string, config: GeminiConfig = {}, safetySettings: SafetySetting[] = []) {
    const defaultConfig = {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }

    const defaultSafetySettings = [
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
    ]

    const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
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
        generationConfig: { ...defaultConfig, ...config },
        safetySettings: safetySettings.length > 0 ? safetySettings : defaultSafetySettings,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API")
    }

    return data.candidates[0].content.parts[0].text
  }

  async analyzeForMisinformation(text: string) {
    const prompt = `You are an AI fact-checking assistant designed for students. 
Analyze the following text for misinformation indicators and provide educational insights.

Text: "${text}"

Provide analysis in JSON format:
{
  "credibilityScore": 0-100,
  "analysis": "Educational explanation",
  "references": "Suggested verification sources"
}`

    const response = await this.generateContent(prompt, { temperature: 0.2 })

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      // Fallback response
      return {
        credibilityScore: 50,
        analysis: response,
        references: "Please verify with trusted news sources and fact-checking websites.",
      }
    }
  }
}

export const geminiClient = new GeminiClient("AIzaSyBOfakHQZ6zRgSBIwvNRKnjhY3LwvwMyhI")
