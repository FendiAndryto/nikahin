import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Header Skeleton */}
      <div>
        <div className="h-8 w-64 bg-muted rounded-md mb-2"></div>
        <div className="h-5 w-96 bg-muted rounded-md"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/40 shadow-md shadow-black/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-muted"></div>
              <div className="space-y-2">
                <div className="h-6 w-16 bg-muted rounded-md"></div>
                <div className="h-4 w-24 bg-muted rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Wedding Skeleton */}
      <Card className="overflow-hidden border-border/40 shadow-lg shadow-black/5">
        <div className="h-1.5 bg-muted" />
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-muted rounded-md"></div>
            <div className="h-4 w-32 bg-muted rounded-md"></div>
          </div>
          <div className="h-6 w-20 bg-muted rounded-full"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <div className="h-8 w-8 rounded-full bg-muted shrink-0"></div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded-md"></div>
                <div className="h-4 w-32 bg-muted rounded-md"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <div className="h-8 w-8 rounded-full bg-muted shrink-0"></div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded-md"></div>
                <div className="h-4 w-32 bg-muted rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="h-9 w-24 bg-muted rounded-md"></div>
            <div className="h-9 w-24 bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
