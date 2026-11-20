"use client";

import { useEffect } from "react";
import Link from "next/link";
import { UserCheck, RefreshCw, Home, Shield } from "lucide-react";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[OLUDAX ACCOUNT ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base text-cloud flex items-center justify-center p-4">
      <div className="max-w-md w-full glass rounded-[28px] border border-black/10 dark:border-white/10 p-6 sm:p-8 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 text-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/10">
          <UserCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-wider font-semibold">
            <Shield className="w-3 h-3" />
            <span>Account Portal</span>
          </div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-cloud">
            Account Session Notice
          </h1>
          <p className="text-cloud/60 text-xs leading-relaxed">
            A temporary client exception occurred while synchronizing your profile. Your stored data, cart items, and wishlist remain safe.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-rose-500 text-[11px] text-left break-all font-mono">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
          <button
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto px-6 py-3 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Account</span>
          </button>
          <Link
            href="/"
            className="btn-outline w-full sm:w-auto px-6 py-3 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
