"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface WeddingSelectorProps {
  weddings: {
    id: string;
    groom_name: string;
    bride_name: string;
    slug: string;
  }[];
  activeWeddingId: string;
}

export function WeddingSelector({
  weddings,
  activeWeddingId,
}: WeddingSelectorProps) {
  const router = useRouter();
  const active = weddings.find((w) => w.id === activeWeddingId);

  function handleSelect(weddingId: string) {
    router.push(`/dashboard/guests?wedding=${weddingId}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="gap-2" />
        }
      >
        <Heart className="h-4 w-4 text-pink-500" />
        {active
          ? `${active.groom_name} & ${active.bride_name}`
          : "Pilih Acara"}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {weddings.map((wedding) => (
          <DropdownMenuItem
            key={wedding.id}
            onClick={() => handleSelect(wedding.id)}
            className={wedding.id === activeWeddingId ? "bg-muted" : ""}
          >
            <Heart className="mr-2 h-3.5 w-3.5 text-pink-500" />
            {wedding.groom_name} & {wedding.bride_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
