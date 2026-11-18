"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="border-b border-black/8 bg-[rgba(11,11,13,0.02)] dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/40 text-cloud/80 text-[11px] sm:text-xs py-1.5 px-4 relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em]">
        <Sparkles className="w-3 h-3 text-accent shrink-0" />
        <p className="text-center truncate">
          <span>Free Nationwide Delivery</span> on orders above{" "}
          <span className="text-accent font-semibold">₦50,000</span>
          <span className="hidden md:inline">
            {" "}
            — Bespoke Personalization Studio
          </span>
        </p>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 text-cloud/40 hover:text-cloud transition-colors"
          aria-label="Close announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
