import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5F2ED]">
      <div className="relative flex flex-col items-center justify-center animate-pulse">
        {/* Decorative outer ring */}
        <div className="absolute w-32 h-32 rounded-full border border-[#8B5E5E]/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-24 h-24 rounded-full border border-[#8B5E5E]/40 animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Heart icon */}
        <Heart className="w-10 h-10 text-[#8B5E5E] fill-[#8B5E5E] animate-pulse" />
        
        {/* Loading text */}
        <p className="mt-8 font-serif text-sm tracking-[0.3em] uppercase text-[#8B5E5E]">
          Mempersiapkan Undangan
        </p>
      </div>
    </div>
  );
}
