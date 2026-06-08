import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Nama lengkap minimal 2 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
    accountType: z.enum(["personal", "wo"], {
      message: "Pilih jenis akun",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

// ─── Inferred Types ─────────────────────────────────────────────────────
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
