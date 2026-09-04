import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-gray-700" />
          <Skeleton className="h-4 w-64 bg-gray-700/60" />
        </div>
        <Skeleton className="h-9 w-28 bg-gray-700" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-12 bg-gray-700 mb-2" />
              <Skeleton className="h-3 w-32 bg-gray-700/60" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-32 bg-gray-700" />
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full bg-gray-700/50" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
