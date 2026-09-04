import Link from "next/link";
import { Users, CheckCircle2, Flame, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/priority-badge";
import { getLeads, getLeadStats } from "@/lib/api";

export const dynamic = "force-dynamic";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  accent,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  accent: string;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score > 80 ? "bg-red-500" : score >= 50 ? "bg-amber-500" : "bg-slate-400 dark:bg-slate-500";
  return (
    <div className="flex items-center gap-2 w-20 sm:w-24">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-6 text-right">{score}</span>
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, leads] = await Promise.all([getLeadStats(), getLeads()]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Lead Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
            AI-analyzed leads and qualification status
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-600/20 w-full sm:w-auto"
        >
          Add Lead
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
          description="All submitted leads"
          accent="bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Qualified"
          value={stats.qualified}
          icon={CheckCircle2}
          description="Hot or warm priority"
          accent="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Hot Leads"
          value={stats.hot}
          icon={Flame}
          description="Score above 80"
          accent="bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Recent leads table */}
      <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
          <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leads.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No leads yet.</p>
              <Link
                href="/leads/new"
                className="inline-block mt-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              >
                Submit your first lead →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 sm:px-6 py-3">
                      Lead
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 sm:px-4 py-3">
                      Company
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 sm:px-4 py-3">
                      Score
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 sm:px-4 py-3">
                      Priority
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 sm:px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 sm:px-4 py-3 hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{lead.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-none">{lead.email}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-gray-700 dark:text-gray-300 font-medium">{lead.company}</td>
                      <td className="px-3 sm:px-4 py-4">
                        {lead.analysis ? (
                          <ScoreBar score={lead.analysis.score} />
                        ) : (
                          <span className="text-gray-400 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        {lead.analysis ? (
                          <PriorityBadge priority={lead.analysis.priority} />
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            lead.status === "analyzed"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : lead.status === "analyzing"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-gray-500 dark:text-gray-400 text-xs hidden sm:table-cell">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-3 sm:px-4 py-4 text-right">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium text-xs transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
