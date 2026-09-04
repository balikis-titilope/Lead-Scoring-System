// MOCK DATA — Phase 1 only. Remove when backend is live (Phase 2+).

export type Priority = "hot" | "warm" | "cold";
export type Intent = "high" | "medium" | "low";
export type LeadStatus = "new" | "analyzing" | "analyzed";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  website?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadAnalysis {
  id: string;
  leadId: string;
  score: number;
  priority: Priority;
  intent: Intent;
  companyType: string;
  teamSize: string;
  needs: string[];
  summary: string;
  createdAt: string;
}

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "Acme Software",
    email: "sarah@acmesoftware.com",
    website: "https://acmesoftware.com",
    message:
      "We're currently using spreadsheets to manage our sales pipeline. We're looking for a CRM for a 15-person sales team and would like to know about your enterprise plan.",
    status: "analyzed",
    createdAt: "2026-08-29T10:00:00Z",
  },
  {
    id: "2",
    name: "Marcus Lee",
    company: "Brightline Retail",
    email: "marcus@brightline.com",
    message:
      "We run a small boutique with 3 staff. Just want something simple to track our regulars.",
    status: "analyzed",
    createdAt: "2026-08-29T12:30:00Z",
  },
  {
    id: "3",
    name: "Priya Patel",
    company: "Nexus Health",
    email: "priya@nexushealth.io",
    website: "https://nexushealth.io",
    message:
      "We're a 60-person healthcare SaaS company currently evaluating CRM vendors. We need HIPAA compliance, deep API integrations, and custom reporting. Looking to decide within 30 days.",
    status: "analyzed",
    createdAt: "2026-08-30T08:00:00Z",
  },
  {
    id: "4",
    name: "Tom Rivera",
    company: "Freelance Design",
    email: "tom@tomrivera.me",
    message: "Just me, doing freelance design work. Wondering if you have a free tier.",
    status: "analyzed",
    createdAt: "2026-08-30T09:15:00Z",
  },
  {
    id: "5",
    name: "Elena Chen",
    company: "Vertex Logistics",
    email: "echen@vertexlogistics.com",
    website: "https://vertexlogistics.com",
    message:
      "Our ops team of 25 is struggling with tracking customer relationships across multiple warehouses. We need a scalable solution with mobile support.",
    status: "analyzed",
    createdAt: "2026-08-30T10:00:00Z",
  },
];

export const mockAnalyses: LeadAnalysis[] = [
  {
    id: "a1",
    leadId: "1",
    score: 92,
    priority: "hot",
    intent: "high",
    companyType: "SaaS",
    teamSize: "10–25",
    needs: ["CRM", "Sales pipeline management", "Enterprise plan"],
    summary:
      "Qualified prospect evaluating CRM solutions for a growing sales team. High purchase intent with clear pain point.",
    createdAt: "2026-08-29T10:01:00Z",
  },
  {
    id: "a2",
    leadId: "2",
    score: 28,
    priority: "cold",
    intent: "low",
    companyType: "Retail",
    teamSize: "1–5",
    needs: ["Simple contact tracking"],
    summary:
      "Small retail business with minimal needs. Low budget signals and small team size indicate low conversion likelihood.",
    createdAt: "2026-08-29T12:31:00Z",
  },
  {
    id: "a3",
    leadId: "3",
    score: 97,
    priority: "hot",
    intent: "high",
    companyType: "Healthcare SaaS",
    teamSize: "50–100",
    needs: ["HIPAA compliance", "API integrations", "Custom reporting", "Enterprise CRM"],
    summary:
      "High-value enterprise prospect with urgent timeline, compliance requirements, and clear evaluation criteria. Top priority.",
    createdAt: "2026-08-30T08:01:00Z",
  },
  {
    id: "a4",
    leadId: "4",
    score: 12,
    priority: "cold",
    intent: "low",
    companyType: "Freelance",
    teamSize: "1",
    needs: ["Free tier"],
    summary: "Solo freelancer seeking a free product. Not a viable commercial lead.",
    createdAt: "2026-08-30T09:16:00Z",
  },
  {
    id: "a5",
    leadId: "5",
    score: 74,
    priority: "warm",
    intent: "medium",
    companyType: "Logistics",
    teamSize: "25–50",
    needs: ["Scalable CRM", "Mobile support", "Multi-location management"],
    summary:
      "Mid-market logistics company with real operational pain points. Good fit but no clear urgency or timeline yet.",
    createdAt: "2026-08-30T10:01:00Z",
  },
];

/** Derive stats from mock data */
export function getMockStats() {
  const total = mockLeads.length;
  const qualified = mockAnalyses.filter((a) => a.priority !== "cold").length;
  const hot = mockAnalyses.filter((a) => a.priority === "hot").length;
  return { total, qualified, hot };
}

/** Join lead + analysis by leadId */
export function getMockLeadsWithAnalysis() {
  return mockLeads.map((lead) => ({
    ...lead,
    analysis: mockAnalyses.find((a) => a.leadId === lead.id) ?? null,
  }));
}

/** Get a single lead+analysis by id */
export function getMockLeadById(id: string) {
  const lead = mockLeads.find((l) => l.id === id) ?? null;
  const analysis = mockAnalyses.find((a) => a.leadId === id) ?? null;
  return { lead, analysis };
}

export const mockActivity = [
  {
    id: "act1",
    type: "hot_lead",
    leadId: "3",
    leadName: "Priya Patel",
    company: "Nexus Health",
    score: 97,
    priority: "hot" as Priority,
    message: "Hot lead detected — score 97/100",
    createdAt: "2026-08-30T08:01:00Z",
  },
  {
    id: "act2",
    type: "analyzed",
    leadId: "5",
    leadName: "Elena Chen",
    company: "Vertex Logistics",
    score: 74,
    priority: "warm" as Priority,
    message: "Lead analyzed — score 74/100",
    createdAt: "2026-08-30T10:01:00Z",
  },
  {
    id: "act3",
    type: "hot_lead",
    leadId: "1",
    leadName: "Sarah Johnson",
    company: "Acme Software",
    score: 92,
    priority: "hot" as Priority,
    message: "Hot lead detected — score 92/100",
    createdAt: "2026-08-29T10:01:00Z",
  },
  {
    id: "act4",
    type: "analyzed",
    leadId: "2",
    leadName: "Marcus Lee",
    company: "Brightline Retail",
    score: 28,
    priority: "cold" as Priority,
    message: "Lead analyzed — score 28/100",
    createdAt: "2026-08-29T12:31:00Z",
  },
  {
    id: "act5",
    type: "analyzed",
    leadId: "4",
    leadName: "Tom Rivera",
    company: "Freelance Design",
    score: 12,
    priority: "cold" as Priority,
    message: "Lead analyzed — score 12/100",
    createdAt: "2026-08-30T09:16:00Z",
  },
];
