"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Heart,
  Music
} from "lucide-react";

import { RsvpForm } from "./rsvp-form";
import { WishesSection } from "./wishes-section";
import type { Wedding } from "@/types/wedding";
import type { Guest } from "@/types/guest";
import type { Wish } from "@/types/wish";
import type { GiftAccount } from "@/types/gift";

interface InvitationContentProps {
  wedding: Wedding;
  guest: Guest | null;
  wishes: Wish[];
  giftAccounts: GiftAccount[];
}

// Reusable scroll animation wrapper with Spring Physics
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay, type: "spring", bounce: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Elegant Text Reveal Animation
function StaggerText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
        hidden: {},
      }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Elegant Divider
function ElegantDivider() {
  return (
    <div className="flex justify-center mt-6 sm:mt-8 mb-4">
      <div className="flex items-center gap-4 opacity-70">
        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#8B5E5E]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#8B5E5E] bg-transparent" />
        <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#8B5E5E]" />
      </div>
    </div>
  );
}

// Glowing Orb — replaces FloralCorner for abstract luxury feel
function GlowingOrb({
  position,
  className = "",
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  };
  return (
    <div className={`absolute w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-[#8B5E5E]/20 to-transparent blur-3xl pointer-events-none mix-blend-multiply ${positionClasses[position]} ${className}`} />
  );
}

