"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OLUDAX GLOBAL RUNTIME ERROR]", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0B0D] text-[#F4F4F2] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-[28px] border border-white/10 bg-[#141418] p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#E85D88]/20 border border-[#E85D88]/30 text-[#E85D88] flex items-center justify-center mx-auto text-2xl font-bold">
            OC
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#E85D88] px-3 py-1 rounded-full bg-[#E85D88]/10 border border-[#E85D88]/20 inline-block font-semibold">
              Oludax Concept
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Application Notice
            </h1>
            <p className="text-gray-400 text-xs leading-relaxed">
              We encountered a client runtime exception. Your data and cart items are safe. Click below to reload.
            </p>
          </div>

          {error?.message && (
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-rose-400 text-[11px] text-left break-all font-mono">
              {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E85D88] text-white hover:brightness-110 transition font-semibold cursor-pointer"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/15 bg-white/5 text-gray-300 hover:text-white transition"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
