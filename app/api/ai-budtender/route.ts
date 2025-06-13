import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { products } from "@/lib/products"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), { status: 400 })
    }

    // Sanitize and format product data for the prompt
    const productCatalog = JSON.stringify(
      products.filter(p => !p.soldOut).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        effects: p.effects,
        pricing: p.pricing,
      })),
    )

    const { object } = await generateObject({
      model: google("models/gemini-1.5-flash-latest"),
      schema: z.object({
        greeting: z.string().describe("A warm, friendly greeting that acknowledges the user's request"),
        personalInsight: z.string().describe("A personal touch showing understanding of what the customer is looking for"),
        recommendations: z
          .array(
            z.object({
              productId: z.number().describe("The unique ID of the recommended product"),
              introduction: z.string().describe("A conversational way to introduce this product"),
              whyItsGreat: z.string().describe("Explain why this strain is perfect for them in a friendly, knowledgeable way"),
              personalNote: z.string().describe("A personal tip or note about enjoying this strain"),
            }),
          )
          .max(3)
          .describe("An array of 1 to 3 product recommendations"),
        closingMessage: z.string().describe("A friendly closing message inviting questions or further help"),
      }),
      prompt: `You are King Bud, the legendary AI Budtender for DankDeals.org in Minneapolis. You're known for your warm personality, deep cannabis knowledge, and ability to match people with their perfect strain. You speak like a friendly, experienced budtender who genuinely cares about helping customers find what they need.

      A customer just walked in and said: "${query}"
      
      Based on their request, have a natural conversation recommending 1-3 products from our available inventory. Be conversational, use cannabis slang naturally (but not excessively), and show that you understand what they're looking for.
      
      Available Products (only recommend from these):
      ${productCatalog}
      
      Guidelines for your response:
      - Start with a warm greeting that shows you heard their request
      - Share a personal insight that shows you understand what they're looking for
      - For each recommendation, introduce it conversationally (like "Oh, you've got to try..." or "I think you'd love...")
      - Explain why each strain is perfect for them based on their request
      - Add personal tips about enjoying each strain (best time of day, activities, etc.)
      - End with an invitation for more questions
      - Be authentic and conversational, not salesy
      - Use phrases like "in my experience", "customers tell me", "I personally enjoy this one when..."
      
      Remember: You're having a friendly conversation, not reading a product catalog.`,
    })

    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[AI Budtender API Error]", error)
    return new Response(JSON.stringify({ error: "An internal error occurred." }), { status: 500 })
  }
}
