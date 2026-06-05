"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  MessageCircle,
  Gift,
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
function FadeUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Floral Divider (Transparent)
function FloralDivider() {
  return (
    <div className="flex justify-center mt-6">
      <div className="w-40 h-12 relative opacity-90">
        <Image src="/images/floral-divider-transparent.png" alt="" fill className="object-contain" />
      </div>
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

      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xl shadow-black/5 text-[#8B5E5E] transition-transform hover:scale-110"
          >
            <Music className={`h-5 w-5 ${isPlaying ? "animate-pulse" : ""}`} />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-0.5 w-6 bg-[#8B5E5E] rotate-45" />
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F2ED] overflow-hidden"
          >
            {/* Transparent Floral Corners */}
            <div className="absolute top-0 left-0 w-72 h-72 opacity-80 rotate-180 -translate-x-12 -translate-y-12">
              <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
            </div>
            <div className="absolute bottom-0 right-0 w-72 h-72 opacity-80 translate-x-12 translate-y-12">
              <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center justify-between min-h-screen">
              <FadeUp>
                <div className="text-center mt-12 relative">
                  <p className="text-xs tracking-[0.3em] text-[#8B5E5E] uppercase mb-6 font-medium">
                    The Wedding Of
                  </p>
                  <h1 className="font-serif text-5xl sm:text-6xl text-[#333] mb-4">
                    {wedding.groom_name}
                  </h1>
                  <span className="font-serif italic text-3xl text-[#8B5E5E]">&amp;</span>
                  <h1 className="font-serif text-5xl sm:text-6xl text-[#333] mt-4">
                    {wedding.bride_name}
                  </h1>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="text-center mt-12 mb-8 w-full">
                  {guest && (
                    <div className="mb-10 p-6 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm border border-[#8B5E5E]/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-24 h-24 opacity-60 rotate-180 -translate-x-4 -translate-y-4">
                        <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-60 translate-x-4 translate-y-4">
                        <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                      </div>
                      <p className="text-xs text-[#8B5E5E] uppercase tracking-widest mb-2 font-medium">
                        Kepada Yth.
                      </p>
                      <p className="font-serif text-2xl text-[#333] italic">
                        {guest.name}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={openInvitation}
                    className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-[#8B5E5E] px-10 text-white transition-all hover:bg-[#724a4a] shadow-lg shadow-[#8B5E5E]/30"
                  >
                    <span className="relative z-10 text-sm tracking-widest font-medium uppercase">
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

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT PANEL */}
        <div className="lg:fixed lg:left-0 lg:top-0 lg:w-1/2 lg:h-screen w-full relative h-[70vh] lg:h-auto overflow-hidden bg-[#E8E1D5]">
          <Image
            src={wedding.cover_image_url || "/images/prewed-hero.png"}
            alt="Prewedding Hero"
            fill
            className="object-cover object-center lg:object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/40 lg:to-transparent" />
          
          <div className="absolute top-0 left-0 w-64 h-64 opacity-70 rotate-180 -translate-x-12 -translate-y-12">
            <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-70 translate-x-12 translate-y-12">
            <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 flex flex-col justify-end text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 1 }}
            >
              <p className="text-sm tracking-[0.3em] uppercase mb-2 text-white/80 font-medium">
                The Wedding Of
              </p>
              <h1 className="font-serif text-5xl lg:text-7xl mb-2 drop-shadow-lg">
                {wedding.groom_name} &amp; {wedding.bride_name}
              </h1>
              <p className="text-lg lg:text-xl font-serif italic text-white/90 drop-shadow-md">
                {formattedDate}
              </p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-1/2 lg:ml-auto w-full relative z-10 bg-[#F5F2ED] shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          
          <section className="py-24 px-6 sm:px-12 relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[50vh]">
            <FadeUp>
              <div className="w-24 h-12 mb-6 mx-auto opacity-80">
                <Image src="/images/floral-divider-transparent.png" alt="" fill className="object-contain" />
              </div>
              <p className="font-serif text-lg sm:text-xl text-[#666] leading-relaxed italic max-w-md mx-auto">
                "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya."
              </p>
              <p className="mt-6 text-sm tracking-widest text-[#8B5E5E] font-medium uppercase">
                QS. Ar-Rum: 21
              </p>
            </FadeUp>
          </section>

          <section className="py-24 px-6 sm:px-12 bg-[#EBE7DF] relative">
            <div className="absolute top-0 right-0 w-48 h-48 opacity-60 translate-x-12 -translate-y-12">
              <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
            </div>

            <FadeUp>
              <div className="text-center mb-20 relative z-10">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">Mempelai</h2>
                <FloralDivider />
              </div>
            </FadeUp>

            <div className="space-y-24 relative z-10">
              <FadeUp>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 border border-[#8B5E5E] rounded-t-full rounded-b-full opacity-30 transform translate-y-4"></div>
                    <div className="absolute -inset-6 border border-[#8B5E5E] rounded-t-full rounded-b-full opacity-10"></div>
                    
                    {/* Transparent Floral Corners */}
                    <div className="absolute -top-12 -left-12 w-32 h-32 opacity-90 rotate-180 z-20">
                      <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                    </div>
                    
                    <div className="w-56 h-[340px] relative rounded-t-full rounded-b-full overflow-hidden border-8 border-white shadow-xl z-10">
                      <Image src={wedding.groom_photo_url || "/images/prewed-groom.png"} alt={wedding.groom_name} fill className="object-cover" />
                    </div>

                    {/* Bottom Floral */}
                    <div className="absolute -bottom-8 -right-12 w-32 h-32 opacity-90 z-20">
                      <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                    </div>
                  </div>
                  <h3 className="font-serif text-4xl text-[#333] mb-2 relative z-20">{wedding.groom_name}</h3>
                  <p className="text-[#8B5E5E] text-sm tracking-widest uppercase mb-3">Putra Dari</p>
                  <p className="text-[#666] font-serif text-lg italic max-w-sm">
                    Bapak Fulan &amp; Ibu Fulanah
                  </p>
                </div>
              </FadeUp>

              <FadeUp>
                <div className="flex items-center justify-center text-[#8B5E5E]">
                  <span className="font-serif text-5xl italic">&amp;</span>
                </div>
              </FadeUp>

              <FadeUp>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute -inset-4 border border-[#8B5E5E] rounded-t-full rounded-b-full opacity-30 transform -translate-y-4"></div>
                    <div className="absolute -inset-6 border border-[#8B5E5E] rounded-t-full rounded-b-full opacity-10"></div>
                    
                    {/* Floral Corners */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 opacity-90 rotate-90 z-20">
                      <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                    </div>
                    
                    <div className="w-56 h-[340px] relative rounded-t-full rounded-b-full overflow-hidden border-8 border-white shadow-xl z-10">
                      <Image src={wedding.bride_photo_url || "/images/prewed-bride.png"} alt={wedding.bride_name} fill className="object-cover" />
                    </div>

                    {/* Bottom Floral */}
                    <div className="absolute -bottom-10 -left-12 w-32 h-32 opacity-90 -rotate-90 z-20">
                      <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                    </div>
                  </div>
                  <h3 className="font-serif text-4xl text-[#333] mb-2 relative z-20">{wedding.bride_name}</h3>
                  <p className="text-[#8B5E5E] text-sm tracking-widest uppercase mb-3">Putri Dari</p>
                  <p className="text-[#666] font-serif text-lg italic max-w-sm">
                    Bapak Fulan &amp; Ibu Fulanah
                  </p>
                </div>
              </FadeUp>
            </div>
          </section>

          {/* Event Details */}
          <section className="py-24 px-6 sm:px-12 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-50 -translate-x-16 translate-y-16">
              <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
            </div>

            <FadeUp>
              <div className="text-center mb-16 relative z-10">
                <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">Rangkaian Acara</h2>
                <FloralDivider />
              </div>
            </FadeUp>

            <div className="space-y-8 max-w-md mx-auto relative z-10">
              <FadeUp>
                <div className="bg-white rounded-[2rem] p-10 shadow-lg border-2 border-white relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute top-0 left-0 w-32 h-32 opacity-60 rotate-180 -translate-x-8 -translate-y-8">
                    <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 opacity-60 translate-x-8 translate-y-8">
                    <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                  </div>
                  <div className="absolute inset-2 border border-[#8B5E5E]/20 rounded-[1.5rem] pointer-events-none"></div>

                  <h3 className="font-serif text-3xl text-[#8B5E5E] mb-6 mt-4 relative z-10">Akad Nikah</h3>
                  <div className="space-y-6 text-[#666] text-sm relative z-10">
                    <div>
                      <p className="font-medium text-base text-[#333] mb-1">{formattedDate}</p>
                      <p>08:00 WIB - Selesai</p>
                    </div>
                    <div className="w-12 h-px bg-[#8B5E5E]/20 mx-auto" />
                    <div>
                      <p className="font-medium text-base text-[#333] mb-1">Kediaman Mempelai Wanita</p>
                      <p className="leading-relaxed">Jl. Contoh Alamat No. 123,<br/>Jakarta Selatan</p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="bg-[#8B5E5E] rounded-[2rem] p-10 shadow-xl relative overflow-hidden flex flex-col items-center text-center text-white">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-40 rotate-90 translate-x-8 -translate-y-8">
                    <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 opacity-40 -rotate-90 -translate-x-8 translate-y-8">
                    <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
                  </div>
                  <div className="absolute inset-2 border border-white/20 rounded-[1.5rem] pointer-events-none"></div>

                  <h3 className="font-serif text-3xl text-white mb-6 mt-4 relative z-10">Resepsi</h3>
                  <div className="space-y-6 text-white/90 text-sm relative z-10">
                    <div>
                      <p className="font-medium text-base text-white mb-1">{formattedDate}</p>
                      <p>11:00 WIB - Selesai</p>
                    </div>
                    <div className="w-12 h-px bg-white/30 mx-auto" />
                    <div>
                      <p className="font-medium text-base text-white mb-1">Gedung Pertemuan Utama</p>
                      <p className="leading-relaxed">Jl. Contoh Alamat No. 123,<br/>Jakarta Selatan</p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {eventDate && eventDate.getTime() > Date.now() && (
                <FadeUp delay={0.4}>
                  <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-[#8B5E5E]/10">
                    <p className="text-center text-xs tracking-widest uppercase text-[#8B5E5E] font-medium mb-6">Menuju Hari Bahagia</p>
                    <CountdownTimer targetDate={eventDate} />
                  </div>
                </FadeUp>
              )}
            </div>
          </section>

          {(wedding.gallery_urls?.length > 0 || !wedding.gallery_urls) && (
            <section className="py-24 px-6 sm:px-12 bg-[#EBE7DF] relative">
              <FadeUp>
                <div className="text-center mb-16 relative z-10">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">Galeri</h2>
                  <FloralDivider />
                </div>
              </FadeUp>

              <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto relative z-10">
                {wedding.gallery_urls?.length > 0 ? (
                  wedding.gallery_urls.slice(0, 4).map((url, i) => (
                    <FadeUp key={i} delay={i * 0.2}>
                      <div className={`relative aspect-[3/4] rounded-t-full rounded-b-full overflow-hidden shadow-lg border-4 border-white ${i % 2 === 0 ? 'mt-8' : '-mt-8'}`}>
                        <Image src={url} alt={`Gallery ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    </FadeUp>
                  ))
                ) : (
                  <>
                    <FadeUp>
                      <div className="relative aspect-[3/4] rounded-t-full rounded-b-full overflow-hidden shadow-lg border-4 border-white mt-8">
                        <Image src="/images/prewed-gallery1.png" alt="Gallery 1" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    </FadeUp>
                    <FadeUp delay={0.2}>
                      <div className="relative aspect-[3/4] rounded-t-full rounded-b-full overflow-hidden shadow-lg border-4 border-white -mt-8">
                        <Image src="/images/prewed-gallery2.png" alt="Gallery 2" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                      </div>
                    </FadeUp>
                  </>
                )}
              </div>
            </section>
          )}

          {giftAccounts.length > 0 && (
            <section className="py-24 px-6 sm:px-12 bg-white relative">
              <div className="absolute top-0 left-0 w-64 h-64 opacity-50 -translate-x-16 -translate-y-16">
                <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
              </div>

              <FadeUp>
                <div className="max-w-md mx-auto relative z-10 text-center">
                  <div className="mb-12">
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">Digital Gift</h2>
                    <FloralDivider />
                    <p className="mt-8 text-[#666] text-sm">
                      Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih, dapat melalui:
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {giftAccounts.map((account) => (
                      <div key={account.id} className="bg-[#F5F2ED] rounded-3xl p-8 shadow-sm border border-[#8B5E5E]/20">
                        {account.qris_url && (
                          <div className="mb-6 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={account.qris_url} alt="QRIS" className="w-48 h-48 object-cover rounded-xl border-4 border-white shadow-md" />
                          </div>
                        )}
                        <h3 className="font-bold text-xl text-[#333] mb-2">{account.bank_name}</h3>
                        <p className="text-[#8B5E5E] font-medium text-lg tracking-wider mb-2 select-all">
                          {account.account_number}
                        </p>
                        <p className="text-sm text-[#666] uppercase tracking-widest">
                          A.N. {account.account_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </section>
          )}

          {guest && (
            <section className="py-24 px-6 sm:px-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-50 translate-x-16 -translate-y-16">
                <Image src="/images/floral-corner-transparent.png" alt="" fill className="object-contain" />
              </div>

              <FadeUp>
                <div className="max-w-md mx-auto relative z-10">
                  <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">RSVP</h2>
                    <FloralDivider />
                    <p className="mt-8 text-[#666] text-sm">
                      Kehadiran Anda adalah hadiah terindah bagi kami.
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#8B5E5E]/10">
                    <RsvpForm guest={guest} weddingSlug={wedding.slug} />
                  </div>
                </div>
              </FadeUp>
            </section>
          )}

          <section className="py-24 px-6 sm:px-12 bg-white relative">
            <FadeUp>
              <div className="max-w-md mx-auto relative z-10">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#333]">Buku Tamu</h2>
                  <FloralDivider />
                  <p className="mt-8 text-[#666] text-sm">
                    Tinggalkan pesan dan doa untuk kedua mempelai.
                  </p>
                </div>
                <div className="bg-[#F5F2ED] rounded-3xl p-6 sm:p-8 shadow-inner border border-[#8B5E5E]/10">
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

          <footer className="py-16 text-center bg-[#E8E1D5] text-[#333] border-t border-[#8B5E5E]/10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 opacity-60 rotate-180 -translate-y-12">
              <Image src="/images/floral-divider-transparent.png" alt="" fill className="object-contain" />
            </div>
            
            <p className="font-serif text-3xl mb-4 mt-8 italic text-[#8B5E5E]">
              {wedding.groom_name} &amp; {wedding.bride_name}
            </p>
            <p className="text-xs text-[#666] tracking-widest uppercase mb-12">
              Terima Kasih
            </p>

            <p className="text-xs text-[#333]/50 tracking-widest uppercase">
              Dibuat dengan <Heart className="inline h-3 w-3 text-[#8B5E5E] fill-[#8B5E5E] mx-1" /> menggunakan Nikahin
            </p>
          </footer>

        </div>
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
      <div className="flex justify-center gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center shadow-inner border border-[#8B5E5E]/20 mb-3">
              <span className="font-serif text-2xl sm:text-3xl text-[#8B5E5E]">00</span>
            </div>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8B5E5E] font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 sm:gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5F2ED] rounded-full flex items-center justify-center shadow-inner border border-[#8B5E5E]/20 mb-3">
            <span className="font-serif text-2xl sm:text-3xl text-[#8B5E5E]">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8B5E5E] font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
