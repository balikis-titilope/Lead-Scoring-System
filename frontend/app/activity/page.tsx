import Link from "next/link";
import { Flame, CheckCircle2, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/priority-badge";
import { getActivity, type ActivityEvent } from "@/lib/api";

export const dynamic = "force-dynamic";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function ActivityPage() {
  let feed: ActivityEvent[] = [];
  try {
    feed = await getActivity();
  } catch (err) {
    console.error(err);
  }

  const hotCount = feed.filter((e) => e.type === "hot_lead").length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
              Automated events triggered by AI lead qualification
            </p>
          </div>
        </div>

        {hotCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold self-start sm:self-auto shadow-sm">
            <Flame className="h-3.5 w-3.5" />
            <span>{hotCount} Hot Lead Alerts</span>
          </div>
        )}
      </div>

      <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Recent Automation Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {feed.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm">No activity recorded yet.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Activity events will appear here once leads are analyzed or qualified.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline vertical bar */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-0">
                {feed.map((event) => (
                  <div key={event.id} className="relative flex gap-3 sm:gap-4 py-4">
                    {/* Event icon dot */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                        event.type === "hot_lead"
                          ? "bg-red-50 dark:bg-red-500/20 border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {event.type === "hot_lead" ? (
                        <Flame className="h-3.5 w-3.5" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {event.type === "hot_lead"
                                ? "🔥 Hot Lead Alert"
                                : "✅ Lead Analyzed"}
                            </p>
                            {event.type === "hot_lead" && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                Automation Fired
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            <Link
                              href={`/leads/${event.leadId}`}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                            >
                              {event.leadName}
                            </Link>{" "}
                            · <span className="text-gray-700 dark:text-gray-300 font-medium">{event.company}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 mt-1 sm:mt-0 self-start">
                          {event.priority && <PriorityBadge priority={event.priority} />}
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(event.createdAt)}</span>
                        </div>
                      </div>

                      {event.type === "hot_lead" && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-2 font-medium">
                          <Zap className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span>Notification created — score {event.score ?? ">80"}/100 exceeds qualification threshold (80)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
