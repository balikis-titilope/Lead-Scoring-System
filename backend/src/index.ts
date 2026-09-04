import "dotenv/config";
import express from "express";
import cors from "cors";
import leadsRouter from "./routes/leads";
import activityRouter from "./routes/activity";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/leads", leadsRouter);
app.use("/api/activity", activityRouter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

export default app;