export function InvitationContent({
  wedding,
  guest,
  wishes,
  giftAccounts,
}: InvitationContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const eventDate = wedding.event_date ? new Date(wedding.event_date) : null;
  const formattedDate = eventDate
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(eventDate)
    : "Tanggal akan diumumkan";

  const openInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <div className="font-sans text-[#4A4A4A] bg-[#F5F2ED] min-h-screen selection:bg-[#8B5E5E]/20">
      {wedding.music_url && (
        <audio ref={audioRef} loop src={wedding.music_url} preload="metadata" />
      )}

      {/* ── MUSIC TOGGLE BUTTON ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.5 }}
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/40 backdrop-blur-xl shadow-2xl shadow-black/20 text-[#8B5E5E] border border-white/60"
          >
            <Music className={`h-5 w-5 sm:h-6 sm:w-6 ${isPlaying ? "animate-pulse" : ""}`} />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-0.5 w-6 sm:w-8 bg-[#8B5E5E] rotate-45 shadow-sm" />
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          COVER / ENVELOPE
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F2ED] overflow-hidden"
          >
            {/* MINIMALIST COVER ASSETS */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-4 sm:p-8 overflow-hidden">
              <GlowingOrb position="top-left" className="!w-[400px] !h-[400px] !opacity-30 mix-blend-normal" />
              <GlowingOrb position="bottom-right" className="!w-[500px] !h-[500px] !opacity-30 mix-blend-normal" />

              
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-3xl h-[85vh] sm:h-[90vh]">
                {/* Clean Arch Frame without Florals */}
                <div className="absolute inset-4 sm:inset-6 border-[1px] border-[#8B5E5E]/20 rounded-t-[150px] sm:rounded-t-[250px] lg:rounded-t-[300px] shadow-inner bg-white/20 backdrop-blur-[2px]" />
                <div className="absolute inset-6 sm:inset-8 border-[0.5px] border-[#8B5E5E]/10 rounded-t-[150px] sm:rounded-t-[250px] lg:rounded-t-[300px]" />
              </div>
            </div>

            <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-3xl px-8 sm:px-12 pt-16 sm:pt-20 pb-12 sm:pb-16 flex flex-col items-center justify-between h-[85vh] sm:h-[90vh]">
              <FadeUp>
                <div className="text-center relative">
                  <motion.p 
                    initial={{ opacity: 0, letterSpacing: "0em" }}
                    animate={{ opacity: 1, letterSpacing: "0.3em" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-[10px] sm:text-xs text-[#8B5E5E] uppercase mb-4 sm:mb-6 font-medium"
                  >
                    The Wedding Of
                  </motion.p>
                  <StaggerText text={wedding.groom_name} className="font-serif text-4xl sm:text-5xl lg:text-5xl text-[#333] mb-3 sm:mb-4 drop-shadow-sm whitespace-nowrap" delay={0.5} />
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, type: "spring" }}
                    className="inline-block font-serif italic text-3xl sm:text-4xl text-[#8B5E5E]"
                  >
                    {"&"}
                  </motion.span>
                  <StaggerText text={wedding.bride_name} className="font-serif text-4xl sm:text-5xl lg:text-5xl text-[#333] mt-3 sm:mb-4 drop-shadow-sm whitespace-nowrap" delay={1} />
                </div>
              </FadeUp>

              <FadeUp delay={1.8}>
                <div className="text-center w-full flex flex-col items-center">
                  {guest && (
                    <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl shadow-2xl border border-white/60 relative overflow-hidden transform hover:scale-105 transition-transform duration-500">
                      <GlowingOrb position="top-left" className="!opacity-50" />
                      <GlowingOrb position="bottom-right" className="!opacity-50" />
                      <p className="text-[10px] sm:text-xs text-[#8B5E5E] uppercase tracking-[0.3em] mb-3 font-semibold relative z-10">
                        Kepada Yth.
                      </p>
                      <p className="font-serif text-2xl sm:text-3xl text-[#333] italic font-medium relative z-10 tracking-wide">
                        {guest.name}
                      </p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openInvitation}
                    className="group relative inline-flex h-14 sm:h-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#8B5E5E] to-[#A97C7C] px-10 sm:px-12 text-white shadow-2xl shadow-[#8B5E5E]/40 border border-white/20"
                  >
                    <span className="relative z-10 text-xs sm:text-sm tracking-[0.2em] font-semibold uppercase">
                      Buka Undangan
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.button>
                </div>
              </FadeUp>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT — Full-Width Single Flow
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full">

        {/* ── HERO SECTION ── */}
        <section className="relative w-full h-[85vh] sm:h-screen overflow-hidden bg-[#E8E1D5]">
          <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
            <Image
              src={wedding.cover_image_url || "/images/prewed-hero.png"}
              alt="Prewedding Hero"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          <GlowingOrb position="top-left" className="!w-64 !h-64 sm:!w-96 sm:!h-96 lg:!w-[500px] lg:!h-[500px] !opacity-20 sm:!opacity-30" />
          <GlowingOrb position="bottom-right" className="!w-64 !h-64 sm:!w-96 sm:!h-96 lg:!w-[500px] lg:!h-[500px] !opacity-20 sm:!opacity-30" />

          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-16 flex flex-col justify-end items-center text-white text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 1.2, type: "spring" }}
              className="max-w-3xl flex flex-col items-center"
            >
              <p className="text-[10px] sm:text-sm tracking-[0.4em] uppercase mb-4 text-white/90 font-medium">
                The Wedding Of
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl mb-6 drop-shadow-2xl flex flex-col items-center leading-tight">
                <span>{wedding.groom_name}</span>
                <span className="text-[#A97C7C] italic text-4xl sm:text-5xl lg:text-7xl my-2 sm:my-4">&amp;</span>
                <span>{wedding.bride_name}</span>
              </h1>
              <div className="w-16 h-px bg-[#A97C7C] mb-4 opacity-70" />
              <p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-white/90 drop-shadow-lg">
                {formattedDate}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── AYAT / QUOTE SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden text-center flex flex-col items-center justify-center">
          <FadeUp>
            <div className="max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
              <ElegantDivider />
              <p className="font-serif text-base sm:text-lg lg:text-xl text-[#666] leading-relaxed italic mt-6 sm:mt-8 whitespace-pre-wrap">
                "{wedding.quote || "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya. (QS. Ar-Rum: 21)"}"
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ── MEMPELAI SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#EBE7DF] relative overflow-hidden">
          <GlowingOrb position="top-right" className="!opacity-20" />
          <GlowingOrb position="bottom-left" className="!opacity-20" />

          <FadeUp>
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">Mempelai</h2>
              <ElegantDivider />
            </div>
          </FadeUp>

          {/* Mobile: vertical stack. Desktop: side-by-side */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 sm:gap-16 lg:gap-24 relative z-10 max-w-5xl mx-auto">

            {/* Groom */}
            <FadeUp>
              <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center text-center flex-1 max-w-xs sm:max-w-sm group">
                <div className="relative mb-6 sm:mb-8">
                  <div className="absolute -inset-3 sm:-inset-4 border-[0.5px] border-[#8B5E5E]/40 rounded-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute -inset-5 sm:-inset-6 border-[0.5px] border-[#8B5E5E]/20 rounded-full group-hover:scale-110 transition-transform duration-700 delay-75" />
                  <div className="absolute -inset-8 sm:-inset-10 border-[0.5px] border-[#8B5E5E]/10 rounded-full group-hover:scale-[1.15] transition-transform duration-700 delay-150" />

                  <div className="w-40 h-60 sm:w-52 sm:h-[320px] relative rounded-full overflow-hidden border-[6px] sm:border-8 border-white shadow-2xl z-10">
                    <Image src={wedding.groom_photo_url || "/images/prewed-groom.png"} alt={wedding.groom_name} fill sizes="(max-width: 640px) 160px, 208px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] mb-2 relative z-20 drop-shadow-sm">{wedding.groom_name}</h3>
                <p className="text-[#8B5E5E] text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3 font-semibold">Putra Dari</p>
                <p className="text-[#666] font-serif text-base sm:text-lg lg:text-xl italic max-w-xs">
                  {wedding.groom_parents || "Bapak Fulan & Ibu Fulanah"}
                </p>
              </motion.div>
            </FadeUp>

            {/* Ampersand separator */}
            <FadeUp delay={0.1}>
              <div className="flex items-center justify-center text-[#A97C7C] lg:mt-32 drop-shadow-md">
                <span className="font-serif text-5xl sm:text-6xl italic">&amp;</span>
              </div>
            </FadeUp>

            {/* Bride */}
            <FadeUp delay={0.2}>
              <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col items-center text-center flex-1 max-w-xs sm:max-w-sm group">
                <div className="relative mb-6 sm:mb-8">
                  <div className="absolute -inset-3 sm:-inset-4 border-[0.5px] border-[#8B5E5E]/40 rounded-full group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute -inset-5 sm:-inset-6 border-[0.5px] border-[#8B5E5E]/20 rounded-full group-hover:scale-110 transition-transform duration-700 delay-75" />
                  <div className="absolute -inset-8 sm:-inset-10 border-[0.5px] border-[#8B5E5E]/10 rounded-full group-hover:scale-[1.15] transition-transform duration-700 delay-150" />

                  <div className="w-40 h-60 sm:w-52 sm:h-[320px] relative rounded-full overflow-hidden border-[6px] sm:border-8 border-white shadow-2xl z-10">
                    <Image src={wedding.bride_photo_url || "/images/prewed-bride.png"} alt={wedding.bride_name} fill sizes="(max-width: 640px) 160px, 208px" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] mb-2 relative z-20 drop-shadow-sm">{wedding.bride_name}</h3>
                <p className="text-[#8B5E5E] text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3 font-semibold">Putri Dari</p>
                <p className="text-[#666] font-serif text-base sm:text-lg lg:text-xl italic max-w-xs">
                  {wedding.bride_parents || "Bapak Fulan & Ibu Fulanah"}
                </p>
              </motion.div>
            </FadeUp>
          </div>
        </section>

        {/* ── EVENT DETAILS SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden bg-[#F5F2ED]">

          <GlowingOrb position="bottom-left" className="!opacity-25" />
          <GlowingOrb position="top-right" className="!opacity-25" />

          <FadeUp>
            <div className="text-center mb-10 sm:mb-16 relative z-10">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">Rangkaian Acara</h2>
              <ElegantDivider />
            </div>
          </FadeUp>

          {/* Mobile: stacked. Desktop: side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-sm sm:max-w-md lg:max-w-4xl mx-auto relative z-10">

            {/* Akad Nikah */}
            <FadeUp>
              <motion.div whileHover={{ y: -10 }} className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/5 border border-white relative overflow-hidden flex flex-col items-center text-center h-full">
                <GlowingOrb position="top-left" className="!opacity-40" />
                <GlowingOrb position="bottom-right" className="!opacity-40" />
                <div className="absolute inset-2 border border-[#8B5E5E]/15 rounded-xl sm:rounded-[1.5rem] pointer-events-none" />

                <h3 className="font-serif text-3xl sm:text-4xl text-[#8B5E5E] mb-4 sm:mb-6 mt-2 sm:mt-4 relative z-10">Akad Nikah</h3>
                <div className="space-y-4 sm:space-y-6 text-[#666] text-xs sm:text-sm relative z-10">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#333] mb-1 tracking-wide">{formattedDate}</p>
                    <p className="text-[#8B5E5E] font-medium">{wedding.akad_time || "08:00 WIB - Selesai"}</p>
                  </div>
                  <div className="w-12 h-px bg-[#8B5E5E]/30 mx-auto" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#333] mb-1">{wedding.akad_location || "Kediaman Mempelai Wanita"}</p>
                    <p className="leading-relaxed whitespace-pre-wrap opacity-80">{wedding.akad_address || "Jl. Contoh Alamat No. 123,\nJakarta Selatan"}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>

            {/* Resepsi */}
            <FadeUp delay={0.2}>
              <motion.div whileHover={{ y: -10 }} className="bg-gradient-to-br from-[#8B5E5E] to-[#724a4a] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-[#8B5E5E]/20 relative overflow-hidden flex flex-col items-center text-center text-white h-full border border-white/20">
                <GlowingOrb position="top-right" className="!opacity-30 mix-blend-screen" />
                <GlowingOrb position="bottom-left" className="!opacity-30 mix-blend-screen" />
                <div className="absolute inset-2 border border-white/15 rounded-xl sm:rounded-[1.5rem] pointer-events-none" />

                <h3 className="font-serif text-3xl sm:text-4xl text-white mb-4 sm:mb-6 mt-2 sm:mt-4 relative z-10 drop-shadow-md">Resepsi</h3>
                <div className="space-y-4 sm:space-y-6 text-white/90 text-xs sm:text-sm relative z-10">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white mb-1 tracking-wide">{formattedDate}</p>
                    <p className="text-[#F5F2ED] font-medium">{wedding.resepsi_time || "11:00 WIB - Selesai"}</p>
                  </div>
                  <div className="w-12 h-px bg-white/30 mx-auto" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white mb-1">{wedding.resepsi_location || "Gedung Pertemuan Utama"}</p>
                    <p className="leading-relaxed whitespace-pre-wrap opacity-80">{wedding.resepsi_address || "Jl. Contoh Alamat No. 123,\nJakarta Selatan"}</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </div>

          {/* Countdown Timer */}
          {eventDate && eventDate.getTime() > Date.now() && (
            <FadeUp delay={0.4}>
              <motion.div whileHover={{ scale: 1.02 }} className="mt-10 sm:mt-16 max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white/40 backdrop-blur-xl shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/60 relative z-10">
                <p className="text-center text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#8B5E5E] font-bold mb-4 sm:mb-6">Menuju Hari Bahagia</p>
                <CountdownTimer targetDate={eventDate} />
              </motion.div>
            </FadeUp>
          )}
        </section>

        {/* ── GALLERY SECTION ── */}
        {(wedding.gallery_urls?.length > 0 || !wedding.gallery_urls) && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#F5F2ED] relative overflow-hidden">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-16 relative z-10">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">Galeri</h2>
                <ElegantDivider />
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-sm sm:max-w-2xl lg:max-w-6xl mx-auto relative z-10 px-2 sm:px-0">
              {wedding.gallery_urls?.length > 0 ? (
                wedding.gallery_urls.slice(0, 8).map((url, i) => (
                  <FadeUp key={i} delay={i * 0.1}>
                    <motion.div whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }} transition={{ type: "spring" }} className={`relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-[6px] border-white ${i % 2 === 0 ? "mt-4 sm:mt-8" : ""}`}>
                      <Image src={url} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover hover:scale-110 transition-transform duration-1000" />
                    </motion.div>
                  </FadeUp>
                ))
              ) : (
                <>
                  <FadeUp>
                    <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ type: "spring" }} className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-[6px] border-white mt-4 sm:mt-8">
                      <Image src="/images/prewed-gallery1.png" alt="Gallery 1" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover hover:scale-110 transition-transform duration-1000" />
                    </motion.div>
                  </FadeUp>
                  <FadeUp delay={0.1}>
                    <motion.div whileHover={{ scale: 1.05, rotate: -2 }} transition={{ type: "spring" }} className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-[6px] border-white">
                      <Image src="/images/prewed-gallery2.png" alt="Gallery 2" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover hover:scale-110 transition-transform duration-1000" />
                    </motion.div>
                  </FadeUp>
                </>
              )}
            </div>
          </section>
        )}

        {/* ── DIGITAL GIFT SECTION ── */}
        {giftAccounts.length > 0 && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#E8E1D5] relative overflow-hidden">
            <GlowingOrb position="top-left" className="!opacity-20" />

            <FadeUp>
              <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10 text-center">
                <div className="mb-10 sm:mb-12">
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">Digital Gift</h2>
                  <ElegantDivider />
                  <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih, dapat melalui:
                  </p>
                </div>

                <div className={`grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 ${giftAccounts.length === 1 ? 'max-w-md mx-auto' : 'sm:grid-cols-2'}`}>
                  {giftAccounts.map((account) => (
                    <motion.div whileHover={{ y: -5 }} key={account.id} className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl border border-white/60 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {account.qris_url && (
                        <div className="mb-4 sm:mb-6 flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={account.qris_url} alt="QRIS" className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-[6px] border-white shadow-lg transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <h3 className="font-bold text-lg sm:text-xl text-[#333] mb-2">{account.bank_name}</h3>
                      <p className="text-[#8B5E5E] font-medium text-lg sm:text-xl tracking-[0.1em] mb-2 select-all bg-white/50 py-2 rounded-lg border border-[#8B5E5E]/10">
                        {account.account_number}
                      </p>
                      <p className="text-[10px] sm:text-sm text-[#666] uppercase tracking-widest font-semibold">
                        A.N. {account.account_name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </section>
        )}

        {/* ── RSVP SECTION ── */}
        {guest && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden bg-[#F5F2ED]">
            <GlowingOrb position="top-right" className="!opacity-25" />

            <FadeUp>
              <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-10 sm:mb-12">
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">RSVP</h2>
                  <ElegantDivider />
                  <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm tracking-wide">
                    Kehadiran Anda adalah hadiah terindah bagi kami.
                  </p>
                </div>
                <motion.div whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/60">
                  <RsvpForm guest={guest} weddingSlug={wedding.slug} />
                </motion.div>
              </div>
            </FadeUp>
          </section>
        )}

        {/* ── WISHES / GUESTBOOK SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#EBE7DF] relative overflow-hidden">
          <FadeUp>
            <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#333] tracking-wide">Buku Tamu</h2>
                <ElegantDivider />
                <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm tracking-wide">
                  Tinggalkan pesan dan doa untuk kedua mempelai.
                </p>
              </div>
              <motion.div whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-10 shadow-2xl border border-white/60">
                <WishesSection
                  initialWishes={wishes}
                  weddingId={wedding.id}
                  weddingSlug={wedding.slug}
                  guestName={guest?.name}
                />
              </motion.div>
            </div>
          </FadeUp>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-12 sm:py-16 text-center bg-[#E8E1D5] text-[#333] border-t border-[#8B5E5E]/10 relative overflow-hidden">

          <GlowingOrb position="bottom-left" className="!w-[300px] !h-[300px] !opacity-20" />
          <GlowingOrb position="bottom-right" className="!w-[300px] !h-[300px] !opacity-20" />
          
          <div className="relative z-10">
            <ElegantDivider />
            <p className="font-serif text-2xl sm:text-3xl mb-3 sm:mb-4 mt-6 sm:mt-8 italic text-[#8B5E5E]">
              {wedding.groom_name} {"&"} {wedding.bride_name}
            </p>
            <p className="text-[10px] sm:text-xs text-[#666] tracking-widest uppercase mb-8 sm:mb-12">
              Terima Kasih
            </p>

            <p className="text-[10px] sm:text-xs text-[#333]/50 tracking-widest uppercase">
              Dibuat dengan{" "}
              <Heart className="inline h-3 w-3 text-[#8B5E5E] fill-[#8B5E5E] mx-1" />
              {" "}menggunakan Nikahin
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  function getTimeLeft(target: Date) {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  if (!mounted) {
    return (
      <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center shadow-inner border border-[#8B5E5E]/20 mb-2 sm:mb-3">
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#8B5E5E]">00</span>
            </div>
            <span className="text-[8px] sm:text-[10px] lg:text-xs uppercase tracking-widest text-[#8B5E5E] font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center shadow-inner border border-[#8B5E5E]/20 mb-2 sm:mb-3">
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#8B5E5E]">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[8px] sm:text-[10px] lg:text-xs uppercase tracking-widest text-[#8B5E5E] font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
