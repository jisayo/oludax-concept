"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = searchParams.get("redirect") || "/shop";

  const { user, isAuthenticated, isAdmin, login, register, logout, updateProfile } =
    useAuth();
  const { count: wishlistCount } = useWishlist();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">(
    "orders"
  );
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let isStaff = false;
      if (authMode === "login") {
        await login(email, password);
        const lower = email.toLowerCase();
        if (
          lower.includes("admin") ||
          lower.includes("superadmin") ||
          lower.includes("manager") ||
          lower.includes("artisan") ||
          lower.includes("support") ||
          password === "admin2026" ||
          password === "admin"
        ) {
          isStaff = true;
        }
      } else {
        await register(name, email, password);
      }

      // If staff member, route directly to the admin portal
      // If customer, navigate seamlessly behind the scenes to the catalogue/destination
      if (isStaff) {
        router.push("/admin");
      } else {
        router.push(destination);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: profileName, phone: profilePhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Glass Banner */}
        <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] mb-8">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">My Account</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Customer Account
              </h1>
              <p className="text-cloud/60 text-xs sm:text-sm mt-1">
                {isAuthenticated
                  ? `Welcome back, ${user?.name || "Customer"}. Manage your orders and preferences.`
                  : "Sign in to track orders, save delivery destinations, and access your wishlist."}
              </p>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-full bg-pink text-white font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1.5 font-semibold hover:brightness-110 shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="btn-primary py-2 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Browse Catalogue</span>
                </Link>
                <button
                  onClick={logout}
                  className="glass rounded-full px-4 py-2 font-mono text-xs text-accent hover:brightness-110 flex items-center gap-1.5 border border-accent/25 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {isAuthenticated && user ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar User Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass rounded-[24px] p-6 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  {user.name[0]?.toUpperCase() || "U"}
                </div>
                <h2 className="font-display font-medium text-lg text-cloud">
                  {user.name}
                </h2>
                <p className="font-mono text-xs text-cloud/60">{user.email}</p>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] font-mono">
                  <Link
                    href="/wishlist"
                    className="p-3 glass rounded-xl hover:border-accent/40 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-accent mx-auto mb-1 fill-accent" />
                    <span className="text-xs font-semibold text-cloud block">
                      {wishlistCount}
                    </span>
                    <span className="text-[10px] text-cloud/60">Wishlist</span>
                  </Link>
                  <Link
                    href="/track"
                    className="p-3 glass rounded-xl hover:border-accent/40 transition-colors"
                  >
                    <Package className="w-4 h-4 text-accent mx-auto mb-1" />
                    <span className="text-xs font-semibold text-cloud block">1</span>
                    <span className="text-[10px] text-cloud/60">Active Order</span>
                  </Link>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="glass rounded-[20px] p-2 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-1">
                {[
                  { id: "orders", label: "My Orders & History", icon: Package },
                  { id: "addresses", label: "Saved Addresses", icon: MapPin },
                  { id: "profile", label: "Profile Settings", icon: User },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs transition-all text-left cursor-pointer ${
                        isActive
                          ? "bg-accent text-white font-semibold"
                          : "text-cloud/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-cloud font-medium"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Tab Content */}
            <div className="lg:col-span-8">
              {activeTab === "orders" && (
                <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                    <h3 className="font-display font-medium text-base text-cloud">
                      Order History
                    </h3>
                    <Link
                      href="/shop"
                      className="font-mono text-xs uppercase tracking-wider text-accent hover:brightness-110 font-semibold"
                    >
                      Browse Catalogue →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {/* Demo Order Card */}
                    <div className="glass rounded-2xl p-5 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                        <div>
                          <span className="font-mono font-bold text-sm text-accent">
                            #OLU-108249
                          </span>
                          <span className="font-mono text-[11px] text-cloud/60 block">
                            Nov 17, 2026 · 1 item
                          </span>
                        </div>
                        <span className="glass rounded-full px-3 py-1 font-mono text-[10px] text-accent border border-accent/25 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3 h-3" /> Customization in Progress
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          <p className="font-semibold text-cloud">
                            Personalized Ceramic Mug × 1
                          </p>
                          <p className="text-[11px] text-cloud/60">
                            Custom: &quot;Sarah&quot; · Colour: Pink
                          </p>
                        </div>
                        <span className="font-bold text-cloud">₦11,500</span>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Link
                          href="/track?ref=OLU-108249"
                          className="font-mono text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Track Milestone Status</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
                  <h3 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                    Saved Delivery Addresses
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass rounded-2xl p-4 border border-accent/30 relative">
                      <span className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-wider bg-accent/15 text-accent px-2 py-0.5 rounded-full font-semibold">
                        Default
                      </span>
                      <h4 className="font-semibold text-xs font-mono text-cloud mb-1">
                        Primary Residence
                      </h4>
                      <p className="text-xs text-cloud/70 leading-relaxed font-mono">
                        14 Admiralty Way, Lekki Phase 1<br />
                        Lagos, Nigeria
                      </p>
                      <p className="text-xs text-cloud/60 font-mono mt-2">
                        +234 (0) 803 123 4567
                      </p>
                    </div>

                    <div className="glass rounded-2xl p-4 border border-dashed border-black/15 dark:border-white/15 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-accent/40 transition-colors">
                      <MapPin className="w-6 h-6 text-cloud/40 mb-2" />
                      <span className="font-mono text-xs text-accent font-semibold">
                        + Add New Delivery Address
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
                  <h3 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                    Personal Information
                  </h3>

                  {profileSaved && (
                    <div className="glass rounded-xl p-3 border border-emerald-500/30 text-emerald-500 font-mono text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud font-medium focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud/60 cursor-not-allowed font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+234 (0) 800 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud font-medium focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary py-2.5 px-6 font-mono text-xs uppercase tracking-wider mt-2 font-semibold"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Sign In / Register Card */
          <div className="max-w-md mx-auto glass rounded-[28px] p-8 sm:p-10 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 mb-8 border border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider rounded-xl transition ${
                  authMode === "login"
                    ? "bg-accent text-white font-semibold"
                    : "text-cloud/80 hover:text-cloud font-medium"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider rounded-xl transition ${
                  authMode === "register"
                    ? "bg-accent text-white font-semibold"
                    : "text-cloud/80 hover:text-cloud font-medium"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="font-display font-medium text-2xl text-cloud">
                {authMode === "login" ? "Welcome Back" : "Join Oludax Concept"}
              </h2>
              <p className="text-xs text-cloud/70 mt-1">
                {authMode === "login"
                  ? "Access your saved addresses, orders, and personalized wishlist."
                  : "Enjoy bespoke recommendations and live tracking."}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud font-medium focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud font-medium focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/70 block mb-1 font-semibold">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud font-medium focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 font-mono text-xs uppercase tracking-[0.14em] mt-2 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? "Authenticating..."
                    : authMode === "login"
                    ? "Sign In"
                    : "Create Account"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] text-center">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={async () => {
                  setEmail("customer@oludaxconcept.com");
                  setPassword("password123");
                  setIsSubmitting(true);
                  try {
                    await login("customer@oludaxconcept.com", "password123");
                    router.push(destination);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="font-mono text-xs text-accent hover:brightness-110 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Quick Demo Sign In →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base pt-28 text-center text-cloud font-mono text-xs">
          Loading account...
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
