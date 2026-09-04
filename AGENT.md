# AGENT.md

This file is the **authoritative technical reference** for any AI coding agent (Claude Code, Cursor, etc.) working on this repository. Do not infer architecture, schema, naming, or UI decisions beyond what's written here. If something isn't covered, stop and ask — do not invent a convention and continue.

See `overview.md` for the project narrative and goals. This file is the contract for implementation details.

---

## Stack (fixed — do not substitute or "improve")

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express (a separate service, not Next.js API routes — see Architecture)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **AI:** OpenAI API, using **structured outputs** (JSON schema / function calling). Never freeform-text-then-parse.

Do not add a state management library, a different CSS framework, GraphQL, a different ORM, or a different AI provider unless explicitly instructed.

---

## Architecture

### Data flow
```
React Form (Next.js)
     → POST /api/leads (Express)
     → AI Analysis Service (OpenAI, structured output)
     → Qualification Logic (backend-computed priority)
     → PostgreSQL (Prisma write)
     → Notification/Activity event (if score > 80)
     → Dashboard reads from DB (refetch/polling — no websockets in v1)
```

### Repo layout (do not deviate)
```
/frontend                  Next.js app
  /app
    /dashboard
    /leads/[id]
    /leads/new
    /activity
  /components
  /lib

/backend                   Express API
  /src
    /routes
    /services
      ai-analysis.service.ts
      qualification.service.ts
      notification.service.ts
    /prisma
      schema.prisma
```

**Hard rule:** the frontend never calls OpenAI directly and never holds an API key. All AI calls happen server-side in `ai-analysis.service.ts`.

---

## Database schema (authoritative — exactly 4 tables)

Do not add, rename, or remove tables without updating this file first.

**users**
- id, email, name, createdAt

**leads**
- id, name, company, email, website (nullable), message, status (`new` | `analyzing` | `analyzed`), createdAt

**lead_analyses**
- id, leadId (FK), score (int, 0–100), priority (`hot` | `warm` | `cold`), intent (`high` | `medium` | `low`), companyType (string), teamSize (string), needs (string[]), summary (text), createdAt

**notifications**
- id, leadId (FK), type (`hot_lead`), message, createdAt

### Priority thresholds (fixed business logic — not AI-decided)
- `score > 80` → hot
- `score 50–80` → warm
- `score < 50` → cold

---

## AI integration rules — read before touching `ai-analysis.service.ts`

1. Must use OpenAI **structured outputs** (JSON schema / function calling). Never prompt-and-hope-for-JSON, never regex-parse freeform text.
2. The response schema is fixed. Do not add, rename, or remove fields without updating this doc first:
   ```json
   {
     "score": 0,
     "priority": "hot | warm | cold",
     "intent": "high | medium | low",
     "companyType": "string",
     "teamSize": "string",
     "needs": ["string"],
     "summary": "string, ~200 chars max"
   }
   ```
3. The model's `priority` field is **advisory only**. The backend always recomputes priority from `score` using the thresholds above — never trust the model's priority as source of truth.
4. Validate the AI response against the schema before writing to the DB. On validation failure: retry once, then mark the lead's analysis as failed and surface an error state. Never silently write partial or guessed data.
5. If a local-dev mock is needed, isolate it in a clearly named `mock-ai.service.ts`. Never hand-write "realistic-looking" fake AI output inside real application logic.

---

## Notification / automation rules

- Trigger: `score > 80` (matches the "hot" threshold — this is not a separate rule to invent).
- v1 notifications are **simulated**: an in-app `notifications` row + an entry in the Activity feed. That's it.
- No email, Slack, or webhook integrations in this build unless explicitly requested. Do not scaffold "for later" integration code — it doesn't exist yet.

---

## UI rules

- Components: shadcn/ui + Tailwind utility classes only. No custom CSS files, no styled-components, no other UI kit.
- **Exactly 4 screens exist.** Do not add settings pages, auth flows, pipelines, deal stages, or any other CRM-like feature.

| Screen | Route | Contents |
|---|---|---|
| Lead Dashboard | `/dashboard` | Stat cards (Total Leads, Qualified, Hot) + recent leads list with score/priority badges |
| Lead Analysis | `/leads/[id]` | Full AI qualification breakdown + "Contact Lead" button (non-functional stub is fine) |
| Lead Submission | `/leads/new` | Form: Name, Company, Email, Website, Message → "Analyzing with AI..." loading state → redirect on success |
| Activity | `/activity` | Chronological feed of "Lead qualified" / "Lead analyzed" events |

- Priority badge colors (fixed — do not invent alternatives): `hot` → red, `warm` → amber/yellow, `cold` → gray/blue.
- Every data-fetching screen needs an explicit **loading state** and an explicit **error state**. No unhandled fetches, no silent failures rendered as empty screens.

---

## Hallucination guardrails — explicit "do not"s

- Do not invent API endpoints, database tables, or env vars not listed in this file.
- Do not add authentication/authorization UI beyond the bare `users` table — no login flow in v1 unless requested.
- Do not import any UI library besides shadcn/ui + Tailwind.
- Do not wire up real third-party notification services.
- Do not change the AI response schema without updating this file first.
- If a requirement is ambiguous, choose the simplest interpretation consistent with `overview.md`'s "keep it small" scope, implement that, and flag the assumption — don't silently expand scope.

---

## Build order (do not reorder or skip ahead)

1. Lead form + dashboard UI (no backend)
2. Express + PostgreSQL wired up
3. OpenAI structured qualification working end-to-end
4. Scoring/priority business logic (backend-computed, per rules above)
5. Notification/activity workflow
6. UI polish
7. Deploy + screenshots + demo

**Then stop.** Do not continue building past Phase 7 without new instructions. This is a portfolio piece, not a CRM.
