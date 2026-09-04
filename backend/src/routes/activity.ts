import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// ─── GET /api/activity ───────────────────────────────────────────────────────
// Returns a unified activity feed: notifications (hot_lead) + all analyzed leads,
// sorted by most recent first.
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [notifications, analyses] = await Promise.all([
      prisma.notification.findMany({
        include: {
          lead: {
            include: {
              analysis: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.leadAnalysis.findMany({
        include: { lead: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Map notifications (score > 80 automated trigger events)
    const notifEvents = notifications.map((n) => ({
      id: `notif-${n.id}`,
      type: n.type as "hot_lead",
      leadId: n.leadId,
      leadName: n.lead.name,
      company: n.lead.company,
      score: n.lead.analysis?.score ?? null,
      priority: "hot" as const,
      message: n.message,
      createdAt: n.createdAt.toISOString(),
    }));

    // Map analyses (qualification events)
    const analysisEvents = analyses.map((a) => ({
      id: `analysis-${a.id}`,
      type: "analyzed" as const,
      leadId: a.leadId,
      leadName: a.lead.name,
      company: a.lead.company,
      score: a.score,
      priority: a.priority as "hot" | "warm" | "cold",
      message: `Lead analyzed — score ${a.score}/100 (${a.priority.toUpperCase()})`,
      createdAt: a.createdAt.toISOString(),
    }));

    // Merge and sort by createdAt desc
    const feed = [...notifEvents, ...analysisEvents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(feed);
  } catch (err) {
    console.error("[GET /activity]", err);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

export default router;
