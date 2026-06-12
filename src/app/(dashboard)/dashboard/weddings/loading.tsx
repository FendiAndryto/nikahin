import { Card, CardContent } from "@/components/ui/card";

export default function WeddingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-muted rounded-md"></div>
      </div>

      {/* Wedding Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-border/40 shadow-md">
            <div className="h-2 bg-muted" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2 w-full">
                  <div className="h-6 w-3/4 bg-muted rounded-md"></div>
                  <div className="h-4 w-1/2 bg-muted rounded-md"></div>
                </div>
                <div className="h-5 w-16 bg-muted rounded-full shrink-0 ml-4"></div>
              </div>

              <div className="mt-4 h-8 w-full bg-muted rounded-md"></div>
              
              <div className="mt-4 flex gap-2">
                <div className="h-9 w-full bg-muted rounded-md"></div>
                <div className="h-9 w-10 bg-muted rounded-md shrink-0"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
