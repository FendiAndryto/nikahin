"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Heart,
  Calendar as CalendarIcon,
  Link as LinkIcon,
  User,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { weddingFormSchema, type WeddingFormData, type Wedding } from "@/types/wedding";
import {
  createWedding,
  updateWedding,
} from "@/app/(dashboard)/dashboard/weddings/actions";
import { slugify } from "@/lib/utils/index";

interface WeddingFormProps {
  wedding?: Wedding | null;
}

export function WeddingForm({ wedding }: WeddingFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const isEditing = !!wedding;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<WeddingFormData>({
    resolver: zodResolver(weddingFormSchema),
    defaultValues: {
      groomName: wedding?.groom_name || "",
      brideName: wedding?.bride_name || "",
      slug: wedding?.slug || "",
      eventDate: wedding?.event_date ? new Date(wedding.event_date) : null,
      themeId: wedding?.theme_id || "default",
      coverImageUrl: wedding?.cover_image_url || "",
      galleryUrls: wedding?.gallery_urls || [],
      groomPhotoUrl: wedding?.groom_photo_url || "",
      bridePhotoUrl: wedding?.bride_photo_url || "",
      musicUrl: wedding?.music_url || "",
    },
  });

  const watchGroomName = watch("groomName");
  const watchBrideName = watch("brideName");
  const watchEventDate = watch("eventDate");
  const watchCoverImage = watch("coverImageUrl");
  const watchGallery = watch("galleryUrls");
  const watchGroomPhoto = watch("groomPhotoUrl");
  const watchBridePhoto = watch("bridePhotoUrl");
  const watchMusic = watch("musicUrl");

  function generateSlug() {
    if (watchGroomName && watchBrideName) {
      const slug = slugify(`${watchGroomName}-dan-${watchBrideName}`);
      setValue("slug", slug, { shouldValidate: true });
    }
  }

  async function onSubmit(data: WeddingFormData) {
    setServerError(null);

    const result = isEditing
      ? await updateWedding(wedding!.id, data)
      : await createWedding(data);

    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/40 shadow-lg shadow-black/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-5 w-5 text-pink-500" />
            {isEditing ? "Edit Acara Pernikahan" : "Buat Acara Pernikahan Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <motion.div
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                {serverError}
              </motion.div>
            )}

            {/* Groom & Bride Names */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="groomName">Nama Mempelai Pria</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="groomName"
                    placeholder="Contoh: Ahmad"
                    className="pl-10 h-11"
                    disabled={isSubmitting}
                    {...register("groomName")}
                  />
                </div>
                {errors.groomName && (
                  <p className="text-sm text-destructive">
                    {errors.groomName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brideName">Nama Mempelai Wanita</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="brideName"
                    placeholder="Contoh: Sari"
                    className="pl-10 h-11"
                    disabled={isSubmitting}
                    {...register("brideName")}
                  />
                </div>
                {errors.brideName && (
                  <p className="text-sm text-destructive">
                    {errors.brideName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Groom & Bride Photos */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Foto Mempelai Pria (Opsional)</Label>
                {watchGroomPhoto ? (
                  <div className="relative inline-block border rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={watchGroomPhoto} alt="Groom" className="w-full h-32 object-cover sm:w-48" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setValue("groomPhotoUrl", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/sign"
                    options={{ multiple: false, clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
                    onSuccess={(result) => {
                      document.body.style.overflow = '';
                      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                        setValue("groomPhotoUrl", result.info.secure_url as string, { shouldValidate: true });
                      }
                    }}
                    onClose={() => { document.body.style.overflow = ''; }}
                    onError={() => { document.body.style.overflow = ''; }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => open()}
                        className="flex items-center justify-center w-full sm:w-48 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Upload className="h-5 w-5 mb-2" />
                          <span className="text-xs">Upload Foto Pria</span>
                        </div>
                      </div>
                    )}
                  </CldUploadWidget>
                )}
              </div>

              <div className="space-y-2">
                <Label>Foto Mempelai Wanita (Opsional)</Label>
                {watchBridePhoto ? (
                  <div className="relative inline-block border rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={watchBridePhoto} alt="Bride" className="w-full h-32 object-cover sm:w-48" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => setValue("bridePhotoUrl", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/sign"
                    options={{ multiple: false, clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
                    onSuccess={(result) => {
                      document.body.style.overflow = '';
                      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                        setValue("bridePhotoUrl", result.info.secure_url as string, { shouldValidate: true });
                      }
                    }}
                    onClose={() => { document.body.style.overflow = ''; }}
                    onError={() => { document.body.style.overflow = ''; }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => open()}
                        className="flex items-center justify-center w-full sm:w-48 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Upload className="h-5 w-5 mb-2" />
                          <span className="text-xs">Upload Foto Wanita</span>
                        </div>
                      </div>
                    )}
                  </CldUploadWidget>
                )}
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="slug"
                    placeholder="ahmad-dan-sari"
                    className="pl-10 h-11"
                    disabled={isSubmitting}
                    {...register("slug")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 shrink-0"
                  onClick={generateSlug}
                  disabled={!watchGroomName || !watchBrideName}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Link undangan: nikahin.com/<span className="font-medium">{watch("slug") || "slug-anda"}</span>
              </p>
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label>Tanggal Acara</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal",
                        !watchEventDate && "text-muted-foreground"
                      )}
                    />
                  }
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchEventDate
                    ? format(watchEventDate, "EEEE, d MMMM yyyy", { locale: id })
                    : "Pilih tanggal acara"}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchEventDate ?? undefined}
                    onSelect={(date) => setValue("eventDate", date ?? null, { shouldValidate: true })}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
              {errors.eventDate && (
                <p className="text-sm text-destructive">
                  {errors.eventDate.message}
                </p>
              )}
            </div>

            {/* Upload Foto Sampul */}
            <div className="space-y-2">
              <Label>Foto Sampul Utama</Label>
              {watchCoverImage ? (
                <div className="relative inline-block border rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={watchCoverImage} alt="Cover" className="w-full h-48 object-cover sm:w-64" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setValue("coverImageUrl", "")}
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
                      setValue("coverImageUrl", result.info.secure_url as string, { shouldValidate: true });
                    }
                  }}
                  onClose={() => { document.body.style.overflow = ''; }}
                  onError={() => { document.body.style.overflow = ''; }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload className="h-6 w-6 mb-2" />
                        <span className="text-sm">Klik untuk upload foto sampul</span>
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* Upload Galeri */}
            <div className="space-y-2">
              <Label>Galeri Foto (Opsional)</Label>
              <div className="flex flex-wrap gap-4">
                {watchGallery?.map((url, i) => (
                  <div key={i} className="relative inline-block border rounded-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Gallery ${i}`} className="w-24 h-24 object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        const newGallery = [...(watchGallery || [])];
                        newGallery.splice(i, 1);
                        setValue("galleryUrls", newGallery);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  options={{ multiple: true, clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
                  onSuccess={(result) => {
                    document.body.style.overflow = '';
                    if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                      const newGallery = [...(watch("galleryUrls") || []), result.info.secure_url as string];
                      setValue("galleryUrls", newGallery, { shouldValidate: true });
                    }
                  }}
                  onClose={() => { document.body.style.overflow = ''; }}
                  onError={() => { document.body.style.overflow = ''; }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center text-muted-foreground text-center px-1">
                        <Upload className="h-4 w-4 mb-1" />
                        <span className="text-[10px]">Tambah Foto</span>
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            </div>

            {/* Upload Music */}
            <div className="space-y-2">
              <Label>Latar Musik (File MP3/M4A)</Label>
              <p className="text-xs text-muted-foreground mb-2">Maksimal ukuran file disarankan di bawah 10MB.</p>
              {watchMusic ? (
                <div className="relative inline-flex items-center p-3 border rounded-md bg-muted/30">
                  <audio controls src={watchMusic} className="h-8 max-w-[200px] sm:max-w-xs" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="ml-3 h-8 w-8"
                    onClick={() => setValue("musicUrl", "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  options={{ multiple: false, clientAllowedFormats: ["mp3", "m4a", "wav"], resourceType: "video" }}
                  onSuccess={(result) => {
                    document.body.style.overflow = '';
                    if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                      setValue("musicUrl", result.info.secure_url as string, { shouldValidate: true });
                    }
                  }}
                  onClose={() => { document.body.style.overflow = ''; }}
                  onError={() => { document.body.style.overflow = ''; }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Upload className="h-6 w-6 mb-2" />
                        <span className="text-sm">Klik untuk upload musik</span>
                      </div>
                    </div>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-pink-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Menyimpan..." : "Membuat..."}
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      {isEditing ? "Simpan Perubahan" : "Buat Acara"}
                    </>
                  )}
                </Button>
              </motion.div>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => router.push("/dashboard/weddings")}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
