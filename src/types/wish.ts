import { z } from "zod";

// ─── Wish Schema ─────────────────────────────────────────────────────
export const wishFormSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter"),
  message: z.string().min(5, "Ucapan minimal 5 karakter").max(500, "Ucapan maksimal 500 karakter"),
});

export type WishFormData = z.infer<typeof wishFormSchema>;

// ─── Database Row Type ───────────────────────────────────────────────
export interface Wish {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string;
  created_at: string;
}
