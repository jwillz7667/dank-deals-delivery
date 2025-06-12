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
      products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        effects: p.effects,
      })),
    )

    const { object } = await generateObject({
      model: google("models/gemini-1.5-flash-latest"),
      schema: z.object({
        recommendations: z
          .array(
            z.object({
              productId: z.number().describe("The unique ID of the recommended product."),
              reason: z.string().describe("A brief, compelling reason why this product matches the user's query."),
            }),
          )
          .max(3)
          .describe("An array of 1 to 3 product recommendations."),
      }),
      prompt: `You are an expert AI Budtender for DankDeals.org, a cannabis gifting service in Minneapolis. Your tone is friendly, knowledgeable, and helpful.
      A user is looking for a specific experience. Their request is: "${query}".
      
      Based on their request, analyze the following product catalog and recommend 1 to 3 products that are the best fit.
      For each recommendation, provide a concise, one-sentence reason explaining *why* it's a good match for the user's request.
      
      Product Catalog (JSON format):
      ${productCatalog}
      
      CRITICAL: You must respond ONLY with the valid JSON object containing the recommendations. Do not include any other text, markdown, or explanations outside of the JSON structure.`,
    })

    return new Response(JSON.stringify(object), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[AI Budtender API Error]", error)
    return new Response(JSON.stringify({ error: "An internal error occurred." }), { status: 500 })
  }
}
