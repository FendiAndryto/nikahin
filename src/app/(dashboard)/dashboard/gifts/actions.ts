"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { giftAccountSchema } from "@/types/gift";

export async function addGiftAccount(weddingId: string, formData: FormData) {
  const supabase = await createClient();

  // Validate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  const rawData = {
    bankName: formData.get("bankName") as string,
    accountNumber: formData.get("accountNumber") as string,
    accountName: formData.get("accountName") as string,
    qrisUrl: formData.get("qrisUrl") as string | null,
  };

  const validation = giftAccountSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      error: "Validasi gagal",
      details: validation.error.flatten().fieldErrors,
    };
  }

  const data = validation.data;

  // Insert to DB
  const { error } = await supabase.from("gift_accounts").insert({
    wedding_id: weddingId,
    bank_name: data.bankName,
    account_number: data.accountNumber,
    account_name: data.accountName,
    qris_url: data.qrisUrl,
  });

  if (error) {
    console.error("Add gift error:", error);
    return { error: "Gagal menyimpan data akun bank" };
  }

  revalidatePath("/dashboard/gifts");
  return { success: true };
}

export async function deleteGiftAccount(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  const { error } = await supabase
    .from("gift_accounts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete gift error:", error);
    return { error: "Gagal menghapus data" };
  }

  revalidatePath("/dashboard/gifts");
  return { success: true };
}
