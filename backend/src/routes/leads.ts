import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { qualifyLead } from "../services/qualification.service";

const router = Router();
const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Deserialize the JSON-stringified needs array from SQLite */
function parseNeeds(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

/** Shape a DB lead+analysis row into the API response format */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatLead(lead: any) {
  return {
    ...lead,
    analysis: lead.analysis
      ? { ...lead.analysis, needs: parseNeeds(lead.analysis.needs) }
      : null,
  };
}

// ─── GET /api/leads/stats ────────────────────────────────────────────────────
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [total, qualified, hot] = await Promise.all([
      prisma.lead.count(),
      prisma.leadAnalysis.count({
        where: { priority: { in: ["hot", "warm"] } },
      }),
      prisma.leadAnalysis.count({ where: { priority: "hot" } }),
    ]);
    res.json({ total, qualified, hot });
  } catch (err) {
    console.error("[GET /stats]", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ─── GET /api/leads ──────────────────────────────────────────────────────────
router.get("/", async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { analysis: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(leads.map(formatLead));
  } catch (err) {
    console.error("[GET /leads]", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// ─── GET /api/leads/:id ──────────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { analysis: true },
    });
    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }
    res.json(formatLead(lead));
  } catch (err) {
    console.error("[GET /leads/:id]", err);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
});

// ─── POST /api/leads ─────────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  const { name, company, email, website, message } = req.body as {
    name?: string;
    company?: string;
    email?: string;
    website?: string;
    message?: string;
  };

  // Validate required fields
  if (!name || !company || !email || !message) {
    res.status(400).json({ error: "name, company, email, and message are required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        company: company.trim(),
        email: email.trim().toLowerCase(),
        website: website?.trim() || null,
        message: message.trim(),
        status: "new",
      },
    });

    // Run qualification pipeline
    try {
      await qualifyLead(lead.id);
    } catch (qualifyErr) {
      console.error("[POST /leads] Qualification error:", qualifyErr);
      // Lead is still saved even if qualification encountered an issue
    }

    const updatedLead = await prisma.lead.findUnique({
      where: { id: lead.id },
      include: { analysis: true },
    });

    res.status(201).json(formatLead(updatedLead || lead));
  } catch (err) {
    console.error("[POST /leads]", err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

export default router;
