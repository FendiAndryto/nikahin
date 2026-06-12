import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Heart,
  Users,
  Calendar,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard - Nikahin",
  description: "Kelola undangan digital pernikahan Anda.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // Fetch user's weddings
  const { data: weddings } = await supabase
    .from("weddings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const weddingCount = weddings?.length || 0;
  const activeWedding = weddings?.[0] || null;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Selamat datang, {userName}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Kelola undangan digital pernikahan Anda dari sini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 shadow-md shadow-black/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{weddingCount}</p>
              <p className="text-sm text-muted-foreground">Total Acara</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-md shadow-black/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Tamu</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-md shadow-black/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <Calendar className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {activeWedding?.event_date
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(activeWedding.event_date).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  : "—"}
              </p>
              <p className="text-sm text-muted-foreground">Hari Menuju Hari H</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Wedding or Empty State */}
      {activeWedding ? (
        <Card className="overflow-hidden border-border/40 shadow-lg shadow-black/5">
          <div className="h-1.5 bg-gradient-to-r from-pink-500 to-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="h-5 w-5 text-pink-500" />
                {activeWedding.groom_name} & {activeWedding.bride_name}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Acara terakhir dibuat
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <Sparkles className="h-3 w-3" />
              {activeWedding.theme_id}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Acara</p>
                  <p className="text-sm font-medium">
                    {activeWedding.event_date
                      ? new Intl.DateTimeFormat("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(activeWedding.event_date))
                      : "Belum ditentukan"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Link Undangan</p>
                  <p className="text-sm font-medium truncate">
                    nikahin.homever.my.id/{activeWedding.slug}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link 
                href={`/dashboard/weddings/${activeWedding.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                Edit Acara
              </Link>
              <Link 
                href="/dashboard/weddings"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
              >
                Lihat Semua
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold">Belum ada acara</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Buat acara pernikahan pertama Anda dan mulai bagikan undangan digital.
            </p>
            <Link 
              href="/dashboard/weddings/new" 
              className={cn(buttonVariants(), "mt-6 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md shadow-pink-500/20")}
            >
              <Plus className="h-4 w-4" />
              Buat Acara Pertama
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
