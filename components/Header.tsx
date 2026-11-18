"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header({ title }: { title?: string }) {
  const { count } = useCart();

  if (title) {
    return (
      <div className="flex items-center gap-3 p-4 bg-white sticky top-0 z-10 border-b border-line font-semibold">
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 border-b border-line">
      <Link href="/" className="font-display font-bold text-lg text-maroon flex items-center gap-2">
        🛍️ OLUDAX
        <span className="block text-[0.55rem] tracking-widest text-gray-400 font-sans font-semibold">CONCEPT</span>
      </Link>
      <Link href="/cart" className="relative w-9 h-9 rounded-full bg-brandbg border border-line flex items-center justify-center">
        🛒
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink text-white text-[0.6rem] rounded-full px-1.5 font-bold">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
