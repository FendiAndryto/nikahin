"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GuestFormData } from "@/types/guest";

// ─── Helpers ─────────────────────────────────────────────────────────
async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

async function verifyWeddingOwnership(weddingId: string) {
  const { supabase, user } = await getAuthUser();
  const { data } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", weddingId)
    .eq("user_id", user.id)
    .single();

  if (!data) throw new Error("Wedding not found");
  return { supabase, user };
}

// ─── CRUD ────────────────────────────────────────────────────────────

export async function getGuestsByWedding(weddingId: string) {
  const { supabase } = await verifyWeddingOwnership(weddingId);

  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function createGuest(weddingId: string, formData: GuestFormData) {
  const { supabase } = await verifyWeddingOwnership(weddingId);

  // Check slug uniqueness within this wedding
  const { data: existing } = await supabase
    .from("guests")
    .select("id")
    .eq("wedding_id", weddingId)
    .eq("slug", formData.slug)
    .single();

  if (existing) {
    return { error: "Slug sudah digunakan untuk tamu lain di acara ini." };
  }

  const { error } = await supabase.from("guests").insert({
    wedding_id: weddingId,
    name: formData.name,
    slug: formData.slug,
    phone_number: formData.phoneNumber || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/guests`);
  return { success: true };
}

export async function updateGuest(
  guestId: string,
  weddingId: string,
  formData: GuestFormData
) {
  const { supabase } = await verifyWeddingOwnership(weddingId);

  // Check slug uniqueness (exclude current guest)
  const { data: existing } = await supabase
    .from("guests")
    .select("id")
    .eq("wedding_id", weddingId)
    .eq("slug", formData.slug)
    .neq("id", guestId)
    .single();

  if (existing) {
    return { error: "Slug sudah digunakan untuk tamu lain di acara ini." };
  }

  const { error } = await supabase
    .from("guests")
    .update({
      name: formData.name,
      slug: formData.slug,
      phone_number: formData.phoneNumber || null,
    })
    .eq("id", guestId)
    .eq("wedding_id", weddingId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/guests`);
  return { success: true };
}

export async function deleteGuest(guestId: string, weddingId: string) {
  const { supabase } = await verifyWeddingOwnership(weddingId);

  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", guestId)
    .eq("wedding_id", weddingId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/guests`);
  return { success: true };
}

export async function deleteMultipleGuests(
  guestIds: string[],
  weddingId: string
) {
  const { supabase } = await verifyWeddingOwnership(weddingId);

  const { error } = await supabase
    .from("guests")
    .delete()
    .in("id", guestIds)
    .eq("wedding_id", weddingId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/guests`);
  return { success: true };
}

// ─── User's weddings for selector ────────────────────────────────────
export async function getUserWeddings() {
  const { supabase, user } = await getAuthUser();

  const { data, error } = await supabase
    .from("weddings")
    .select("id, groom_name, bride_name, slug")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}
