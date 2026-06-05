"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── RSVP ────────────────────────────────────────────────────────────

export async function submitRsvp(
  guestId: string,
  weddingSlug: string,
  data: {
    isAttending: boolean;
    companionCount: number;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("guests")
    .update({
      is_attending: data.isAttending,
      companion_count: data.companionCount,
    })
    .eq("id", guestId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/${weddingSlug}`);
  return { success: true };
}

// ─── Wishes ──────────────────────────────────────────────────────────

export async function submitWish(
  weddingId: string,
  weddingSlug: string,
  data: {
    guestName: string;
    message: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("wishes").insert({
    wedding_id: weddingId,
    guest_name: data.guestName,
    message: data.message,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/${weddingSlug}`);
  return { success: true };
}
