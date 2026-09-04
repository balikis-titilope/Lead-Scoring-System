import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Notification Service — Phase 5
 *
 * Trigger: score > 80 (matches the "hot" threshold per AGENT.md)
 * v1 notifications are simulated: an in-app `notifications` row + Activity feed entry.
 * Per AGENT.md: No email, Slack, or webhook integrations in this build.
 */
export async function createHotLeadNotification(
  leadId: string,
  score: number
): Promise<void> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) return;

  const notif = await prisma.notification.create({
    data: {
      leadId,
      type: "hot_lead",
      message: `Hot lead detected (${lead.name} · ${lead.company}) — score ${score}/100 exceeds qualification threshold (80).`,
    },
  });

  console.log(`[Notification] Created hot_lead notification id=${notif.id} for lead=${lead.name} (Score: ${score})`);
}

export { prisma };
