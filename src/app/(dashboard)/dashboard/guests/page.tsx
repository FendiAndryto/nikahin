import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GuestTable } from "./guest-table";
import { WeddingSelector } from "@/components/shared/wedding-selector";

export const metadata: Metadata = {
  title: "Daftar Tamu - Nikahin",
  description: "Kelola daftar tamu undangan pernikahan Anda.",
};

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ wedding?: string }>;
}) {
  const { wedding: weddingId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user's weddings
  const { data: weddings } = await supabase
    .from("weddings")
    .select("id, groom_name, bride_name, slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!weddings || weddings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Tamu</h1>
          <p className="text-muted-foreground">
            Anda belum memiliki acara pernikahan.{" "}
            <a href="/dashboard/weddings/new" className="text-pink-500 underline underline-offset-4 hover:text-pink-600">
              Buat acara
            </a>{" "}
            terlebih dahulu.
          </p>
        </div>
      </div>
    );
  }

  // Use first wedding if none selected
  const activeWeddingId = weddingId || weddings[0].id;
  const activeWedding = weddings.find((w) => w.id === activeWeddingId) || weddings[0];

  // Fetch guests for selected wedding
  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("wedding_id", activeWedding.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Tamu</h1>
          <p className="text-muted-foreground">
            Kelola tamu undangan untuk acara Anda
          </p>
        </div>

        {/* Wedding Selector */}
        {weddings.length > 1 && (
          <WeddingSelector
            weddings={weddings}
            activeWeddingId={activeWedding.id}
          />
        )}
      </div>

      {/* Guest Table */}
      <GuestTable
        guests={guests || []}
        weddingId={activeWedding.id}
        weddingSlug={activeWedding.slug}
      />
    </div>
  );
}
