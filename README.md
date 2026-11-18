# OLUDAX CONCEPT — Bespoke Luxury Gifting Studio

A full-stack, enterprise-grade e-commerce web platform for **OLUDAX CONCEPT** — Nigeria's premier bespoke gifting studio and personalized luxury lifestyle brand.

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL**, and **Paystack Payments**, featuring an editorial Obsidian & Off-White design system, WCAG AAA accessibility, role-based access control (RBAC), and dual-mode resilient persistence.

---

## Highlights & Capabilities

- **Curated Editorial Aesthetic**: Obsidian (`#0F0F11`), Off-White (`#FAF8F5`), and Burnished Gold (`#C8A97E`) styling inspired by high-fashion ateliers.
- **High-Contrast Dark & Light Modes**: Elevated contrast ratios across both modes meeting WCAG AAA compliance standards.
- **Bespoke Personalization Studio**: Live preview of custom text engraving, monogramming, and high-resolution artwork uploads.
- **Role-Based Access Control (RBAC)**: 6 granular roles (`super_admin`, `admin`, `manager`, `artisan`, `support`, `customer`) with strict permission checks and a staff administration suite.
- **Seamless Checkout & Nigerian Naira (`₦`) Native**: Full Paystack integration (Inline Pop & Server-to-Server HMAC SHA-512 Webhooks) with standard shipping rules (₦3,500 standard, free shipping over ₦50,000).
- **Dual-Mode Resilient Database**: Direct Supabase PostgreSQL connectivity with automatic failover to an in-memory transactional store for effortless zero-config local testing.
- **Live Order Tracking**: Dynamic 4-stage tracking timeline (`Received` → `In Production` → `Dispatched` → `Delivered`) via `#OLU-XXXXXX` references.

---

## Route Overview

| Route | Description |
| :--- | :--- |
| `/` | Editorial landing page with hero showcase, featured collections, bestsellers, artisan process, testimonials, and newsletter |
| `/shop` | Full catalog with real-time text search, category filters, sorting, stock badges, and quick-add stepper |
| `/categories` | Visual collection index showcasing Bespoke Boxes, Monogrammed Leather, Executive Pens, Barware, and more |
| `/product/[id]` | Product detail view with gallery, live customization studio, stock indicator, related products, and reviews |
| `/customize` | Dedicated custom commission studio for bespoke engravings, special materials, and file uploads |
| `/wishlist` | Saved items drawer with direct add-to-cart migration |
| `/cart` | Dynamic cart drawer and page with promo codes (`OLUDAX10`, `LUXURY5`) and free shipping threshold tracker |
| `/checkout` | Comprehensive checkout with Nigerian states/cities, shipping calculation, and Paystack payment gateway |
| `/checkout/success` | Order confirmation receipt with tracking reference, order breakdown, and print capability |
| `/track` | Public order lookup and tracking timeline with real-time status visualization |
| `/account` | Customer account portal with auth (Sign In / Register / Live Role Switcher), order history, and addresses |
| `/admin` | Secure staff dashboard with KPI cards, order filter/search, status transitions, modal editor, and cancellation manager |
| `/about` | Brand heritage, artisan craftsmanship story, and mission |
| `/contact` | Concierge inquiries form with backend message capture and studio details |
| `/faq` | Frequently asked questions regarding shipping, personalization, corporate gifting, and care |

---

## Backend API Endpoints

| Endpoint | Method(s) | Description |
| :--- | :--- | :--- |
| `/api/products` | `GET` | Catalog search and category filtering |
| `/api/products/[id]` | `GET` | Individual product details lookup |
| `/api/categories` | `GET` | Complete category taxonomy |
| `/api/orders` | `GET`, `POST` | Order query and checkout order creation (`#OLU-XXXXXX`) |
| `/api/orders/[ref]` | `GET` | Public tracking query by order reference |
| `/api/admin/orders` | `GET`, `PATCH`, `DELETE` | Staff order management, inline edits, and cancellations with reason tracking |
| `/api/paystack/initialize` | `POST` | Paystack payment initialization with NGN kobo conversion |
| `/api/paystack/verify` | `GET` | Payment verification callback |
| `/api/paystack/webhook` | `POST` | HMAC SHA-512 webhook handler for asynchronous payment confirmations |
| `/api/customization/upload` | `POST` | Artwork and monogram image file upload handler |
| `/api/contact` | `POST` | Concierge inquiry message submission |

---

## Role-Based Access Control (RBAC)

The platform includes a role-based authorization system defined in `lib/rbac.ts` and managed via `lib/auth-context.tsx`.

### Roles & Permissions Matrix

| Permission | Super Admin | Admin | Manager | Artisan | Support | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `manage_orders` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `edit_order` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `cancel_order` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `delete_order` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `view_admin` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `manage_products` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `update_production`| ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `view_reports` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `manage_users` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `manage_settings` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Default Staff Credentials (Demo & Local Testing)

Navigate to `/admin` or access via the floating navigation header:

- **Admin Account**: `admin@oludaxconcept.com`
- **Password**: `admin2026`
- **Super Admin Account**: `superadmin@oludaxconcept.com`
- **Password**: `super2026`

*You can also switch roles live at any time from the `/account` profile page for testing customer vs. staff workflows.*

---

## Database Architecture & SQL Migrations

The platform stores data in PostgreSQL via Supabase, with automatic schema definitions and seed data located in the `supabase/` directory:

1. **Schema Migration**: [`supabase/schema.sql`](supabase/schema.sql)
   - Tables: `categories`, `products`, `orders`, `order_items`, `contact_messages`, `customization_uploads`.
   - Automated triggers for `updated_at` timestamps.
   - Row Level Security (RLS) policies allowing public product reading and authenticated/service-role order operations.
   - Admin audit fields: `cancellation_reason`, `admin_notes`, and `customization_details`.

2. **Catalog Seed**: [`supabase/seed.sql`](supabase/seed.sql)
   - Pre-populates 10 luxury categories (Executive Gifts, Bespoke Hampers, Monogrammed Leather, Keepsakes, etc.).
   - Pre-populates 12 artisanal products with rich descriptions, pricing, dimensions, and high-resolution photography.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+
- **npm** or **pnpm** or **yarn**

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/oludax-concept.git
cd oludax-concept
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: The application is architected to run immediately even without credentials. It defaults to an in-memory transactional database and mock Paystack test mode so you can demo all 15 routes out-of-the-box.

### 3. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Verify

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your `oludax-concept` repository.
4. Add the environment variables from your `.env.local`.
5. Click **Deploy**.

### Paystack Webhook Configuration

In your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer):
- Set the **Webhook URL** to: `https://your-domain.com/api/paystack/webhook`

---

## License

Private repository. Copyright © 2026 **OLUDAX CONCEPT**. All rights reserved.
