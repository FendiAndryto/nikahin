import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Daftar - Nikahin",
  description: "Buat akun Nikahin dan mulai desain undangan digital pernikahan Anda.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
