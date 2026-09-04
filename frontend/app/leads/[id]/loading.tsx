import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LeadDetailLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <Skeleton className="h-4 w-32 bg-gray-700 mb-4" />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 bg-gray-700" />
            <Skeleton className="h-4 w-32 bg-gray-700/60" />
          </div>
          <Skeleton className="h-10 w-28 bg-gray-700" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-20 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full bg-gray-700/50" />
              <Skeleton className="h-10 w-full bg-gray-700/50" />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2 space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full bg-gray-700/50" />
            </CardContent>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-28 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full bg-gray-700/50" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
