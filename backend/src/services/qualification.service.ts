import { PrismaClient } from "@prisma/client";
import { analyzeLeadWithAI } from "./ai-analysis.service";
import { createHotLeadNotification } from "./notification.service";

const prisma = new PrismaClient();

export type Priority = "hot" | "warm" | "cold";

/**
 * Backend-computed priority from score.
 * Per AGENT.md: score > 80 = hot, 50–80 = warm, < 50 = cold.
 * The AI model's priority field is advisory only — this backend calculation is the source of truth.
 */
export function computePriority(score: number): Priority {
  if (score > 80) return "hot";
  if (score >= 50) return "warm";
  return "cold";
}

/**
 * Orchestrates the full AI qualification workflow for a given lead:
 * 1. Mark status = "analyzing"
 * 2. Invoke AI analysis (OpenAI structured output or isolated mock fallback)
 * 3. Validate output and recompute authoritative priority from score
 * 4. Persist analysis to SQLite (JSON-encoding needs array)
 * 5. Update lead status to "analyzed" (or "failed")
 * 6. Trigger notification if qualified as hot (score > 80)
 */
export async function qualifyLead(leadId: string): Promise<void> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error(`Lead with id ${leadId} not found`);
  }

  // 1. Mark status as analyzing
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "analyzing" },
  });

  try {
    // 2. Run structured AI analysis
    const analysisResult = await analyzeLeadWithAI({
      name: lead.name,
      company: lead.company,
      message: lead.message,
      website: lead.website,
    });

    // 3. Compute authoritative priority from score
    const computedPriority = computePriority(analysisResult.score);

    // 4. Save analysis to database (upsert to handle re-analysis if ever needed)
    await prisma.leadAnalysis.upsert({
      where: { leadId },
      create: {
        leadId,
        score: analysisResult.score,
        priority: computedPriority,
        intent: analysisResult.intent,
        companyType: analysisResult.companyType,
        teamSize: analysisResult.teamSize,
        needs: JSON.stringify(analysisResult.needs),
        summary: analysisResult.summary,
      },
      update: {
        score: analysisResult.score,
        priority: computedPriority,
        intent: analysisResult.intent,
        companyType: analysisResult.companyType,
        teamSize: analysisResult.teamSize,
        needs: JSON.stringify(analysisResult.needs),
        summary: analysisResult.summary,
      },
    });

    // 5. Update lead status to analyzed
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "analyzed" },
    });

    // 6. Trigger hot lead notification if score > 80 (Phase 4/5 integration)
    if (analysisResult.score > 80) {
      await createHotLeadNotification(leadId, analysisResult.score);
    }
  } catch (err) {
    console.error(`[Qualification] Qualification failed for lead ${leadId}:`, err);
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "failed" },
    });
    throw err;
  }
}

export { prisma };
