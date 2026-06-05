import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingForm } from "@/components/forms/wedding-form";
import { getWeddingById } from "../../actions";

export const metadata: Metadata = {
  title: "Edit Acara - Nikahin",
  description: "Edit acara pernikahan Anda.",
};

export default async function EditWeddingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: wedding, error } = await getWeddingById(id);

  if (error || !wedding) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <WeddingForm wedding={wedding} />
    </div>
  );
}
