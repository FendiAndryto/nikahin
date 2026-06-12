import { Card, CardContent } from "@/components/ui/card";

export default function GuestsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-48 bg-muted rounded-md"></div>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="h-10 w-full sm:max-w-sm bg-muted rounded-md"></div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-muted rounded-md"></div>
              <div className="h-10 w-28 bg-muted rounded-md"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-12 w-full bg-muted rounded-md"></div>
            <div className="h-12 w-full bg-muted rounded-md"></div>
            <div className="h-12 w-full bg-muted rounded-md"></div>
            <div className="h-12 w-full bg-muted rounded-md"></div>
            <div className="h-12 w-full bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
