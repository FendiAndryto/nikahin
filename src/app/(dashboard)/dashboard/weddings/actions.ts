"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { WeddingFormData } from "@/types/wedding";

export async function createWedding(data: WeddingFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  // Check account type limit
  const accountType = user.user_metadata?.account_type || "personal";
  if (accountType === "personal") {
    const { data: userWeddings } = await supabase
      .from("weddings")
      .select("id")
      .eq("user_id", user.id);

    if (userWeddings && userWeddings.length >= 1) {
      return { error: "Akun personal hanya dapat membuat 1 acara undangan. Upgrade ke akun WO untuk membuat lebih banyak acara." };
    }
  }

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("weddings")
    .select("id")
    .eq("slug", data.slug)
    .single();

  if (existing) {
    return { error: "Slug sudah digunakan. Silakan pilih slug lain." };
  }

  const { error } = await supabase.from("weddings").insert({
    user_id: user.id,
    groom_name: data.groomName,
    bride_name: data.brideName,
    slug: data.slug,
    event_date: data.eventDate?.toISOString() || null,
    theme_id: data.themeId || "default",
    cover_image_url: data.coverImageUrl || null,
    gallery_urls: data.galleryUrls || [],
    groom_photo_url: data.groomPhotoUrl || null,
    bride_photo_url: data.bridePhotoUrl || null,
    music_url: data.musicUrl || null,
    quote: data.quote || null,
    groom_parents: data.groomParents || null,
    bride_parents: data.brideParents || null,
    akad_time: data.akadTime || null,
    akad_location: data.akadLocation || null,
    akad_address: data.akadAddress || null,
    resepsi_time: data.resepsiTime || null,
    resepsi_location: data.resepsiLocation || null,
    resepsi_address: data.resepsiAddress || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/weddings");
  redirect("/dashboard/weddings");
}

export async function updateWedding(id: string, data: WeddingFormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  // Check slug uniqueness (exclude current wedding)
  const { data: existing } = await supabase
    .from("weddings")
    .select("id")
    .eq("slug", data.slug)
    .neq("id", id)
    .single();

  if (existing) {
    return { error: "Slug sudah digunakan. Silakan pilih slug lain." };
  }

  const { error } = await supabase
    .from("weddings")
    .update({
      groom_name: data.groomName,
      bride_name: data.brideName,
      slug: data.slug,
      event_date: data.eventDate?.toISOString() || null,
      theme_id: data.themeId || "default",
      cover_image_url: data.coverImageUrl || null,
      gallery_urls: data.galleryUrls || [],
      groom_photo_url: data.groomPhotoUrl || null,
      bride_photo_url: data.bridePhotoUrl || null,
      music_url: data.musicUrl || null,
      quote: data.quote || null,
      groom_parents: data.groomParents || null,
      bride_parents: data.brideParents || null,
      akad_time: data.akadTime || null,
      akad_location: data.akadLocation || null,
      akad_address: data.akadAddress || null,
      resepsi_time: data.resepsiTime || null,
      resepsi_location: data.resepsiLocation || null,
      resepsi_address: data.resepsiAddress || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/weddings");
  redirect("/dashboard/weddings");
}

export async function deleteWedding(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  const { error } = await supabase
    .from("weddings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/weddings");
  return { success: true };
}

export async function getWeddings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data || [], error: null };
}

export async function getWeddingById(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
