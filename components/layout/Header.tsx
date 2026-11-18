"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  Package,
  Shield,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Hide header on admin pages
  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Catalog", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "Customize", href: "/customize" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed inset-x-3 top-3 z-50 sm:inset-x-4 sm:top-4 lg:inset-x-8 lg:top-2">
      <div className="mx-auto w-full max-w-7xl">
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 rounded-[18px] border border-black/15 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-md dark:border-white/15 dark:bg-[#141418]/95 sm:gap-3 sm:px-4 sm:py-3 lg:px-6 transition-colors duration-200"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="font-display text-lg font-medium tracking-tight text-cloud sm:text-2xl group-hover:text-accent transition-colors">
              Oludax
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              Studio
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] font-medium transition ${
                    isActive
                      ? "bg-accent/10 text-accent font-semibold dark:bg-white/10"
                      : "text-cloud/80 hover:bg-black/5 hover:text-cloud dark:text-cloud/80 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Centered Glass Search Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass mx-auto hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-black/15 px-4 py-2 sm:flex lg:max-w-lg dark:border-white/15"
          >
            <Search className="h-4 w-4 shrink-0 text-cloud/70" />
            <label htmlFor="nav-search" className="sr-only">
              Search bespoke gifts
            </label>
            <input
              id="nav-search"
              type="text"
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-sm text-cloud font-medium placeholder:text-cloud/60 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Right Action Icons */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent cursor-pointer"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative"
              aria-label="Wishlist"
            >
              <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative"
              aria-label="Cart"
            >
              <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent">
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-mono text-[9px] text-white">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>

            {/* Admin Portal Button (Visible when staff privileges active) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1.5 sm:px-3.5 sm:py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition hover:brightness-110 shadow-sm shrink-0 font-semibold"
                title="Open Merchant Admin Console"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            {/* Account CTA Button */}
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent shrink-0"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass inline-flex h-9 w-9 items-center justify-center rounded-full text-cloud/80 transition hover:bg-black/8 dark:text-cloud/85 dark:hover:bg-[rgba(244,244,242,0.08)] focus-visible:text-accent sm:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="glass mt-2 rounded-[20px] p-4 shadow-xl border border-black/10 dark:border-[rgba(244,244,242,0.08)] space-y-3 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Input for Mobile */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2"
            >
              <Search className="h-4 w-4 text-cloud/50 shrink-0" />
              <input
                type="text"
                placeholder="Search gifts..."
                className="w-full bg-transparent text-xs text-cloud placeholder:text-cloud/40 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud/70 hover:bg-black/5 hover:text-cloud dark:text-cloud/70 dark:hover:bg-white/5 dark:hover:text-cloud transition"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/track"
                className="rounded-xl px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud/70 hover:bg-black/5 hover:text-cloud dark:text-cloud/70 dark:hover:bg-white/5 dark:hover:text-cloud transition flex items-center justify-between"
              >
                <span>Track Order</span>
                <Package className="h-3.5 w-3.5 text-accent" />
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-xl p-3 font-mono text-xs uppercase tracking-[0.14em] bg-pink/15 text-pink border border-pink/30 font-semibold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Merchant Admin Console</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
