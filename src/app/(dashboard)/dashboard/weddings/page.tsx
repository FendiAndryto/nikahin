import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Heart, Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeddings } from "./actions";
import { DeleteWeddingButton } from "./delete-button";
import { SlugLink } from "./slug-link";

export const metadata: Metadata = {
  title: "Acara Pernikahan - Nikahin",
  description: "Kelola acara pernikahan Anda.",
};

export default async function WeddingsPage() {
  const { data: weddings, error } = await getWeddings();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Acara Pernikahan</h1>
          <p className="text-muted-foreground">
            Kelola acara pernikahan Anda di sini
          </p>
        </div>
        <Link href="/dashboard/weddings/new">
          <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md shadow-pink-500/20">
            <Plus className="h-4 w-4" />
            Buat Acara Baru
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Wedding Cards */}
      {weddings.length === 0 ? (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold">Belum ada acara</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Mulai buat acara pernikahan pertama Anda dan bagikan undangan digital ke tamu-tamu Anda.
            </p>
            <Link href="/dashboard/weddings/new" className="mt-6">
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0">
                <Plus className="h-4 w-4" />
                Buat Acara Pertama
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weddings.map((wedding) => (
            <Card
              key={wedding.id}
              className="group overflow-hidden border-border/40 shadow-md shadow-black/5 transition-all hover:shadow-lg hover:shadow-black/10"
            >
              {/* Card Top Gradient */}
              <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500" />

              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {wedding.groom_name} & {wedding.bride_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {wedding.event_date
                        ? new Intl.DateTimeFormat("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(wedding.event_date))
                        : "Tanggal belum ditentukan"}
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {wedding.theme_id}
                  </Badge>
                </div>

                {/* Slug Link */}
                <SlugLink slug={wedding.slug} />

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/weddings/${wedding.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteWeddingButton weddingId={wedding.id} weddingName={`${wedding.groom_name} & ${wedding.bride_name}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
