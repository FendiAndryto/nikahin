import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingContent } from "@/components/shared/landing-content";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20">
              <span className="text-sm font-bold">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Nika<span className="text-pink-500">hin</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md shadow-pink-500/20"
              >
                Mulai Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Animated Content */}
      <main className="flex-1">
        <LandingContent />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                <span className="text-xs font-bold">N</span>
              </div>
              <span className="text-sm font-semibold">Nikahin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nikahin. Crafted with ❤️ for your special day.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
