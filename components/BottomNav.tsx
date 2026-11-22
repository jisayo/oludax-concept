"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  User,
  Tag,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function BottomNav() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();

  // Hide on admin, product detail, and checkout pages for maximum screen real estate
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/product/") ||
    pathname === "/checkout"
  ) {
    return null;
  }

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Catalog", icon: ShoppingBag },
    { href: "/price-list", label: "Price List", icon: Tag },
    { href: "/account", label: "Account", icon: User },
    { href: "/cart", label: "Bag", icon: ShoppingBag, badge: cartCount },
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden pointer-events-auto">
      <nav
        aria-label="Mobile Navigation"
        className="glass rounded-full px-2 py-1.5 shadow-2xl border border-black/15 dark:border-white/15 bg-white/95 dark:bg-[#141418]/95 backdrop-blur-xl flex items-center justify-around"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "text-accent font-semibold"
                  : "text-cloud/60 hover:text-cloud"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? "scale-110 text-accent" : ""
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] text-white px-1 font-bold shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider mt-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}

        {/* WhatsApp Fast Contact Pill */}
        <a
          href="https://wa.me/2348144412006?text=Hello%20Oludax%20Concept!%20I%20am%20browsing%20your%20website%20and%20need%20assistance."
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-emerald-500 hover:text-emerald-400 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-wider mt-0.5 font-semibold">
            Chat
          </span>
        </a>
      </nav>
    </div>
  );
}
