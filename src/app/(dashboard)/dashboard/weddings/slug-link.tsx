"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Copy, Check } from "lucide-react";

export function SlugLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const fullUrl = origin ? `${origin}/${slug}` : slug;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
      <Link
        href={`/${slug}`}
        target="_blank"
        className="flex items-center gap-1.5 flex-1 min-w-0 hover:text-foreground transition-colors"
      >
        <ExternalLink className="h-3 w-3 shrink-0" />
        <span className="truncate">{fullUrl}</span>
      </Link>
      <button
        onClick={handleCopy}
        className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
        title="Salin link"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
