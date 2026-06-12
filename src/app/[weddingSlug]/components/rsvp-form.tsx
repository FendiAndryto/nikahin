"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Users, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { submitRsvp } from "../actions";
import type { Guest } from "@/types/guest";

interface RsvpFormProps {
  guest: Guest;
  weddingSlug: string;
}

export function RsvpForm({ guest, weddingSlug }: RsvpFormProps) {
  const [isAttending, setIsAttending] = useState<boolean | null>(
    guest.is_attending
  );
  const [companionCount, setCompanionCount] = useState(
    guest.companion_count || 0
  );
  const [submitted, setSubmitted] = useState(guest.is_attending !== null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (isAttending === null) {
      toast.error("Pilih konfirmasi kehadiran terlebih dahulu");
      return;
    }

    startTransition(async () => {
      const result = await submitRsvp(guest.id, weddingSlug, {
        isAttending,
        companionCount: isAttending ? companionCount : 0,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("RSVP berhasil dikirim!");
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8B5E5E]/10">
          <CheckCircle2 className="h-10 w-10 text-[#8B5E5E]" />
        </div>
        <div>
          <h3 className="font-serif text-2xl text-[#333] mb-2">Terima kasih!</h3>
          <p className="text-[#666] text-sm">
            {isAttending
              ? `Kami menantikan kehadiran Anda${companionCount > 0 ? ` bersama ${companionCount} pendamping` : ""}.`
              : "Sayang sekali Anda tidak bisa hadir. Doa dan restu Anda tetap kami hargai."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-[#8B5E5E]/20 text-[#8B5E5E] hover:bg-[#8B5E5E]/5"
          onClick={() => setSubmitted(false)}
        >
          Ubah Jawaban
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Attendance Selection */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAttending(true)}
          className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 ${isAttending === true
              ? "border-[#8B5E5E] bg-[#8B5E5E]/10 shadow-inner"
              : "border-[#8B5E5E]/20 bg-white/50 hover:border-[#8B5E5E]/50 hover:bg-white/70"
            }`}
        >
          <CheckCircle2
            className={`h-8 w-8 transition-transform duration-300 group-hover:scale-110 ${isAttending === true ? "text-[#8B5E5E]" : "text-[#8B5E5E]/40"
              }`}
          />
          <span
            className={`text-sm font-medium tracking-wide ${isAttending === true ? "text-[#8B5E5E]" : "text-[#666]"
              }`}
          >
            Ya, Saya Hadir
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsAttending(false);
            setCompanionCount(0);
          }}
          className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 ${isAttending === false
              ? "border-rose-400 bg-rose-500/10 shadow-inner"
              : "border-gray-200/50 bg-white/50 hover:border-rose-200 hover:bg-rose-50/50"
            }`}
        >
          <XCircle
            className={`h-8 w-8 transition-transform duration-300 group-hover:scale-110 ${isAttending === false ? "text-rose-500" : "text-gray-400"
              }`}
          />
          <span
            className={`text-sm font-medium tracking-wide ${isAttending === false ? "text-rose-500" : "text-[#666]"
              }`}
          >
            Maaf, Tidak Bisa
          </span>
        </motion.button>
      </div>

      {/* Companion Count */}
      <AnimatePresence>
        {isAttending === true && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="space-y-4 overflow-hidden pt-2"
          >
            <label className="flex items-center gap-2 text-sm text-[#666] font-medium tracking-wide">
              <Users className="h-4 w-4" />
              Jumlah Pendamping
            </label>
            <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl border border-[#8B5E5E]/20 w-max mx-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCompanionCount(Math.max(0, companionCount - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#333] hover:text-[#8B5E5E] shadow-sm transition-colors"
              >
                −
              </motion.button>
              <span className="w-10 text-center text-xl font-bold text-[#8B5E5E]">
                {companionCount}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCompanionCount(Math.min(5, companionCount + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#333] hover:text-[#8B5E5E] shadow-sm transition-colors"
              >
                +
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isAttending === null || isPending}
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
              Konfirmasi Kehadiran
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
