import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Globe,
  Users,
  Lightbulb,
  Target,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/priority-badge";
import { getLead } from "@/lib/api";

export const dynamic = "force-dynamic";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let lead;
  try {
    lead = await getLead(id);
  } catch {
    notFound();
  }

  if (!lead) notFound();
  const analysis = lead.analysis;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">{lead.company}</p>
          </div>
          {analysis ? (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-left sm:text-right">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{analysis.score}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">/ 100</p>
              </div>
              <PriorityBadge priority={analysis.priority} className="text-xs sm:text-sm px-3 py-1" />
            </div>
          ) : (
            <Badge variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
              {lead.status === "new" ? "Pending Analysis" : lead.status}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Lead info & signals */}
        <div className="col-span-1 space-y-4">
          <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Lead Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow icon={Building2} label="Company" value={lead.company} />
              {lead.website && (
                <InfoRow icon={Globe} label="Website" value={lead.website} />
              )}
            </CardContent>
          </Card>

          {analysis && (
            <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  AI Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <InfoRow icon={Building2} label="Company Type" value={analysis.companyType} />
                <InfoRow icon={Users} label="Team Size" value={analysis.teamSize} />
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Intent</p>
                    <Badge
                      variant="outline"
                      className={
                        analysis.intent === "high"
                          ? "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 font-semibold"
                          : analysis.intent === "medium"
                          ? "text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 font-semibold"
                          : "text-slate-700 dark:text-slate-400 border-slate-500/30 bg-slate-50 dark:bg-slate-500/10 font-semibold"
                      }
                    >
                      {analysis.intent.charAt(0).toUpperCase() + analysis.intent.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: AI breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {analysis ? (
            <>
              {/* Summary */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">AI Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.summary}</p>
                </CardContent>
              </Card>

              {/* Needs */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                  <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                    Identified Needs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {analysis.needs.map((need) => (
                      <Badge
                        key={need}
                        variant="outline"
                        className="text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 font-medium"
                      >
                        {need}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Score bar */}
              <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Lead Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>0</span>
                      <span>Cold (&lt;50)</span>
                      <span>Warm (50–80)</span>
                      <span>Hot (&gt;80)</span>
                      <span>100</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          analysis.score > 80
                            ? "bg-red-500"
                            : analysis.score >= 50
                            ? "bg-amber-500"
                            : "bg-slate-400 dark:bg-slate-500"
                        }`}
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                    <p className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                      {analysis.score}
                      <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">/100</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm font-medium">No AI analysis available yet.</p>
                <p className="text-xs mt-1">
                  This lead is currently in status &ldquo;{lead.status}&rdquo;.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Original message */}
          <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Original Message
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                &ldquo;{lead.message}&rdquo;
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(
              `Following up: ${lead.company} Inquiry`
            )}&body=${encodeURIComponent(
              `Hi ${lead.name},\n\nThank you for reaching out regarding ${lead.company}. I'd love to discuss your requirements and how we can assist.\n\nBest regards,`
            )}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-sm shadow-emerald-600/20 cursor-pointer text-sm text-center"
          >
            <Mail className="h-4 w-4" />
            Contact Lead ({lead.email})
          </a>
        </div>
      </div>
    </div>
  );
}
