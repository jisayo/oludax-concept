import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import BottomNav from "@/components/BottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0D" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "OLUDAX CONCEPT — Customized Gifts & Branding Store",
    template: "%s | OLUDAX CONCEPT",
  },
  description:
    "Your Number One Gift Plug. Customized frames, merchandise branding, personalized gifts, and celebration souvenirs in Ile-Ife, Akure, and nationwide.",
  keywords: [
    "gifts",
    "personalized gifts",
    "customized gifts",
    "gift customization",
    "custom frames",
    "merchandise branding",
    "Nigeria",
    "Ile-Ife",
    "Akure",
    "Osun",
    "Ondo",
    "OLUDAX",
  ],
  openGraph: {
    title: "OLUDAX CONCEPT — Customized Gifts & Branding Store",
    description:
      "Your Number One Gift Plug. Customized frames, merchandise branding, personalized gifts, and celebration souvenirs in Ile-Ife, Akure, and nationwide.",
    type: "website",
    locale: "en_NG",
    siteName: "OLUDAX CONCEPT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('oludax_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-base text-cloud font-body">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AnnouncementBar />
                <Header />
                <main className="flex-1 pb-16 sm:pb-0">{children}</main>
                <Footer />
                <BottomNav />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
