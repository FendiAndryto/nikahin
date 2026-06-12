import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeddingSelector } from "@/components/shared/wedding-selector";
import { GiftList } from "./components/gift-list";

export const metadata: Metadata = {
  title: "Digital Gifts - Nikahin",
  description: "Kelola akun bank dan QRIS untuk hadiah digital Anda.",
};

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ wedding?: string }>;
}) {
  const { wedding: weddingId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect("/login");

  // If weddingId is in URL, fetch weddings and gifts in parallel
  const giftsPromise = weddingId 
    ? supabase
        .from("gift_accounts")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("created_at", { ascending: true })
    : Promise.resolve({ data: null });

  const weddingsPromise = supabase
    .from("weddings")
    .select("id, groom_name, bride_name, slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const [{ data: weddings }, { data: preFetchedGifts }] = await Promise.all([
    weddingsPromise,
    giftsPromise
  ]);

  if (!weddings || weddings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Gifts</h1>
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

  const activeWeddingId = weddingId || weddings[0].id;
  const activeWedding = weddings.find((w) => w.id === activeWeddingId) || weddings[0];

  let giftAccounts = preFetchedGifts;

  // If no weddingId was in URL, fetch gifts sequentially after getting default wedding
  if (!giftAccounts) {
    const { data } = await supabase
      .from("gift_accounts")
      .select("*")
      .eq("wedding_id", activeWedding.id)
      .order("created_at", { ascending: true });
    giftAccounts = data;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Gifts</h1>
          <p className="text-muted-foreground">
            Kelola akun bank dan QRIS untuk hadiah digital
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

      <GiftList 
        giftAccounts={giftAccounts || []} 
        weddingId={activeWedding.id} 
      />
    </div>
  );
}
