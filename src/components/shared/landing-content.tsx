"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, Send, Star, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FadeInUp,
  FadeIn,
  Float,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/shared/animations";

// ─── Feature Cards Data ──────────────────────────────────────────────────
const features = [
  {
    icon: Sparkles,
    title: "Desain Premium",
    description: "Template undangan elegan dengan desain yang bisa dikustomisasi sesuai tema pernikahan Anda.",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-500",
  },
  {
    icon: Users,
    title: "Kelola Tamu",
    description: "Atur daftar tamu, kirim undangan personal, dan pantau konfirmasi kehadiran secara real-time.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Send,
    title: "RSVP Digital",
    description: "Tamu bisa konfirmasi kehadiran langsung dari undangan digital dengan mudah dan cepat.",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Heart,
    title: "Amplop Digital",
    description: "Terima hadiah pernikahan via transfer bank atau QRIS langsung dari halaman undangan.",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-500",
  },
];

const stats = [
  { value: "10K+", label: "Undangan Dibuat" },
  { value: "50K+", label: "Tamu Terdaftar" },
  { value: "99%", label: "Kepuasan" },
];

// ─── Floating Particles Component ────────────────────────────────────────
function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = [...Array(6)].map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 3,
      height: Math.random() * 6 + 3,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: `rgba(244, 114, 182, ${Math.random() * 0.3 + 0.1})`,
      x: Math.random() * 20 - 10,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            top: p.top,
            background: p.background,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.x, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Landing Content ────────────────────────────────────────────────
export function LandingContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(251, 182, 206, 0.3) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(196, 181, 253, 0.2) 0%, transparent 70%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(253, 230, 138, 0.15) 0%, transparent 70%)" }} />
        </div>

        <FloatingParticles />

        <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - Text Content */}
            <div className="relative z-10">
              <FadeInUp delay={0.1}>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-1.5 text-sm text-pink-700 shadow-sm">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
                  Platform Undangan Digital #1 di Indonesia
                </div>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                  Buat Undangan{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
                      Pernikahan Digital
                    </span>
                    <motion.span
                      className="absolute -bottom-1 left-0 h-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    />
                  </span>{" "}
                  yang Memukau
                </h1>
              </FadeInUp>

              <FadeInUp delay={0.35}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Desain undangan yang personal dan elegan. Kelola tamu, terima RSVP,
                  dan bagikan link undangan — semua dalam satu platform yang mudah
                  digunakan.
                </p>
              </FadeInUp>

              <FadeInUp delay={0.5}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link 
                      href="/register"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "gap-2 px-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-pink-500/25"
                      )}
                    >
                      <Heart className="h-4 w-4" />
                      Buat Undangan Gratis
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link 
                      href="/login"
                      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-8")}
                    >
                      Masuk ke Akun
                    </Link>
                  </motion.div>
                </div>
              </FadeInUp>

              {/* Stats */}
              <FadeInUp delay={0.65}>
                <div className="mt-12 flex gap-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <motion.p
                        className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.15, type: "spring", stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FadeInUp>
            </div>

            {/* Right - Hero Image */}
            <FadeIn delay={0.3}>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <Float duration={4} distance={8}>
                  <div className="relative">
                    {/* Glow behind image */}
                    <div className="absolute inset-4 rounded-3xl" style={{ background: "radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, rgba(167, 139, 250, 0.15) 50%, transparent 80%)" }} />

                    {/* Main image */}
                    <motion.div
                      className="relative overflow-hidden rounded-3xl border border-white/50 shadow-2xl shadow-pink-500/10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="/hero-wedding.png"
                        alt="Undangan digital pernikahan"
                        width={600}
                        height={500}
                        className="w-full object-cover"
                        priority
                        fetchPriority="high"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                    </motion.div>

                    {/* Floating badge - top right */}
                    <motion.div
                      className="absolute -top-3 -right-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg shadow-black/5 border border-border/50"
                      initial={{ opacity: 0, scale: 0, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">Premium</span>
                    </motion.div>

                    {/* Floating badge - bottom left */}
                    <motion.div
                      className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg shadow-black/5 border border-border/50"
                      initial={{ opacity: 0, scale: 0, rotate: 10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    >
                      <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                      <span className="text-xs font-semibold">1.2K+ Suka</span>
                    </motion.div>
                  </div>
                </Float>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-border/40 bg-gradient-to-b from-muted/30 to-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                Fitur Unggulan
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Semua yang Anda Butuhkan
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Dari desain undangan hingga manajemen tamu, kami menyediakan semua yang Anda perlukan untuk hari spesial Anda.
              </p>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.12} delay={0.2} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b ${feature.gradient} p-6 transition-shadow hover:shadow-xl hover:shadow-black/5`}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
                >
                  <div className={`mb-4 inline-flex rounded-xl bg-background p-3 shadow-sm ${feature.iconColor}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-violet-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full" style={{ background: "radial-gradient(circle, rgba(251, 182, 206, 0.15) 0%, transparent 70%)" }} />
        </div>

        <ScaleIn>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <motion.div
              className="inline-flex mb-6"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="h-10 w-10 text-pink-500 fill-pink-500/30" />
            </motion.div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Siap Membuat Undangan Impian?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Mulai buat undangan digital pernikahan Anda sekarang. Gratis, mudah,
              dan elegan — hanya butuh 5 menit.
            </p>

            <div className="mt-8">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link 
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 px-10 py-6 text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-xl shadow-pink-500/25"
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                  Mulai Sekarang — Gratis!
                </Link>
              </motion.div>
            </div>
          </div>
        </ScaleIn>
      </section>
    </>
  );
}
