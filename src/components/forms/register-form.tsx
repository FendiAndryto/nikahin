"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { registerSchema, type RegisterFormData } from "@/types/auth";
import { register as registerAction } from "@/app/(auth)/actions";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    const result = await registerAction({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      accountType: data.accountType,
    });
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Mobile Logo */}
      <div className="mb-8 text-center lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20">
            <span className="text-lg font-bold">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Nika<span className="text-pink-500">hin</span>
          </span>
        </Link>
      </div>

      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Buat Akun Baru ✨
        </h1>
        <p className="mt-2 text-muted-foreground">
          Daftar gratis dan mulai buat undangan digital impian Anda
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {serverError && (
          <motion.div
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {serverError}
          </motion.div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium">Tujuan Akun</Label>
          <div className="grid grid-cols-2 gap-4">
            <label className="cursor-pointer">
              <input
                type="radio"
                value="personal"
                className="peer sr-only"
                {...register("accountType")}
              />
              <div className="rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent peer-checked:border-pink-500 peer-checked:bg-pink-500/10">
                <div className="font-semibold text-foreground">Personal</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 acara undangan
                </div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="wo"
                className="peer sr-only"
                {...register("accountType")}
              />
              <div className="rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent peer-checked:border-pink-500 peer-checked:bg-pink-500/10">
                <div className="font-semibold text-foreground">Wedding Organizer</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Kelola banyak acara
                </div>
              </div>
            </label>
          </div>
          {errors.accountType && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.accountType.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Nama Lengkap
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Masukkan nama lengkap"
              autoComplete="name"
              disabled={isSubmitting}
              className="pl-10 h-11"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.fullName.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="pl-10 h-11"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="pl-10 pr-10 h-11"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Konfirmasi Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="pl-10 pr-10 h-11"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-1">
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-pink-500/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mendaftar...
              </>
            ) : (
              "Buat Akun"
            )}
          </Button>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-pink-500 underline-offset-4 hover:underline transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
