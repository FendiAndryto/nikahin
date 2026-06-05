"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Link as LinkIcon, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { guestFormSchema, type GuestFormData, type Guest } from "@/types/guest";
import { createGuest, updateGuest } from "@/app/(dashboard)/dashboard/guests/actions";
import { slugify } from "@/lib/utils/index";
import { toast } from "sonner";

interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingId: string;
  weddingSlug: string;
  guest?: Guest | null;
  onSuccess?: () => void;
}

export function GuestFormDialog({
  open,
  onOpenChange,
  weddingId,
  weddingSlug,
  guest,
  onSuccess,
}: GuestFormDialogProps) {
  const isEditing = !!guest;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      name: guest?.name || "",
      slug: guest?.slug || "",
      phoneNumber: guest?.phone_number || "",
    },
  });

  const watchName = watch("name");
  const watchSlug = watch("slug");

  function generateSlug() {
    if (watchName) {
      const slug = slugify(watchName);
      setValue("slug", slug, { shouldValidate: true });
    }
  }

  async function onSubmit(data: GuestFormData) {
    const result = isEditing
      ? await updateGuest(guest!.id, weddingId, data)
      : await createGuest(weddingId, data);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isEditing ? "Tamu berhasil diperbarui" : "Tamu berhasil ditambahkan");
      reset();
      onOpenChange(false);
      onSuccess?.();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Tamu" : "Tambah Tamu Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui informasi tamu undangan."
              : "Tambahkan tamu baru ke daftar undangan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="guest-name">Nama Tamu</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-name"
                placeholder="Contoh: Budi Santoso"
                className="pl-10 h-10"
                disabled={isSubmitting}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="guest-slug">Slug URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="guest-slug"
                  placeholder="budi-santoso"
                  className="pl-10 h-10"
                  disabled={isSubmitting}
                  {...register("slug")}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                onClick={generateSlug}
                disabled={!watchName}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Link undangan:{" "}
              <span className="font-medium">
                nikahin.com/{weddingSlug}?to={watchSlug || "slug-tamu"}
              </span>
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="guest-phone">
              Nomor Telepon{" "}
              <span className="text-muted-foreground font-normal">(opsional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="guest-phone"
                placeholder="08xx-xxxx-xxxx"
                className="pl-10 h-10"
                disabled={isSubmitting}
                {...register("phoneNumber")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Menyimpan..." : "Menambahkan..."}
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Tamu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
