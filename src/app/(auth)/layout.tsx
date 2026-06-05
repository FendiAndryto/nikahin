import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left - Image/Branding Panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        {/* Background image */}
        <Image
          src="/auth-bg.png"
          alt="Wedding decoration"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/70 via-rose-900/60 to-purple-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Content over image */}
        <div className="relative flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Nikahin
            </span>
          </Link>

          {/* Testimonial / Quote */}
          <div className="max-w-md">
            <blockquote className="space-y-4">
              <p className="text-2xl font-light leading-relaxed text-white/90">
                &ldquo;Undangan digital kami jadi begitu elegan dan personal. Tamu-tamu kami sangat terkesan!&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">A</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Andi & Sari</p>
                  <p className="text-xs text-white/60">Menikah Oktober 2025</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-4 sm:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
