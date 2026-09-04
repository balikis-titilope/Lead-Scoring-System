import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing
  await prisma.notification.deleteMany();
  await prisma.leadAnalysis.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // Create sample user
  await prisma.user.create({
    data: {
      email: "admin@leadscore.ai",
      name: "Admin User",
    },
  });

  // Seed sample leads + analyses
  const l1 = await prisma.lead.create({
    data: {
      name: "Sarah Johnson",
      company: "Acme Software",
      email: "sarah@acmesoftware.com",
      website: "https://acmesoftware.com",
      message:
        "We're currently using spreadsheets to manage our sales pipeline. We're looking for a CRM for a 15-person sales team and would like to know about your enterprise plan.",
      status: "analyzed",
      createdAt: new Date("2026-08-29T10:00:00Z"),
      analysis: {
        create: {
          score: 92,
          priority: "hot",
          intent: "high",
          companyType: "SaaS",
          teamSize: "10–25",
          needs: JSON.stringify(["CRM", "Sales pipeline management", "Enterprise plan"]),
          summary:
            "Qualified prospect evaluating CRM solutions for a growing sales team. High purchase intent with clear pain point.",
          createdAt: new Date("2026-08-29T10:01:00Z"),
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      leadId: l1.id,
      type: "hot_lead",
      message: "Hot lead detected — score 92/100",
      createdAt: new Date("2026-08-29T10:01:00Z"),
    },
  });

  await prisma.lead.create({
    data: {
      name: "Marcus Lee",
      company: "Brightline Retail",
      email: "marcus@brightline.com",
      message:
        "We run a small boutique with 3 staff. Just want something simple to track our regulars.",
      status: "analyzed",
      createdAt: new Date("2026-08-29T12:30:00Z"),
      analysis: {
        create: {
          score: 28,
          priority: "cold",
          intent: "low",
          companyType: "Retail",
          teamSize: "1–5",
          needs: JSON.stringify(["Simple contact tracking"]),
          summary:
            "Small retail business with minimal needs. Low budget signals and small team size indicate low conversion likelihood.",
          createdAt: new Date("2026-08-29T12:31:00Z"),
        },
      },
    },
  });

  const l3 = await prisma.lead.create({
    data: {
      name: "Priya Patel",
      company: "Nexus Health",
      email: "priya@nexushealth.io",
      website: "https://nexushealth.io",
      message:
        "We're a 60-person healthcare SaaS company currently evaluating CRM vendors. We need HIPAA compliance, deep API integrations, and custom reporting. Looking to decide within 30 days.",
      status: "analyzed",
      createdAt: new Date("2026-08-30T08:00:00Z"),
      analysis: {
        create: {
          score: 97,
          priority: "hot",
          intent: "high",
          companyType: "Healthcare SaaS",
          teamSize: "50–100",
          needs: JSON.stringify([
            "HIPAA compliance",
            "API integrations",
            "Custom reporting",
            "Enterprise CRM",
          ]),
          summary:
            "High-value enterprise prospect with urgent timeline, compliance requirements, and clear evaluation criteria. Top priority.",
          createdAt: new Date("2026-08-30T08:01:00Z"),
        },
      },
    },
  });

  await prisma.notification.create({
    data: {
      leadId: l3.id,
      type: "hot_lead",
      message: "Hot lead detected — score 97/100",
      createdAt: new Date("2026-08-30T08:01:00Z"),
    },
  });

  await prisma.lead.create({
    data: {
      name: "Tom Rivera",
      company: "Freelance Design",
      email: "tom@tomrivera.me",
      message: "Just me, doing freelance design work. Wondering if you have a free tier.",
      status: "analyzed",
      createdAt: new Date("2026-08-30T09:15:00Z"),
      analysis: {
        create: {
          score: 12,
          priority: "cold",
          intent: "low",
          companyType: "Freelance",
          teamSize: "1",
          needs: JSON.stringify(["Free tier"]),
          summary: "Solo freelancer seeking a free product. Not a viable commercial lead.",
          createdAt: new Date("2026-08-30T09:16:00Z"),
        },
      },
    },
  });

  await prisma.lead.create({
    data: {
      name: "Elena Chen",
      company: "Vertex Logistics",
      email: "echen@vertexlogistics.com",
      website: "https://vertexlogistics.com",
      message:
        "Our ops team of 25 is struggling with tracking customer relationships across multiple warehouses. We need a scalable solution with mobile support.",
      status: "analyzed",
      createdAt: new Date("2026-08-30T10:00:00Z"),
      analysis: {
        create: {
          score: 74,
          priority: "warm",
          intent: "medium",
          companyType: "Logistics",
          teamSize: "25–50",
          needs: JSON.stringify(["Scalable CRM", "Mobile support", "Multi-location management"]),
          summary:
            "Mid-market logistics company with real operational pain points. Good fit but no clear urgency or timeline yet.",
          createdAt: new Date("2026-08-30T10:01:00Z"),
        },
      },
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
