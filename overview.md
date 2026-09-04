# Project 2 — AI Lead Qualification & Automation

## What this is
A small full-stack system where a business receives a new lead and AI automatically analyzes, scores, and qualifies it — turning unstructured lead messages into structured data the application can act on (score, priority, intent, needs), then triggering a simple automation (notification + activity log) when a lead qualifies as "hot."

This is the second of two portfolio projects. See `AGENT.md` for the exact technical contract (schema, architecture, UI rules) that implementation must follow.

## Why it exists
Project 1 demonstrates: *"I can integrate AI into an application and build RAG-powered assistants."*

Project 2 demonstrates something different and more valuable: *"I can take AI output and wire it into an actual business workflow."*

The key distinction being proven technically:

```
LLM → structured data → application logic     (what we're building)
LLM → text → display text                      (what most AI demos do)
```

Together, the two projects position the portfolio as: AI integration + backend/API design + RAG + automation + frontend — not "three variations of a chatbot."

## The core example
A lead comes in:

> Name: Sarah Johnson
> Company: Acme Software
> Message: "We're currently using spreadsheets to manage our sales pipeline. We're looking for a CRM for a 15-person sales team and would like to know about your enterprise plan."

The system produces:
- Lead Score: 92/100
- Intent: High
- Priority: Hot
- Company Type: SaaS
- Team Size: 10–25
- Estimated Need: CRM / sales management
- Summary: "Qualified prospect evaluating CRM solutions for a growing sales team."

That structured result then drives: dashboard stats, a lead-detail view, and (because score > 80) an automated hot-lead notification — all without a human touching the data.

## Scope

**In scope**
- Lead submission form
- AI analysis producing strict structured JSON (not prose)
- Backend-computed priority logic (score-based thresholds)
- Persistence in PostgreSQL via Prisma
- A dashboard, a lead-detail/analysis view, and an activity feed showing the automation firing
- Simulated notifications (in-app only)

**Explicitly out of scope**
- Real email/Slack/webhook integrations (can be added *later*, not in this build)
- Authentication/login flows
- Deal pipelines, contact history, or any other CRM feature
- More than 4 screens

The guiding rule for the whole build: **keep it small, don't turn this into a CRM.**

## Stack
Next.js + TypeScript + Tailwind + shadcn/ui (frontend) · Node.js + Express (backend) · PostgreSQL + Prisma (database) · OpenAI API with structured outputs (AI).

Deliberately the same stack as Project 1, so a client sees `React/Next.js + Node.js + OpenAI + PostgreSQL` repeated across multiple real applications — reinforcing the positioning rather than looking like one-off experiments.

## The 4 screens
1. **Lead Dashboard** — the hero screenshot: total/qualified/hot lead counts, recent leads with scores
2. **Lead Analysis** — the technical proof: full AI qualification breakdown for a single lead
3. **Lead Submission** — the input form, with an "Analyzing with AI..." loading state
4. **Activity** — shows the automation working: qualified events, scores, notification triggers

## Build phases
1. Form + dashboard UI (no backend)
2. Node.js backend + PostgreSQL
3. OpenAI connected, structured qualification working
4. Scoring/priority business logic
5. Notification/activity automation
6. UI polish
7. Deploy + screenshots + short demo

Then stop.
