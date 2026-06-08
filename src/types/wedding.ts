import { z } from "zod";

// ─── Wedding Schema ──────────────────────────────────────────────────────
export const weddingFormSchema = z.object({
  groomName: z
    .string()
    .min(2, "Nama mempelai pria minimal 2 karakter"),
  brideName: z
    .string()
    .min(2, "Nama mempelai wanita minimal 2 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung"
    ),
  eventDate: z.date().optional().nullable(),
  themeId: z.string().optional(),
  coverImageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()),
  groomPhotoUrl: z.string().optional(),
  bridePhotoUrl: z.string().optional(),
  musicUrl: z.string().optional(),
  quote: z.string().optional(),
  groomParents: z.string().optional(),
  brideParents: z.string().optional(),
  akadTime: z.string().optional(),
  akadLocation: z.string().optional(),
  akadAddress: z.string().optional(),
  resepsiTime: z.string().optional(),
  resepsiLocation: z.string().optional(),
  resepsiAddress: z.string().optional(),
});

export type WeddingFormData = z.infer<typeof weddingFormSchema>;

// ─── Database Row Type ───────────────────────────────────────────────────
export interface Wedding {
  id: string;
  user_id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  event_date: string | null;
  theme_id: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  groom_photo_url: string | null;
  bride_photo_url: string | null;
  music_url: string | null;
  quote: string | null;
  groom_parents: string | null;
  bride_parents: string | null;
  akad_time: string | null;
  akad_location: string | null;
  akad_address: string | null;
  resepsi_time: string | null;
  resepsi_location: string | null;
  resepsi_address: string | null;
  created_at: string;
  updated_at: string;
}

