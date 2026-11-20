"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Shield } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OLUDAX ADMIN ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center p-4 font-mono text-xs">
      <div className="max-w-md w-full glass rounded-[24px] border border-rose-500/30 p-6 sm:p-8 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] uppercase tracking-wider font-semibold">
            <Shield className="w-3 h-3" />
            <span>Admin Portal Diagnostic</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Console Encountered an Exception
          </h1>
          <p className="text-gray-400 text-xs leading-relaxed">
            A temporary client exception occurred while rendering the merchant console. No order or inventory data was affected.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-rose-300 text-[11px] text-left break-all font-mono">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pink text-white hover:brightness-110 font-semibold flex items-center justify-center gap-2 shadow-md shadow-pink/20 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Console</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center justify-center gap-2 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
