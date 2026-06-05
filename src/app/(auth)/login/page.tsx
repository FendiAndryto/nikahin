import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Masuk - Nikahin",
  description: "Masuk ke akun Nikahin untuk mengelola undangan digital pernikahan Anda.",
};

export default function LoginPage() {
  return <LoginForm />;
}
