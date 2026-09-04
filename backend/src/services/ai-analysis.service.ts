import OpenAI from "openai";
import { z } from "zod";
import { mockAnalyzeLead } from "./mock-ai.service";

// ─── Zod Schema for Structured Output Validation ─────────────────────────────

export const AIAnalysisSchema = z.object({
  score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Lead qualification score from 0 to 100 based on fit, budget, and urgency"),
  priority: z
    .enum(["hot", "warm", "cold"])
    .describe("Advisory priority level (hot: >80, warm: 50-80, cold: <50)"),
  intent: z
    .enum(["high", "medium", "low"])
    .describe("Purchase and adoption intent level"),
  companyType: z
    .string()
    .describe("Inferred industry or company category, e.g. SaaS, Healthcare, Retail"),
  teamSize: z
    .string()
    .describe("Estimated or stated team/company size, e.g. 1-5, 10-25, 50-100"),
  needs: z
    .array(z.string())
    .describe("List of identified customer requirements and pain points"),
  summary: z
    .string()
    .max(250)
    .describe("Concise executive summary of lead qualification under 200-250 characters"),
});

export type AIAnalysisResult = z.infer<typeof AIAnalysisSchema>;

// OpenAI JSON Schema representation for Structured Outputs
const ResponseJsonSchema = {
  name: "lead_qualification_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      score: {
        type: "integer",
        description: "Lead score between 0 and 100",
      },
      priority: {
        type: "string",
        enum: ["hot", "warm", "cold"],
        description: "Advisory priority level",
      },
      intent: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "Purchase intent level",
      },
      companyType: {
        type: "string",
        description: "Industry or company category",
      },
      teamSize: {
        type: "string",
        description: "Estimated team size",
      },
      needs: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Identified pain points or product needs",
      },
      summary: {
        type: "string",
        description: "Short summary under 200 characters",
      },
    },
    required: ["score", "priority", "intent", "companyType", "teamSize", "needs", "summary"],
    additionalProperties: false,
  },
};

const SYSTEM_PROMPT = `You are an expert B2B sales development AI. Your job is to analyze inbound lead submissions and produce a strict structured qualification output.

Evaluation Guidelines:
- Score (0-100):
  - > 80 (Hot): Clear budget/team authority, urgent timeline (<30-60 days), clear enterprise or immediate need, explicit team size >= 10-15.
  - 50-80 (Warm): Good fit, viable commercial lead, exploring options, moderate team size or less defined timeline.
  - < 50 (Cold): Solo/freelancers looking for free tiers, students, vague inquiries, no commercial fit.
- Intent: 'high', 'medium', or 'low'.
- CompanyType: Inferred company classification (e.g., 'SaaS', 'Healthcare SaaS', 'Retail', 'Logistics').
- TeamSize: Range or count inferred from message (e.g., '10–25', '25–50', '50–100', '1').
- Needs: Array of specific functional/business needs mentioned or implied.
- Summary: Crisp assessment under 200 characters.`;

/**
 * Executes structured analysis via OpenAI with automatic retry on validation failure.
 * Falls back to isolated mock-ai.service if no API key is provided.
 */
export async function analyzeLeadWithAI(lead: {
  name: string;
  company: string;
  message: string;
  website?: string | null;
}): Promise<AIAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  // If no OpenAI API key or set to placeholder/mock, use the isolated mock service
  if (!apiKey || apiKey.startsWith("mock") || apiKey === "your-api-key-here") {
    console.log("[AI-Analysis] Using isolated mock AI service (no valid OPENAI_API_KEY configured)");
    return mockAnalyzeLead(lead);
  }

  const openai = new OpenAI({ apiKey });

  const userPrompt = `Inbound Lead Details:
- Name: ${lead.name}
- Company: ${lead.company}
- Website: ${lead.website || "N/A"}
- Message: "${lead.message}"

Analyze this lead and return the structured qualification data.`;

  // Function for calling OpenAI with structured output format
  async function callOpenAI(): Promise<AIAnalysisResult> {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: ResponseJsonSchema,
      },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI API");
    }

    const parsedJson = JSON.parse(content);
    // Validate against strict Zod schema
    return AIAnalysisSchema.parse(parsedJson);
  }

  // Retry once on failure per AGENT.md Rule 4
  try {
    return await callOpenAI();
  } catch (firstError) {
    console.warn("[AI-Analysis] First attempt failed or invalid output, retrying once...", firstError);
    try {
      return await callOpenAI();
    } catch (retryError) {
      console.error("[AI-Analysis] Second attempt failed to validate against schema:", retryError);
      throw new Error(`AI Analysis failed schema validation: ${retryError instanceof Error ? retryError.message : String(retryError)}`);
    }
  }
}
