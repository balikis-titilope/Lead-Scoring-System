// Typed API client for the Express backend.
// All data-fetching goes through this module — never call fetch() directly in pages.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// ─── Types (mirror AGENT.md schema) ─────────────────────────────────────────

export type Priority = "hot" | "warm" | "cold";
export type Intent = "high" | "medium" | "low";
export type LeadStatus = "new" | "analyzing" | "analyzed";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  website?: string | null;
  message: string;
  status: LeadStatus;
  createdAt: string;
  analysis: LeadAnalysis | null;
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

export interface LeadStats {
  total: number;
  qualified: number;
  hot: number;
}

export interface ActivityEvent {
  id: string;
  type: "hot_lead" | "analyzed";
  leadId: string;
  leadName: string;
  company: string;
  score: number | null;
  priority: Priority;
  message: string;
  createdAt: string;
}

export interface CreateLeadInput {
  name: string;
  company: string;
  email: string;
  website?: string;
  message: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    // Disable Next.js caching — these are live data reads
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export async function getLeads(): Promise<Lead[]> {
  return apiFetch<Lead[]>("/api/leads");
}

export async function getLead(id: string): Promise<Lead> {
  return apiFetch<Lead>(`/api/leads/${id}`);
}

export async function getLeadStats(): Promise<LeadStats> {
  return apiFetch<LeadStats>("/api/leads/stats");
}

export async function getActivity(): Promise<ActivityEvent[]> {
  return apiFetch<ActivityEvent[]>("/api/activity");
}

export async function createLead(
  input: CreateLeadInput
): Promise<{ id: string; status: string }> {
  return apiFetch<{ id: string; status: string }>("/api/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
