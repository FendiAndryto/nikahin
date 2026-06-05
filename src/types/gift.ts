import { z } from "zod";

export const giftAccountSchema = z.object({
  bankName: z.string().min(2, "Nama bank minimal 2 karakter"),
  accountNumber: z.string().min(5, "Nomor rekening tidak valid"),
  accountName: z.string().min(2, "Nama pemilik rekening minimal 2 karakter"),
  qrisUrl: z.string().optional().nullable(),
});

export type GiftAccountFormData = z.infer<typeof giftAccountSchema>;

export interface GiftAccount {
  id: string;
  wedding_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  qris_url: string | null;
  created_at: string;
  updated_at: string;
}
