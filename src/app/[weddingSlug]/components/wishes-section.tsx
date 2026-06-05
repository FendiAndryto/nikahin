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
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5E5E]/40" />
          <Input
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-11 h-12 bg-white border-transparent shadow-sm text-[#333] placeholder:text-gray-400 focus-visible:ring-[#8B5E5E]/50 rounded-xl"
            disabled={isPending}
          />
        </div>
        <Textarea
          placeholder="Tulis ucapan untuk mempelai..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] p-4 bg-white border-transparent shadow-sm text-[#333] placeholder:text-gray-400 focus-visible:ring-[#8B5E5E]/50 resize-none rounded-xl"
          disabled={isPending}
        />
        <Button
          type="submit"
          disabled={isPending || !name.trim() || !message.trim()}
          className="w-full h-12 rounded-xl bg-[#8B5E5E] hover:bg-[#724a4a] text-white border-0 shadow-md font-medium tracking-wide"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Kirim Ucapan
            </>
          )}
        </Button>
      </form>

      {/* Wishes List */}
      <div
        ref={listRef}
        className="max-h-[500px] space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#8B5E5E]/20 scrollbar-track-transparent"
      >
        {wishes.length === 0 ? (
          <div className="py-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-[#8B5E5E]/20 mb-4" />
            <p className="text-[#666] text-sm">
              Jadilah yang pertama mengirim ucapan!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[#8B5E5E]/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B5E5E]/10 text-sm font-semibold text-[#8B5E5E]">
                    {wish.guest_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-[#333] truncate">
                      {wish.guest_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {timeAgo(wish.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#666] leading-relaxed">
                  {wish.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
