import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvitationContent } from "./components/invitation-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}): Promise<Metadata> {
  const { weddingSlug } = await params;
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("groom_name, bride_name")
    .eq("slug", weddingSlug)
    .single();

  if (!wedding) {
    return { title: "Undangan Tidak Ditemukan" };
  }

  return {
    title: `${wedding.groom_name} & ${wedding.bride_name} - Undangan Pernikahan`,
    description: `Anda diundang ke pernikahan ${wedding.groom_name} & ${wedding.bride_name}. Konfirmasi kehadiran Anda.`,
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ weddingSlug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { weddingSlug } = await params;
  const { to: guestSlug } = await searchParams;
  const supabase = await createClient();

  // Fetch wedding
  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", weddingSlug)
    .single();

  if (!wedding) notFound();

  // Fetch guest, wishes, and gift accounts in parallel
  const guestPromise = guestSlug
    ? supabase
        .from("guests")
        .select("*")
        .eq("wedding_id", wedding.id)
        .eq("slug", guestSlug)
        .single()
    : Promise.resolve({ data: null });

  const wishesPromise = supabase
    .from("wishes")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const giftAccountsPromise = supabase
    .from("gift_accounts")
    .select("*")
    .eq("wedding_id", wedding.id)
    .order("created_at", { ascending: true });

  const [
    { data: guest },
    { data: wishes },
    { data: giftAccounts }
  ] = await Promise.all([guestPromise, wishesPromise, giftAccountsPromise]);

  return (
    <InvitationContent
      wedding={wedding}
      guest={guest}
      wishes={wishes || []}
      giftAccounts={giftAccounts || []}
    />
  );
}
