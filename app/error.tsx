"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, Sparkles } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OLUDAX APPLICATION ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base text-cloud flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-[28px] border border-black/10 dark:border-white/10 p-6 sm:p-8 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 text-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/10">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oludax Concept</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-cloud">
            Something Went Wrong
          </h1>
          <p className="text-cloud/60 text-xs sm:text-sm leading-relaxed">
            We encountered a temporary hiccup loading this page. Please try refreshing or return to the main storefront.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto px-6 py-3 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn-outline w-full sm:w-auto px-6 py-3 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
