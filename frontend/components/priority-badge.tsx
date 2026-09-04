import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const config: Record<Priority, { label: string; className: string }> = {
  hot: {
    label: "Hot",
    className: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 font-semibold",
  },
  warm: {
    label: "Warm",
    className: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 font-semibold",
  },
  cold: {
    label: "Cold",
    className: "bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30 font-semibold",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, className: colorClass } = config[priority];
  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      {label}
    </Badge>
  );
}
