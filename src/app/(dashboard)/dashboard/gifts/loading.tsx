import { Card, CardContent } from "@/components/ui/card";

export default function GiftsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-48 bg-muted rounded-md"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6">
            <div className="h-6 w-32 bg-muted rounded-md mb-6"></div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md"></div>
                <div className="h-10 w-full bg-muted rounded-md"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md"></div>
                <div className="h-10 w-full bg-muted rounded-md"></div>
              </div>
              <div className="h-10 w-full bg-muted rounded-md mt-6"></div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded-md mb-2"></div>
          {[1, 2].map((i) => (
            <Card key={i} className="border-border/40 shadow-sm">
              <CardContent className="p-5 flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted rounded-md"></div>
                  <div className="h-4 w-24 bg-muted rounded-md"></div>
                </div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
