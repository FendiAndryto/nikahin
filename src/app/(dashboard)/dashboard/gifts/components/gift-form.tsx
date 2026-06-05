"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { Loader2, Upload, X } from "lucide-react";

import { GiftAccountFormData, giftAccountSchema } from "@/types/gift";
import { addGiftAccount } from "../actions";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GiftFormProps {
  weddingId: string;
  onSuccess: () => void;
}

export function GiftForm({ weddingId, onSuccess }: GiftFormProps) {
  const [isPending, startTransition] = useTransition();
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);

  const form = useForm<GiftAccountFormData>({
    resolver: zodResolver(giftAccountSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      accountName: "",
      qrisUrl: "",
    },
  });

  function onSubmit(data: GiftAccountFormData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("bankName", data.bankName);
      formData.append("accountNumber", data.accountNumber);
      formData.append("accountName", data.accountName);
      if (qrisUrl) {
        formData.append("qrisUrl", qrisUrl);
      }

      const result = await addGiftAccount(weddingId, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Akun bank berhasil ditambahkan!");
      onSuccess();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Bank / E-Wallet</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: BCA, Mandiri, GoPay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Rekening / No. HP</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atas Nama</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Upload QRIS (Opsional)</FormLabel>
          {qrisUrl ? (
            <div className="relative inline-block border rounded-md overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrisUrl} alt="QRIS" className="w-32 h-32 object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => setQrisUrl(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign"
              options={{ multiple: false, clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
              onSuccess={(result) => {
                document.body.style.overflow = '';
                if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                  setQrisUrl(result.info.secure_url as string);
                }
              }}
              onClose={() => {
                document.body.style.overflow = '';
              }}
              onError={() => {
                document.body.style.overflow = '';
              }}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="h-6 w-6 mb-2" />
                    <span className="text-sm">Klik untuk upload foto QRIS</span>
                  </div>
                </div>
              )}
            </CldUploadWidget>
          )}
          <FormDescription>
            Format yang didukung: JPG, PNG, WEBP.
          </FormDescription>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Simpan"
          )}
        </Button>
      </form>
    </Form>
  );
}
