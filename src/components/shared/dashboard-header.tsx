"use client";

import { useTransition } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Loader2, User } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

interface DashboardHeaderProps {
  userEmail?: string;
  userName?: string;
}

export function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail?.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />

      <div className="flex-1" />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-ring/50 focus-visible:ring-2">
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-normal">
            <div className="flex flex-col space-y-1">
              {userName && (
                <p className="text-sm font-medium leading-none text-foreground">{userName}</p>
              )}
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            Profil (segera)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {isPending ? "Keluar..." : "Keluar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
