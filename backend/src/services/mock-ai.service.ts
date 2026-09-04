import { AIAnalysisResult } from "./ai-analysis.service";

/**
 * Isolated mock AI service for local development / test environments when
 * OPENAI_API_KEY is not configured.
 *
 * Per AGENT.md Rule 5:
 * "If a local-dev mock is needed, isolate it in a clearly named mock-ai.service.ts.
 * Never hand-write 'realistic-looking' fake AI output inside real application logic."
 */
export async function mockAnalyzeLead(lead: {
  name: string;
  company: string;
  message: string;
  website?: string | null;
}): Promise<AIAnalysisResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = lead.message.toLowerCase();
  const company = lead.company.toLowerCase();

  // Heuristic analysis based on message contents
  const hasEnterpriseSignals =
    text.includes("enterprise") ||
    text.includes("hipaa") ||
    text.includes("compliance") ||
    text.includes("integration") ||
    text.includes("security") ||
    text.includes("50") ||
    text.includes("100") ||
    text.includes("sales team") ||
    text.includes("crm");

  const hasUrgencySignals =
    text.includes("immediately") ||
    text.includes("asap") ||
    text.includes("30 days") ||
    text.includes("urgent") ||
    text.includes("ready to buy") ||
    text.includes("evaluating");

  const isFreelanceOrSolo =
    text.includes("freelance") ||
    text.includes("just me") ||
    text.includes("free tier") ||
    text.includes("free") ||
    text.includes("student") ||
    text.includes("hobby");

  let score = 50;
  let intent: "high" | "medium" | "low" = "medium";
  let priority: "hot" | "warm" | "cold" = "warm";
  let companyType = "Technology";
  let teamSize = "10–50";
  const needs: string[] = [];

  if (isFreelanceOrSolo) {
    score = Math.floor(Math.random() * 25) + 10; // 10-35
    intent = "low";
    priority = "cold";
    companyType = "Solo / Freelance";
    teamSize = "1";
    needs.push("Free plan", "Basic features");
  } else if (hasEnterpriseSignals && hasUrgencySignals) {
    score = Math.floor(Math.random() * 15) + 85; // 85-99
    intent = "high";
    priority = "hot";
    companyType = company.includes("health")
      ? "Healthcare Technology"
      : company.includes("saas") || company.includes("cloud")
      ? "Enterprise SaaS"
      : "Mid-Market Corporate";
    teamSize = text.includes("100") ? "100–500" : "25–100";
    needs.push("Enterprise CRM", "Security & Compliance", "API Integration", "Dedicated Support");
  } else if (hasEnterpriseSignals || hasUrgencySignals) {
    score = Math.floor(Math.random() * 20) + 65; // 65-84
    intent = score > 80 ? "high" : "medium";
    priority = score > 80 ? "hot" : "warm";
    companyType = "Growing Business";
    teamSize = "10–50";
    needs.push("Sales Pipeline Management", "Team Collaboration");
  } else {
    score = Math.floor(Math.random() * 25) + 40; // 40-64
    intent = "medium";
    priority = score >= 50 ? "warm" : "cold";
    companyType = "Small Business";
    teamSize = "1–10";
    needs.push("Contact Tracking", "Email Integration");
  }

  const summary = `${lead.company} (${companyType}) prospect looking for ${needs.slice(0, 2).join(" & ")}. Intent level is ${intent}.`.slice(0, 200);

  return {
    score,
    priority,
    intent,
    companyType,
    teamSize,
    needs,
    summary,
  };
}
