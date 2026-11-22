"use client";

import Link from "next/link";
import { Sparkles, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-[rgba(11,11,13,0.02)] dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/50 text-cloud transition-colors mt-auto">
      <div className="mx-auto max-w-7xl px-3 py-12 sm:px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-xl font-medium text-cloud">
                Oludax
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                Concept
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cloud/50 max-w-xs">
              Your Number One Gift Plug. Turning special moments into beautiful keepsakes through bespoke frames, merchandise branding, and luxury prints.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cloud/60 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Est. 2022 • Ile-Ife, Nigeria</span>
            </div>
          </div>

          {/* Shop Col */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Core Offerings
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop?category=frames"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Frames & Keepsakes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=branding"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Branding & Merchandise
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=prints"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Prints & Stationery
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=gift-boxes"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Curated Gift Boxes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Assistance & Care
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/track"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Delivery & Shipping FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-cloud/60 transition hover:text-cloud"
                >
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Col */}
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cloud/40">
              Connect
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/oludax_concept"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cloud/60 transition hover:text-accent flex items-center gap-2"
                >
                  <span>Instagram (@oludax_concept)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/message/Y4CATULMNOZHK1"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-emerald-500 font-semibold transition hover:underline flex items-center gap-2"
                >
                  <span>WhatsApp: 08144412006</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/c/2348144412006"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cloud/60 transition hover:text-accent"
                >
                  WhatsApp Catalog ↗
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/p/25445532225087863/2348144412006"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cloud/60 transition hover:text-accent"
                >
                  Client Reviews & Proof ↗
                </a>
              </li>
              <li>
                <span className="text-xs text-cloud/40 block pt-1">
                  Ile-Ife, Osun State • Dispatches to Akure & Nationwide
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-cloud/50">
          <p>© {new Date().getFullYear()} OLUDAX CONCEPT. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-cloud/40">Secured with Paystack</span>
            <span>•</span>
            <span className="text-accent font-semibold">NGN (₦)</span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-cloud/40 hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Merchant Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
