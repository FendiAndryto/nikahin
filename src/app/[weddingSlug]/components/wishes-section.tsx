"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { submitWish } from "../actions";
import type { Wish } from "@/types/wish";

interface WishesSectionProps {
  initialWishes: Wish[];
  weddingId: string;
  weddingSlug: string;
  guestName?: string;
}

export function WishesSection({
  initialWishes,
  weddingId,
  weddingSlug,
  guestName,
}: WishesSectionProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`wishes-${weddingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          const newWish = payload.new as Wish;
          setWishes((prev) => {
            // Avoid duplicate
            if (prev.some((w) => w.id === newWish.id)) return prev;
            return [newWish, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weddingId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      toast.error("Nama dan ucapan harus diisi");
      return;
    }

    startTransition(async () => {
      const result = await submitWish(weddingId, weddingSlug, {
        guestName: name.trim(),
        message: message.trim(),
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Ucapan berhasil dikirim!");
        setMessage("");
      }
    });
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  }

  return (
    <div className="space-y-8">
      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E5E]/40" />
          <Input
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-12 h-14 bg-white/40 backdrop-blur-md border border-[#8B5E5E]/20 shadow-sm text-[#333] placeholder:text-[#8B5E5E]/50 focus-visible:ring-[#8B5E5E]/50 rounded-2xl transition-all hover:bg-white/60 focus:bg-white"
            disabled={isPending}
          />
        </div>
        <Textarea
          placeholder="Tulis ucapan untuk mempelai..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] p-5 bg-white/40 backdrop-blur-md border border-[#8B5E5E]/20 shadow-sm text-[#333] placeholder:text-[#8B5E5E]/50 focus-visible:ring-[#8B5E5E]/50 resize-none rounded-2xl transition-all hover:bg-white/60 focus:bg-white leading-relaxed"
          disabled={isPending}
        />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            disabled={isPending || !name.trim() || !message.trim()}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#8B5E5E] to-[#A97C7C] hover:opacity-90 text-white border-0 shadow-xl shadow-[#8B5E5E]/20 text-sm tracking-[0.2em] uppercase font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Kirim Ucapan
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Wishes List */}
      <div
        ref={listRef}
        className="max-h-[600px] space-y-4 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-[#8B5E5E]/30 scrollbar-track-transparent rounded-2xl p-1"
      >
        {wishes.length === 0 ? (
          <div className="py-16 text-center bg-white/30 backdrop-blur-sm rounded-3xl border border-[#8B5E5E]/10">
            <MessageCircle className="mx-auto h-16 w-16 text-[#8B5E5E]/30 mb-4 animate-bounce" />
            <p className="text-[#8B5E5E]/70 font-medium tracking-wide">
              Jadilah yang pertama mengirim ucapan!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {wishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3, delay: i * 0.05 }}
                className="group rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5E5E] to-[#A97C7C] text-lg font-bold text-white shadow-md group-hover:scale-110 transition-transform duration-500">
                    {wish.guest_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-xl text-[#333] truncate drop-shadow-sm">
                      {wish.guest_name}
                    </p>
                    <p className="text-xs text-[#8B5E5E]/60 font-medium tracking-wide">
                      {timeAgo(wish.created_at)}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-4xl text-[#8B5E5E]/10 font-serif">"</span>
                  <p className="text-sm sm:text-base text-[#555] leading-relaxed relative z-10 pl-2">
                    {wish.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
