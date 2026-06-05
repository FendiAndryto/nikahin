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
        <button
          onClick={() => setIsAttending(true)}
          className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
            isAttending === true
              ? "border-[#8B5E5E] bg-[#8B5E5E]/5"
              : "border-gray-200 bg-white hover:border-[#8B5E5E]/50 hover:bg-gray-50"
          }`}
        >
          <CheckCircle2
            className={`h-8 w-8 ${
              isAttending === true ? "text-[#8B5E5E]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isAttending === true ? "text-[#8B5E5E]" : "text-gray-500"
            }`}
          >
            Ya, Saya Hadir
          </span>
        </button>

        <button
          onClick={() => {
            setIsAttending(false);
            setCompanionCount(0);
          }}
          className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
            isAttending === false
              ? "border-rose-400 bg-rose-50"
              : "border-gray-200 bg-white hover:border-rose-200 hover:bg-gray-50"
          }`}
        >
          <XCircle
            className={`h-8 w-8 ${
              isAttending === false ? "text-rose-500" : "text-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isAttending === false ? "text-rose-500" : "text-gray-500"
            }`}
          >
            Maaf, Tidak Bisa
          </span>
        </button>
      </div>

      {/* Companion Count */}
      <AnimatePresence>
        {isAttending === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden pt-2"
          >
            <label className="flex items-center gap-2 text-sm text-[#666] font-medium">
              <Users className="h-4 w-4" />
              Jumlah Pendamping
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCompanionCount(Math.max(0, companionCount - 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#333] hover:bg-gray-50 hover:border-[#8B5E5E]/30 transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-xl font-semibold text-[#8B5E5E]">
                {companionCount}
              </span>
              <button
                onClick={() => setCompanionCount(Math.min(5, companionCount + 1))}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#333] hover:bg-gray-50 hover:border-[#8B5E5E]/30 transition-colors"
              >
                +
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isAttending === null || isPending}
        className="w-full h-14 rounded-xl bg-[#8B5E5E] hover:bg-[#724a4a] text-white border-0 shadow-lg shadow-[#8B5E5E]/20 text-base font-medium tracking-wide"
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
    </div>
  );
}
