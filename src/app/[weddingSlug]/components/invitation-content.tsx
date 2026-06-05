"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

// Reusable scroll animation wrapper
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Floral Divider
function FloralDivider() {
  return (
    <div className="flex justify-center mt-4 sm:mt-6">
      <div className="w-28 h-10 sm:w-40 sm:h-12 relative opacity-80">
        <Image src="/images/floral-divider-transparent.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
}

// Responsive Floral Corner — scales with viewport
function FloralCorner({
  position,
  className = "",
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-4 -translate-y-4 sm:-translate-x-8 sm:-translate-y-8 rotate-180",
    "top-right": "top-0 right-0 translate-x-4 -translate-y-4 sm:translate-x-8 sm:-translate-y-8 rotate-90",
    "bottom-left": "bottom-0 left-0 -translate-x-4 translate-y-4 sm:-translate-x-8 sm:translate-y-8 -rotate-90",
    "bottom-right": "bottom-0 right-0 translate-x-4 translate-y-4 sm:translate-x-8 sm:translate-y-8",
  };
  return (
    <div className={`absolute w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 opacity-40 sm:opacity-50 lg:opacity-60 pointer-events-none ${positionClasses[position]} ${className}`}>
      <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
    </div>
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

  return (
    <div className="font-sans text-[#4A4A4A] bg-[#F5F2ED] min-h-screen selection:bg-[#8B5E5E]/20">
      {wedding.music_url && (
        <audio ref={audioRef} loop src={wedding.music_url} />
      )}

      {/* ── MUSIC TOGGLE BUTTON ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleAudio}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-xl shadow-black/10 text-[#8B5E5E] transition-transform hover:scale-110 border border-[#8B5E5E]/10"
          >
            <Music className={`h-4 w-4 sm:h-5 sm:w-5 ${isPlaying ? "animate-pulse" : ""}`} />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-0.5 w-5 sm:w-6 bg-[#8B5E5E] rotate-45" />
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
            <FloralCorner position="top-left" className="!w-32 !h-32 sm:!w-48 sm:!h-48 lg:!w-64 lg:!h-64 !opacity-60 sm:!opacity-70" />
            <FloralCorner position="bottom-right" className="!w-32 !h-32 sm:!w-48 sm:!h-48 lg:!w-64 lg:!h-64 !opacity-60 sm:!opacity-70" />

            <div className="relative z-10 w-full max-w-sm sm:max-w-md px-6 py-12 flex flex-col items-center justify-between min-h-screen">
              <FadeUp>
                <div className="text-center mt-16 sm:mt-20 relative">
                  <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#8B5E5E] uppercase mb-4 sm:mb-6 font-medium">
                    The Wedding Of
                  </p>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#333] mb-3 sm:mb-4">
                    {wedding.groom_name}
                  </h1>
                  <span className="font-serif italic text-2xl sm:text-3xl text-[#8B5E5E]">&amp;</span>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#333] mt-3 sm:mt-4">
                    {wedding.bride_name}
                  </h1>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="text-center mt-10 sm:mt-12 mb-8 w-full">
                  {guest && (
                    <div className="mb-8 sm:mb-10 p-5 sm:p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm border border-[#8B5E5E]/10 relative overflow-hidden">
                      <FloralCorner position="top-left" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-40" />
                      <FloralCorner position="bottom-right" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-40" />
                      <p className="text-[10px] sm:text-xs text-[#8B5E5E] uppercase tracking-widest mb-2 font-medium">
                        Kepada Yth.
                      </p>
                      <p className="font-serif text-xl sm:text-2xl text-[#333] italic">
                        {guest.name}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={openInvitation}
                    className="group relative inline-flex h-12 sm:h-14 items-center justify-center overflow-hidden rounded-full bg-[#8B5E5E] px-8 sm:px-10 text-white transition-all hover:bg-[#724a4a] shadow-lg shadow-[#8B5E5E]/30"
                  >
                    <span className="relative z-10 text-xs sm:text-sm tracking-widest font-medium uppercase">
                      Buka Undangan
                    </span>
                    <motion.div
                      className="absolute bottom-0 h-1 w-full bg-white/20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </button>
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
          <Image
            src={wedding.cover_image_url || "/images/prewed-hero.png"}
            alt="Prewedding Hero"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          <FloralCorner position="top-left" className="!w-24 !h-24 sm:!w-40 sm:!h-40 lg:!w-56 lg:!h-56 !opacity-40 sm:!opacity-50" />
          <FloralCorner position="bottom-right" className="!w-24 !h-24 sm:!w-40 sm:!h-40 lg:!w-56 lg:!h-56 !opacity-40 sm:!opacity-50" />

          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 lg:p-16 flex flex-col justify-end items-center lg:items-start text-white text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 1 }}
              className="max-w-3xl"
            >
              <p className="text-[10px] sm:text-sm tracking-[0.3em] uppercase mb-2 text-white/80 font-medium">
                The Wedding Of
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl mb-2 drop-shadow-lg">
                {wedding.groom_name} &amp; {wedding.bride_name}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl font-serif italic text-white/90 drop-shadow-md">
                {formattedDate}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── AYAT / QUOTE SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden text-center flex flex-col items-center justify-center">
          <FadeUp>
            <div className="max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
              <FloralDivider />
              <p className="font-serif text-base sm:text-lg lg:text-xl text-[#666] leading-relaxed italic mt-6 sm:mt-8">
                &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.&quot;
              </p>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm tracking-widest text-[#8B5E5E] font-medium uppercase">
                QS. Ar-Rum: 21
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ── MEMPELAI SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#EBE7DF] relative overflow-hidden">
          <FloralCorner position="top-right" className="!opacity-30 sm:!opacity-40" />
          <FloralCorner position="bottom-left" className="!opacity-30 sm:!opacity-40" />

          <FadeUp>
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative z-10">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">Mempelai</h2>
              <FloralDivider />
            </div>
          </FadeUp>

          {/* Mobile: vertical stack. Desktop: side-by-side */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 sm:gap-16 lg:gap-24 relative z-10 max-w-5xl mx-auto">

            {/* Groom */}
            <FadeUp>
              <div className="flex flex-col items-center text-center flex-1 max-w-xs sm:max-w-sm">
                <div className="relative mb-6 sm:mb-8">
                  <div className="absolute -inset-3 sm:-inset-4 border border-[#8B5E5E]/30 rounded-full" />
                  <div className="absolute -inset-5 sm:-inset-6 border border-[#8B5E5E]/10 rounded-full" />

                  <FloralCorner position="top-left" className="!-top-6 !-left-6 sm:!-top-10 sm:!-left-10 !w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-70 z-20" />
                  <FloralCorner position="bottom-right" className="!-bottom-4 !-right-6 sm:!-bottom-6 sm:!-right-10 !w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-70 z-20 !rotate-0" />

                  <div className="w-40 h-60 sm:w-52 sm:h-[320px] relative rounded-full overflow-hidden border-[6px] sm:border-8 border-white shadow-xl z-10">
                    <Image src={wedding.groom_photo_url || "/images/prewed-groom.png"} alt={wedding.groom_name} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333] mb-2 relative z-20">{wedding.groom_name}</h3>
                <p className="text-[#8B5E5E] text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">Putra Dari</p>
                <p className="text-[#666] font-serif text-sm sm:text-base lg:text-lg italic max-w-xs">
                  Bapak Fulan &amp; Ibu Fulanah
                </p>
              </div>
            </FadeUp>

            {/* Ampersand separator */}
            <FadeUp delay={0.1}>
              <div className="flex items-center justify-center text-[#8B5E5E] lg:mt-32">
                <span className="font-serif text-4xl sm:text-5xl italic">&amp;</span>
              </div>
            </FadeUp>

            {/* Bride */}
            <FadeUp delay={0.2}>
              <div className="flex flex-col items-center text-center flex-1 max-w-xs sm:max-w-sm">
                <div className="relative mb-6 sm:mb-8">
                  <div className="absolute -inset-3 sm:-inset-4 border border-[#8B5E5E]/30 rounded-full" />
                  <div className="absolute -inset-5 sm:-inset-6 border border-[#8B5E5E]/10 rounded-full" />

                  <FloralCorner position="top-right" className="!-top-6 !-right-6 sm:!-top-10 sm:!-right-10 !w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-70 z-20" />
                  <FloralCorner position="bottom-left" className="!-bottom-4 !-left-6 sm:!-bottom-6 sm:!-left-10 !w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-70 z-20 !-rotate-0" />

                  <div className="w-40 h-60 sm:w-52 sm:h-[320px] relative rounded-full overflow-hidden border-[6px] sm:border-8 border-white shadow-xl z-10">
                    <Image src={wedding.bride_photo_url || "/images/prewed-bride.png"} alt={wedding.bride_name} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333] mb-2 relative z-20">{wedding.bride_name}</h3>
                <p className="text-[#8B5E5E] text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3">Putri Dari</p>
                <p className="text-[#666] font-serif text-sm sm:text-base lg:text-lg italic max-w-xs">
                  Bapak Fulan &amp; Ibu Fulanah
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── EVENT DETAILS SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden">
          <FloralCorner position="bottom-left" className="!opacity-25 sm:!opacity-35" />
          <FloralCorner position="top-right" className="!opacity-25 sm:!opacity-35" />

          <FadeUp>
            <div className="text-center mb-10 sm:mb-16 relative z-10">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">Rangkaian Acara</h2>
              <FloralDivider />
            </div>
          </FadeUp>

          {/* Mobile: stacked. Desktop: side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-sm sm:max-w-md lg:max-w-4xl mx-auto relative z-10">

            {/* Akad Nikah */}
            <FadeUp>
              <div className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-lg border-2 border-white relative overflow-hidden flex flex-col items-center text-center h-full">
                <FloralCorner position="top-left" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-40" />
                <FloralCorner position="bottom-right" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-40" />
                <div className="absolute inset-2 border border-[#8B5E5E]/15 rounded-xl sm:rounded-[1.5rem] pointer-events-none" />

                <h3 className="font-serif text-2xl sm:text-3xl text-[#8B5E5E] mb-4 sm:mb-6 mt-2 sm:mt-4 relative z-10">Akad Nikah</h3>
                <div className="space-y-4 sm:space-y-6 text-[#666] text-xs sm:text-sm relative z-10">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#333] mb-1">{formattedDate}</p>
                    <p>08:00 WIB - Selesai</p>
                  </div>
                  <div className="w-10 sm:w-12 h-px bg-[#8B5E5E]/20 mx-auto" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-[#333] mb-1">Kediaman Mempelai Wanita</p>
                    <p className="leading-relaxed">Jl. Contoh Alamat No. 123,<br/>Jakarta Selatan</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Resepsi */}
            <FadeUp delay={0.2}>
              <div className="bg-[#8B5E5E] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col items-center text-center text-white h-full">
                <FloralCorner position="top-right" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-25" />
                <FloralCorner position="bottom-left" className="!w-16 !h-16 sm:!w-24 sm:!h-24 !opacity-25" />
                <div className="absolute inset-2 border border-white/15 rounded-xl sm:rounded-[1.5rem] pointer-events-none" />

                <h3 className="font-serif text-2xl sm:text-3xl text-white mb-4 sm:mb-6 mt-2 sm:mt-4 relative z-10">Resepsi</h3>
                <div className="space-y-4 sm:space-y-6 text-white/90 text-xs sm:text-sm relative z-10">
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white mb-1">{formattedDate}</p>
                    <p>11:00 WIB - Selesai</p>
                  </div>
                  <div className="w-10 sm:w-12 h-px bg-white/30 mx-auto" />
                  <div>
                    <p className="font-medium text-sm sm:text-base text-white mb-1">Gedung Pertemuan Utama</p>
                    <p className="leading-relaxed">Jl. Contoh Alamat No. 123,<br/>Jakarta Selatan</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Countdown Timer */}
          {eventDate && eventDate.getTime() > Date.now() && (
            <FadeUp delay={0.4}>
              <div className="mt-10 sm:mt-16 max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#8B5E5E]/10 relative z-10">
                <p className="text-center text-[10px] sm:text-xs tracking-widest uppercase text-[#8B5E5E] font-medium mb-4 sm:mb-6">Menuju Hari Bahagia</p>
                <CountdownTimer targetDate={eventDate} />
              </div>
            </FadeUp>
          )}
        </section>

        {/* ── GALLERY SECTION ── */}
        {(wedding.gallery_urls?.length > 0 || !wedding.gallery_urls) && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-[#EBE7DF] relative overflow-hidden">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-16 relative z-10">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">Galeri</h2>
                <FloralDivider />
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-sm sm:max-w-2xl lg:max-w-5xl mx-auto relative z-10">
              {wedding.gallery_urls?.length > 0 ? (
                wedding.gallery_urls.slice(0, 8).map((url, i) => (
                  <FadeUp key={i} delay={i * 0.1}>
                    <div className={`relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-white ${i % 2 === 0 ? "mt-4 sm:mt-6" : ""}`}>
                      <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </FadeUp>
                ))
              ) : (
                <>
                  <FadeUp>
                    <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-white mt-4 sm:mt-6">
                      <Image src="/images/prewed-gallery1.png" alt="Gallery 1" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </FadeUp>
                  <FadeUp delay={0.1}>
                    <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 border-white">
                      <Image src="/images/prewed-gallery2.png" alt="Gallery 2" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  </FadeUp>
                </>
              )}
            </div>
          </section>
        )}

        {/* ── DIGITAL GIFT SECTION ── */}
        {giftAccounts.length > 0 && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-white relative overflow-hidden">
            <FloralCorner position="top-left" className="!opacity-25 sm:!opacity-35" />

            <FadeUp>
              <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10 text-center">
                <div className="mb-10 sm:mb-12">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">Digital Gift</h2>
                  <FloralDivider />
                  <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm max-w-md mx-auto">
                    Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih, dapat melalui:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {giftAccounts.map((account) => (
                    <div key={account.id} className="bg-[#F5F2ED] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-[#8B5E5E]/15">
                      {account.qris_url && (
                        <div className="mb-4 sm:mb-6 flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={account.qris_url} alt="QRIS" className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-white shadow-md" />
                        </div>
                      )}
                      <h3 className="font-bold text-lg sm:text-xl text-[#333] mb-2">{account.bank_name}</h3>
                      <p className="text-[#8B5E5E] font-medium text-sm sm:text-lg tracking-wider mb-2 select-all">
                        {account.account_number}
                      </p>
                      <p className="text-[10px] sm:text-sm text-[#666] uppercase tracking-widest">
                        A.N. {account.account_name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </section>
        )}

        {/* ── RSVP SECTION ── */}
        {guest && (
          <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 relative overflow-hidden">
            <FloralCorner position="top-right" className="!opacity-25 sm:!opacity-35" />

            <FadeUp>
              <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-10 sm:mb-12">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">RSVP</h2>
                  <FloralDivider />
                  <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm">
                    Kehadiran Anda adalah hadiah terindah bagi kami.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-[#8B5E5E]/10">
                  <RsvpForm guest={guest} weddingSlug={wedding.slug} />
                </div>
              </div>
            </FadeUp>
          </section>
        )}

        {/* ── WISHES / GUESTBOOK SECTION ── */}
        <section className="py-16 px-4 sm:py-24 sm:px-8 lg:px-16 bg-white relative overflow-hidden">
          <FadeUp>
            <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto relative z-10">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#333]">Buku Tamu</h2>
                <FloralDivider />
                <p className="mt-6 sm:mt-8 text-[#666] text-xs sm:text-sm">
                  Tinggalkan pesan dan doa untuk kedua mempelai.
                </p>
              </div>
              <div className="bg-[#F5F2ED] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-inner border border-[#8B5E5E]/10">
                <WishesSection
                  initialWishes={wishes}
                  weddingId={wedding.id}
                  weddingSlug={wedding.slug}
                  guestName={guest?.name}
                />
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-12 sm:py-16 text-center bg-[#E8E1D5] text-[#333] border-t border-[#8B5E5E]/10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 sm:w-48 sm:h-24 opacity-50 sm:opacity-60 rotate-180 -translate-y-8 sm:-translate-y-12">
            <Image src="/images/floral-divider-transparent.png" alt="" fill className="object-contain" />
          </div>

          <p className="font-serif text-2xl sm:text-3xl mb-3 sm:mb-4 mt-6 sm:mt-8 italic text-[#8B5E5E]">
            {wedding.groom_name} &amp; {wedding.bride_name}
          </p>
          <p className="text-[10px] sm:text-xs text-[#666] tracking-widest uppercase mb-8 sm:mb-12">
            Terima Kasih
          </p>

          <p className="text-[10px] sm:text-xs text-[#333]/50 tracking-widest uppercase">
            Dibuat dengan <Heart className="inline h-3 w-3 text-[#8B5E5E] fill-[#8B5E5E] mx-1" /> menggunakan Nikahin
          </p>
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
