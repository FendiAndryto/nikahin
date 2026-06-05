import { z } from "zod";

// ─── Guest Schema ──────────────────────────────────────────────────────
export const guestFormSchema = z.object({
  name: z.string().min(2, "Nama tamu minimal 2 karakter"),
  slug: z
    .string()
    .min(2, "Slug minimal 2 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung"
    ),
  phoneNumber: z.string().optional(),
});

export type GuestFormData = z.infer<typeof guestFormSchema>;

// ─── Database Row Type ───────────────────────────────────────────────
export interface Guest {
  id: string;
  wedding_id: string;
  name: string;
  slug: string;
  phone_number: string | null;
  is_attending: boolean | null;
  companion_count: number;
  created_at: string;
  updated_at: string;
}
