import type { Metadata } from "next";
import { WeddingForm } from "@/components/forms/wedding-form";

export const metadata: Metadata = {
  title: "Buat Acara Baru - Nikahin",
  description: "Buat acara pernikahan baru di Nikahin.",
};

export default function NewWeddingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <WeddingForm />
    </div>
  );
}
