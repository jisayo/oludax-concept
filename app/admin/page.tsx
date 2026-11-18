"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  Plus,
  Trash2,
  Shield,
  Layers,
  Lock,
  LogOut,
  KeyRound,
  AlertTriangle,
  ArrowRight,
  Edit3,
  X,
  Save,
  Ban,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  UserCheck,
} from "lucide-react";
import { products, formatPrice, Product } from "@/lib/products";
import { useAuth, Role } from "@/lib/auth-context";
import { ROLES, Permission } from "@/lib/rbac";

const ORDER_STATUSES = [
  "Pending",
  "Payment Confirmed",
  "Processing",
  "Customization in Progress",
  "Ready for Dispatch",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type OrderItemCustomization = {
  customerName?: string;
  message?: string;
  selectedColor?: string;
  selectedDesign?: string;
  selectedSize?: string;
  specialInstructions?: string;
};

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: OrderItemCustomization;
};

type AdminOrder = {
  id: string; // "#OLU-XXXXXX"
  orderRef: string; // "OLU-XXXXXX"
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryNotes?: string;
  cancellationReason?: string;
  adminNotes?: string;
  items: OrderItem[];
  itemsSummary: string;
  customizationDetails: string;
  subtotal: number;
  deliveryFee: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
};

const initialOrders: AdminOrder[] = [
  {
    id: "#OLU-108249",
    orderRef: "OLU-108249",
    customerName: "Adebayo Olawale",
    email: "adebayo@gmail.com",
    phone: "+234 803 123 4567",
    address: "14 Admiralty Way, Lekki Phase 1",
    city: "Lekki",
    state: "Lagos",
    deliveryNotes: "Leave at front desk with security guard",
    adminNotes: "Client requested pink accent wrapping",
    items: [
      {
        productId: "prod-1",
        name: "Personalized Ceramic Mug",
        price: 8000,
        quantity: 1,
        customization: {
          customerName: "Sarah",
          selectedColor: "#FF69B4",
          message: "Happy 30th Birthday! Shine bright always.",
          selectedDesign: "Modern Sans",
        },
      },
    ],
    itemsSummary: "Personalized Ceramic Mug × 1",
    customizationDetails: "Name: 'Sarah' | Colour: Pink | 'Happy 30th Birthday'",
    subtotal: 8000,
    deliveryFee: 3500,
    amount: 11500,
    paymentMethod: "paystack",
    paymentStatus: "paid",
    status: "Customization in Progress",
    date: "Nov 17, 2026",
  },
  {
    id: "#OLU-108248",
    orderRef: "OLU-108248",
    customerName: "Chioma Nwachukwu",
    email: "chioma.n@yahoo.com",
    phone: "+234 802 987 6543",
    address: "22 Gana Street, Maitama",
    city: "Maitama",
    state: "Abuja (FCT)",
    deliveryNotes: "Call when dispatch rider arrives",
    adminNotes: "Express delivery verified",
    items: [
      {
        productId: "prod-2",
        name: "Luxury Fresh Flower Bouquet",
        price: 20000,
        quantity: 1,
        customization: {
          message: "To my queen, forever and always.",
          selectedColor: "#FF0000",
        },
      },
    ],
    itemsSummary: "Luxury Fresh Flower Bouquet × 1",
    customizationDetails: "Ribbon note: 'To my queen, forever and always.'",
    subtotal: 20000,
    deliveryFee: 3500,
    amount: 23500,
    paymentMethod: "paystack",
    paymentStatus: "paid",
    status: "Payment Confirmed",
    date: "Nov 17, 2026",
  },
  {
    id: "#OLU-108247",
    orderRef: "OLU-108247",
    customerName: "Funke Adeleke",
    email: "funke.a@outlook.com",
    phone: "+234 814 555 6677",
    address: "7 Trans Amadi Industrial Layout",
    city: "Port Harcourt",
    state: "Rivers",
    adminNotes: "Embroidery thread: metallic gold",
    items: [
      {
        productId: "prod-4",
        name: "Custom Embroidered Hoodie",
        price: 25000,
        quantity: 1,
        customization: {
          customerName: "F.A.",
          selectedSize: "L",
          selectedColor: "#171016",
        },
      },
    ],
    itemsSummary: "Custom Embroidered Hoodie (Size L) × 1",
    customizationDetails: "Chest initials: 'F.A.' in Gold thread",
    subtotal: 25000,
    deliveryFee: 3500,
    amount: 28500,
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "Ready for Dispatch",
    date: "Nov 16, 2026",
  },
  {
    id: "#OLU-108246",
    orderRef: "OLU-108246",
    customerName: "Babajide Sanwo",
    email: "jide@lagosgov.ng",
    phone: "+234 809 111 2233",
    address: "Alausa Secretariat, Ikeja",
    city: "Ikeja",
    state: "Lagos",
    deliveryNotes: "Deliver directly to administrative office 3",
    adminNotes: "Corporate bulk order discount applied",
    items: [
      {
        productId: "prod-5",
        name: "Executive Corporate Gift Set",
        price: 35000,
        quantity: 5,
        customization: {
          customerName: "State Executives",
          message: "With compliments of the Governor's Office",
        },
      },
    ],
    itemsSummary: "Executive Corporate Gift Set × 5",
    customizationDetails: "Engraved corporate logo + executive names",
    subtotal: 175000,
    deliveryFee: 0,
    amount: 175000,
    paymentMethod: "paystack",
    paymentStatus: "paid",
    status: "Delivered",
    date: "Nov 15, 2026",
  },
];

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isAdmin, role, hasPermission, setRole, login, logout, isLoading } =
    useAuth();

  // Admin Portal Sign-in Gate state
  const [adminEmail, setAdminEmail] = useState("admin@oludaxconcept.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Dashboard Tabs & Data
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "rbac">(
    "overview"
  );
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(initialOrders);
  const [productList, setProductList] = useState<Product[]>(products);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Order for Inspection / Editing
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("Customer requested cancellation via WhatsApp");
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Fetch orders from API on load
  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.orders && data.orders.length > 0) {
          setOrdersList(
            data.orders.map((o: any) => mapApiOrderToAdminOrder(o))
          );
        }
      })
      .catch((err) =>
        console.warn("Admin orders fetch warning, using local state:", err)
      );
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAdminAuthError(null);
    try {
      await login(adminEmail, adminPassword);
      if (
        !adminEmail.toLowerCase().includes("admin") &&
        !adminEmail.toLowerCase().includes("superadmin") &&
        !adminEmail.toLowerCase().includes("manager") &&
        !adminEmail.toLowerCase().includes("artisan") &&
        !adminEmail.toLowerCase().includes("support") &&
        adminPassword !== "admin2026" &&
        adminPassword !== "admin"
      ) {
        setAdminAuthError(
          "Access denied. You must provide authorized administrative credentials."
        );
      }
    } catch {
      setAdminAuthError("Authentication error. Please check your credentials.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleDemoAdminLogin = async (targetRole: Role = "super_admin") => {
    setIsSubmittingAuth(true);
    setAdminAuthError(null);
    try {
      setAdminEmail(`${targetRole}@oludaxconcept.com`);
      setAdminPassword("admin2026");
      await login(`${targetRole}@oludaxconcept.com`, "admin2026", targetRole);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Fast inline status transition
  const updateQuickOrderStatus = async (orderRef: string, newStatus: OrderStatus) => {
    if (!hasPermission("edit_order_status")) {
      showToast("Access Denied: Your role lacks permission to update order status.");
      return;
    }

    setOrdersList((prev) =>
      prev.map((o) => (o.orderRef === orderRef ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef,
          orderStatus: newStatus,
        }),
      });
      showToast(`Order #${orderRef} moved to ${newStatus}`);
    } catch {
      showToast("Sync error. Local state updated.");
    }
  };

  // Full Order Save
  const handleSaveOrderEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    if (!hasPermission("edit_order_details")) {
      showToast("Access Denied: Your role lacks permission to edit order details.");
      return;
    }

    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef: editingOrder.orderRef,
          orderStatus: editingOrder.status,
          paymentStatus: editingOrder.paymentStatus,
          customerName: editingOrder.customerName,
          customerEmail: editingOrder.email,
          customerPhone: editingOrder.phone,
          deliveryAddress: editingOrder.address,
          deliveryCity: editingOrder.city,
          deliveryState: editingOrder.state,
          deliveryNotes: editingOrder.deliveryNotes,
          adminNotes: editingOrder.adminNotes,
          items: editingOrder.items,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        const updated = mapApiOrderToAdminOrder(data.order);
        setOrdersList((prev) =>
          prev.map((o) => (o.orderRef === updated.orderRef ? updated : o))
        );
        showToast(`Order #${editingOrder.orderRef} saved successfully!`);
        setEditingOrder(null);
      } else {
        // Fallback update in state
        setOrdersList((prev) =>
          prev.map((o) => (o.orderRef === editingOrder.orderRef ? editingOrder : o))
        );
        showToast("Changes saved locally.");
        setEditingOrder(null);
      }
    } catch {
      showToast("Server error. Changes updated locally.");
      setOrdersList((prev) =>
        prev.map((o) => (o.orderRef === editingOrder.orderRef ? editingOrder : o))
      );
      setEditingOrder(null);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Cancel Order
  const handleConfirmCancelOrder = async () => {
    if (!cancellingOrder) return;

    if (!hasPermission("cancel_order")) {
      showToast("Access Denied: Your role lacks permission to cancel orders.");
      return;
    }

    const orderRef = cancellingOrder.orderRef;
    setIsSavingOrder(true);

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderRef,
          action: "cancel",
          cancellationReason: cancelReason,
        }),
      });

      const data = await res.json();
      setOrdersList((prev) =>
        prev.map((o) =>
          o.orderRef === orderRef
            ? { ...o, status: "Cancelled", cancellationReason: cancelReason }
            : o
        )
      );

      showToast(`Order #${orderRef} has been cancelled.`);
      setCancellingOrder(null);
      if (editingOrder?.orderRef === orderRef) {
        setEditingOrder(null);
      }
    } catch {
      setOrdersList((prev) =>
        prev.map((o) =>
          o.orderRef === orderRef
            ? { ...o, status: "Cancelled", cancellationReason: cancelReason }
            : o
        )
      );
      showToast(`Order #${orderRef} cancelled locally.`);
      setCancellingOrder(null);
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Permanent Delete Order (Super Admin only)
  const handleDeleteOrder = async (orderRef: string) => {
    if (!hasPermission("delete_order")) {
      showToast("Super Administrator permission required to delete orders.");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete order #${orderRef}? This cannot be undone.`)) {
      return;
    }

    try {
      await fetch(`/api/admin/orders?ref=${encodeURIComponent(orderRef)}`, {
        method: "DELETE",
      });
      setOrdersList((prev) => prev.filter((o) => o.orderRef !== orderRef));
      showToast(`Order #${orderRef} permanently deleted.`);
      if (editingOrder?.orderRef === orderRef) setEditingOrder(null);
    } catch {
      setOrdersList((prev) => prev.filter((o) => o.orderRef !== orderRef));
      showToast("Order removed locally.");
    }
  };

  // Stock toggle for products
  const toggleProductStock = (productId: string) => {
    if (!hasPermission("manage_inventory")) {
      showToast("Access Denied: Inventory management permission required.");
      return;
    }

    setProductList((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              inStock: !p.inStock,
              stockCount: p.inStock ? 0 : 25,
            }
          : p
      )
    );
  };

  // Filtered orders list
  const filteredOrders = ordersList.filter((o) => {
    const matchesFilter =
      selectedStatusFilter === "All" || o.status === selectedStatusFilter;
    const matchesSearch =
      o.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSales = ordersList
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const activeCustomizations = ordersList.filter(
    (o) => o.status === "Customization in Progress"
  ).length;

  const currentRoleDef = ROLES[role] || ROLES.customer;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-pink border-t-transparent animate-spin" />
          <span>Verifying security credentials & RBAC authorization...</span>
        </div>
      </div>
    );
  }

  // Admin Access Gate Screen
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-md w-full mx-auto relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-pink/15 border border-pink/30 text-pink flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink/10">
              <Shield className="w-8 h-8" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 inline-block font-semibold">
              Restricted Staff Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white pt-1">
              OLUDAX CONCEPT
            </h1>
            <p className="font-mono text-xs text-gray-400">
              Role-Based Merchant Management Console
            </p>
          </div>

          {isAuthenticated && !isAdmin && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Customer Account Detected</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                You are signed in as <strong>{user?.email}</strong>. Administrative credentials are required to manage orders, dispatches, and inventory.
              </p>
            </div>
          )}

          <div className="glass rounded-[24px] p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono text-gray-300">
              <Lock className="w-4 h-4 text-pink" />
              <span>Staff Authentication Required</span>
            </div>

            {adminAuthError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-gray-300 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@oludaxconcept.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink"
                />
              </div>

              <div>
                <label className="block text-gray-300 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                  Security Passkey / Password *
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter passkey (e.g. admin2026)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full btn-primary py-3.5 px-6 font-mono text-xs uppercase tracking-wider rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>
                  {isSubmittingAuth ? "Verifying..." : "Unlock Merchant Console"}
                </span>
              </button>
            </form>

            {/* Quick Demo Role Selector */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 text-center">
                RBAC Staging Access (Choose Role to Test):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { role: "super_admin", label: "Super Admin", color: "text-purple-400" },
                  { role: "manager", label: "Operations Mgr", color: "text-blue-400" },
                  { role: "artisan", label: "Artisan Lead", color: "text-amber-400" },
                  { role: "support", label: "Support Desk", color: "text-emerald-400" },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleDemoAdminLogin(item.role as Role)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[11px] font-semibold text-left transition flex items-center justify-between"
                  >
                    <span className={item.color}>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-xs">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>← Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // UNLOCKED ADMIN DASHBOARD
  // ==========================================================================
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass bg-panel/95 text-white font-mono text-xs px-5 py-3 rounded-2xl border border-pink/40 shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-dark-plum border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink flex items-center justify-center font-display font-bold text-white shadow-md shadow-pink/20 shrink-0">
            OC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-white tracking-wide">
                OLUDAX CONCEPT
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentRoleDef.badgeColor} font-semibold`}>
                {currentRoleDef.name}
              </span>
            </div>
            <span className="text-[0.65rem] text-gray-400 font-mono block">
              Merchant Management & Bespoke Studio Hub
            </span>
          </div>
        </div>

        {/* RBAC Role Switcher & User Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Quick RBAC Role Switcher (For live testing different employee perspectives) */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
            <UserCheck className="w-3.5 h-3.5 text-pink shrink-0" />
            <span className="font-mono text-[10px] uppercase text-gray-400 hidden lg:inline">
              Role:
            </span>
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value as Role;
                setRole(newRole);
                showToast(`Switched active RBAC role to: ${ROLES[newRole]?.name}`);
              }}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="super_admin" className="bg-[#1C141E] text-white">
                Super Admin (All Access)
              </option>
              <option value="admin" className="bg-[#1C141E] text-white">
                Store Admin (Orders & Stock)
              </option>
              <option value="manager" className="bg-[#1C141E] text-white">
                Operations Manager
              </option>
              <option value="artisan" className="bg-[#1C141E] text-white">
                Bespoke Artisan Lead
              </option>
              <option value="support" className="bg-[#1C141E] text-white">
                Concierge Support
              </option>
            </select>
          </div>

          <button
            onClick={logout}
            className="text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
            title="Lock and sign out of admin console"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Lock</span>
          </button>

          <Link
            href="/"
            className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors font-mono"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: "overview", label: "Executive Overview", icon: TrendingUp },
            { id: "orders", label: `Orders & Customization (${ordersList.length})`, icon: Package },
            { id: "products", label: "Catalog & Inventory", icon: Layers },
            { id: "rbac", label: "RBAC Permissions Matrix", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-pink text-white shadow-md shadow-pink/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ====================================================================
            TAB 1: EXECUTIVE OVERVIEW
        ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-[20px] p-5 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Total Revenue
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  {formatPrice(totalSales)}
                </p>
                <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                  ↑ 18.4% vs last cycle
                </span>
              </div>

              <div className="glass rounded-[20px] p-5 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Active Customizations
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-pink mt-1">
                  {activeCustomizations}
                </p>
                <span className="text-[10px] font-mono text-gray-400 mt-2 block">
                  Artisan proofing & packaging
                </span>
              </div>

              <div className="glass rounded-[20px] p-5 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Total Orders
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  {ordersList.length}
                </p>
                <span className="text-[10px] font-mono text-gray-400 mt-2 block">
                  {ordersList.filter((o) => o.status === "Cancelled").length} cancelled
                </span>
              </div>

              <div className="glass rounded-[20px] p-5 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Active Staff Role
                </span>
                <p className="font-display text-xl sm:text-2xl font-bold text-white mt-1 truncate">
                  {currentRoleDef.name}
                </p>
                <span className="text-[10px] font-mono text-pink mt-2 block">
                  {currentRoleDef.permissions.length} operational powers granted
                </span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="glass rounded-[24px] p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-display text-lg font-bold text-white">
                  Recent Orders & Customization Production
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="font-mono text-xs text-pink hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View All & Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {ordersList.slice(0, 4).map((order) => (
                  <div
                    key={order.orderRef}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-pink">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClasses(order.status)}`}>
                          {order.status}
                        </span>
                        {order.status === "Cancelled" && order.cancellationReason && (
                          <span className="text-[10px] text-rose-400 truncate max-w-[200px]">
                            ({order.cancellationReason})
                          </span>
                        )}
                      </div>
                      <p className="text-white font-semibold">{order.customerName} • {order.city}, {order.state}</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">{order.itemsSummary}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">
                        {formatPrice(order.amount)}
                      </span>
                      <button
                        onClick={() => setEditingOrder({ ...order })}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pink text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: ORDERS MANAGEMENT & PRODUCTION PIPELINE (EDIT & CANCEL)
        ==================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filter Bar & Search */}
            <div className="glass rounded-[24px] p-5 border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ref (#OLU), name, phone, city, or gift..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 font-mono text-xs">
                  {["All", ...ORDER_STATUSES].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedStatusFilter === st
                          ? "bg-pink text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders List Cards */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="glass rounded-[24px] p-12 text-center border border-white/10 font-mono text-sm text-gray-400">
                  No orders match the current filter or search criteria.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.orderRef}
                    className="glass rounded-[24px] p-5 sm:p-6 border border-white/10 hover:border-pink/30 transition space-y-4"
                  >
                    {/* Top Row: Ref, Status, Pricing & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-pink">{order.id}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadgeClasses(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.date}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Action Buttons with RBAC protection */}
                      <div className="flex items-center gap-2">
                        {/* Manage & Edit Button */}
                        <button
                          onClick={() => setEditingOrder({ ...order })}
                          className="px-3.5 py-1.5 rounded-xl bg-pink text-white hover:brightness-110 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>View & Edit</span>
                        </button>

                        {/* Fast Cancel Button */}
                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                          <button
                            onClick={() => {
                              if (!hasPermission("cancel_order")) {
                                showToast("Access Denied: You do not have permission to cancel orders.");
                                return;
                              }
                              setCancellingOrder(order);
                            }}
                            disabled={!hasPermission("cancel_order")}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition disabled:opacity-30 cursor-pointer"
                            title={!hasPermission("cancel_order") ? "Requires Support, Manager, or Admin role" : "Cancel this order"}
                          >
                            <Ban className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* Super Admin Delete */}
                        {hasPermission("delete_order") && (
                          <button
                            onClick={() => handleDeleteOrder(order.orderRef)}
                            className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition"
                            title="Super Admin: Permanently delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle: Recipient & Destination Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <div>
                        <span className="text-gray-400 uppercase text-[10px] block mb-1">
                          Customer / Recipient
                        </span>
                        <p className="font-semibold text-white">{order.customerName}</p>
                        <p className="text-gray-400 mt-0.5">{order.phone}</p>
                        <p className="text-gray-400">{order.email}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 uppercase text-[10px] block mb-1">
                          Delivery Destination
                        </span>
                        <p className="text-white font-semibold">{order.address}</p>
                        <p className="text-gray-400 mt-0.5">{order.city}, {order.state}</p>
                        {order.deliveryNotes && (
                          <p className="text-amber-300/80 text-[11px] mt-1 italic">
                            &quot;{order.deliveryNotes}&quot;
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="text-gray-400 uppercase text-[10px] block mb-1">
                          Order Financials
                        </span>
                        <p className="text-white font-bold text-sm">
                          {formatPrice(order.amount)}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          Subtotal: {formatPrice(order.subtotal)} | Delivery: {formatPrice(order.deliveryFee)}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5 capitalize">
                          Via: {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Customization & Item Highlights */}
                    <div className="space-y-2 text-xs font-mono">
                      <span className="text-gray-400 uppercase text-[10px] block">
                        Ordered Items & Bespoke Artwork Details
                      </span>
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-white">{it.name}</span>{" "}
                            <span className="text-pink font-semibold">× {it.quantity}</span>
                            {it.customization && (
                              <div className="text-[11px] text-gray-300 mt-1 space-x-2">
                                {it.customization.customerName && (
                                  <span className="bg-pink/15 text-pink px-2 py-0.5 rounded-md border border-pink/20">
                                    Name: &quot;{it.customization.customerName}&quot;
                                  </span>
                                )}
                                {it.customization.selectedColor && (
                                  <span className="bg-white/10 text-gray-200 px-2 py-0.5 rounded-md">
                                    Colour: {it.customization.selectedColor}
                                  </span>
                                )}
                                {it.customization.selectedSize && (
                                  <span className="bg-white/10 text-gray-200 px-2 py-0.5 rounded-md">
                                    Size: {it.customization.selectedSize}
                                  </span>
                                )}
                                {it.customization.message && (
                                  <span className="text-amber-300 block sm:inline mt-1 sm:mt-0">
                                    Note: &quot;{it.customization.message}&quot;
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-white">
                            {formatPrice(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Cancellation Alert if cancelled */}
                    {order.status === "Cancelled" && (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>
                          <strong>Order Cancelled:</strong> {order.cancellationReason || "No reason specified"}
                        </span>
                      </div>
                    )}

                    {/* Quick Stage Progression Buttons */}
                    {order.status !== "Cancelled" && order.status !== "Delivered" && hasPermission("edit_order_status") && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                        <span className="text-gray-400">Quick Advance:</span>
                        {order.status === "Pending" && (
                          <button
                            onClick={() => updateQuickOrderStatus(order.orderRef, "Payment Confirmed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                          >
                            → Confirm Payment
                          </button>
                        )}
                        {order.status === "Payment Confirmed" && (
                          <button
                            onClick={() => updateQuickOrderStatus(order.orderRef, "Customization in Progress")}
                            className="px-2.5 py-1 rounded-lg bg-pink/20 text-pink border border-pink/30 hover:bg-pink/30 transition"
                          >
                            → Start Customization
                          </button>
                        )}
                        {order.status === "Customization in Progress" && (
                          <button
                            onClick={() => updateQuickOrderStatus(order.orderRef, "Ready for Dispatch")}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition"
                          >
                            → Mark Ready for Dispatch
                          </button>
                        )}
                        {order.status === "Ready for Dispatch" && (
                          <button
                            onClick={() => updateQuickOrderStatus(order.orderRef, "Shipped")}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition"
                          >
                            → Dispatch with Courier
                          </button>
                        )}
                        {order.status === "Shipped" && (
                          <button
                            onClick={() => updateQuickOrderStatus(order.orderRef, "Delivered")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                          >
                            → Confirm Doorstep Delivery
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: CATALOG & INVENTORY MANAGEMENT
        ==================================================================== */}
        {activeTab === "products" && (
          <div className="glass rounded-[24px] p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Catalogue & Stock Control
                </h3>
                <p className="font-mono text-xs text-gray-400">
                  Instant stock adjustments for artisan gifting materials
                </p>
              </div>
              <span className="font-mono text-xs text-pink bg-pink/15 px-3 py-1 rounded-full border border-pink/25">
                {productList.length} active products
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productList.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 font-mono text-xs"
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.primaryImage || "/images/products/sample-mug.jpg"}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div>
                      <h4 className="font-bold text-white truncate max-w-[180px]">
                        {prod.name}
                      </h4>
                      <p className="text-pink font-semibold mt-0.5">
                        {formatPrice(prod.price)}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        Category: {prod.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      prod.inStock ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                    }`}>
                      {prod.inStock ? `In Stock (${prod.stockCount})` : "Out of Stock"}
                    </span>

                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      disabled={!hasPermission("manage_inventory")}
                      className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] transition disabled:opacity-30 cursor-pointer"
                    >
                      {prod.inStock ? "Set Out of Stock" : "Restock (+25)"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: RBAC PERMISSIONS MATRIX
        ==================================================================== */}
        {activeTab === "rbac" && (
          <div className="glass rounded-[24px] p-6 border border-white/10 space-y-6">
            <div className="pb-4 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-pink" />
                <span>Role-Based Access Control (RBAC) Hierarchy</span>
              </h3>
              <p className="font-mono text-xs text-gray-400 mt-1">
                Granular operational rights assigned to personnel based on studio specialization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {(Object.keys(ROLES) as Role[])
                .filter((r) => r !== "customer")
                .map((r) => {
                  const def = ROLES[r];
                  const isCurrent = role === r;
                  return (
                    <div
                      key={r}
                      className={`p-5 rounded-2xl border transition space-y-3 ${
                        isCurrent
                          ? "bg-pink/10 border-pink/50 shadow-lg shadow-pink/10"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${def.badgeColor}`}>
                          {def.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-pink animate-pulse">
                            ● Active Role
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        {def.description}
                      </p>

                      <div className="pt-2 border-t border-white/10 space-y-1.5">
                        <span className="text-gray-400 uppercase text-[9px] block">
                          Granted Powers ({def.permissions.length}):
                        </span>
                        <ul className="space-y-1 text-[10px] text-gray-300">
                          {def.permissions.map((p) => (
                            <li key={p} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{formatPermissionName(p)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setRole(r);
                          showToast(`Switched active RBAC role to: ${def.name}`);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition mt-2 cursor-pointer ${
                          isCurrent
                            ? "bg-pink text-white"
                            : "bg-white/10 hover:bg-white/20 text-gray-200"
                        }`}
                      >
                        {isCurrent ? "Currently Active" : "Adopt This Role →"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          MODAL 1: VIEW & EDIT ORDER DETAILS (FULL POWERS)
      ==================================================================== */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="glass bg-[#121216] max-w-2xl w-full rounded-[28px] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#121216] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink/20 border border-pink/30 text-pink flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Edit Order {editingOrder.id}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Placed: {editingOrder.date} • Placed via {editingOrder.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdits} className="space-y-6">
              {/* Status and Payment Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1 font-semibold">
                    Order Status (Production Milestone) *
                  </label>
                  <select
                    disabled={!hasPermission("edit_order_status")}
                    value={editingOrder.status}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C141E] border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-[#1C141E] text-white">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1 font-semibold">
                    Payment Gateway Status *
                  </label>
                  <select
                    disabled={!hasPermission("edit_order_details")}
                    value={editingOrder.paymentStatus}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        paymentStatus: e.target.value as PaymentStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#1C141E] border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  >
                    <option value="paid" className="bg-[#1C141E] text-white">
                      Paid (Authorized)
                    </option>
                    <option value="pending" className="bg-[#1C141E] text-white">
                      Pending Authorization
                    </option>
                    <option value="refunded" className="bg-[#1C141E] text-white">
                      Refunded to Customer
                    </option>
                    <option value="failed" className="bg-[#1C141E] text-white">
                      Failed / Rejected
                    </option>
                  </select>
                </div>
              </div>

              {/* Recipient Details (Editable for courier dispatch) */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block border-b border-white/10 pb-1">
                  Recipient Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!hasPermission("edit_order_details")}
                      value={editingOrder.customerName}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, customerName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      Phone Number (Courier Dispatch)
                    </label>
                    <input
                      type="tel"
                      required
                      disabled={!hasPermission("edit_order_details")}
                      value={editingOrder.phone}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!hasPermission("edit_order_details")}
                    value={editingOrder.email}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Delivery Address (Editable) */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block border-b border-white/10 pb-1">
                  Delivery Destination
                </span>

                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!hasPermission("edit_order_details")}
                    value={editingOrder.address}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!hasPermission("edit_order_details")}
                      value={editingOrder.city}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, city: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!hasPermission("edit_order_details")}
                      value={editingOrder.state}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, state: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Delivery Instructions / Notes
                  </label>
                  <input
                    type="text"
                    disabled={!hasPermission("edit_order_details")}
                    value={editingOrder.deliveryNotes || ""}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, deliveryNotes: e.target.value })
                    }
                    placeholder="e.g. Call before delivery, gate code..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Bespoke Customization Specs (Editable by Artisan & Admin) */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block border-b border-white/10 pb-1">
                  Artisan Personalization Specs
                </span>

                {editingOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                    <p className="font-semibold text-white">
                      {it.name} (Qty: {it.quantity})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">
                          Engraved / Printed Name
                        </label>
                        <input
                          type="text"
                          disabled={!hasPermission("edit_customization")}
                          value={it.customization?.customerName || ""}
                          onChange={(e) => {
                            const newItems = [...editingOrder.items];
                            newItems[idx] = {
                              ...it,
                              customization: {
                                ...it.customization,
                                customerName: e.target.value,
                              },
                            };
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          placeholder="No custom name"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C141E] border border-white/10 text-white disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-gray-400 mb-1">
                          Greeting Card / Ribbon Message
                        </label>
                        <input
                          type="text"
                          disabled={!hasPermission("edit_customization")}
                          value={it.customization?.message || ""}
                          onChange={(e) => {
                            const newItems = [...editingOrder.items];
                            newItems[idx] = {
                              ...it,
                              customization: {
                                ...it.customization,
                                message: e.target.value,
                              },
                            };
                            setEditingOrder({ ...editingOrder, items: newItems });
                          }}
                          placeholder="No personal message"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C141E] border border-white/10 text-white disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Internal Staff Notes */}
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1 font-semibold">
                  Internal Staff / Concierge Notes
                </label>
                <textarea
                  rows={2}
                  value={editingOrder.adminNotes || ""}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, adminNotes: e.target.value })
                  }
                  placeholder="Private internal notes (e.g. customer verified gold monogram thread via WhatsApp call)..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {editingOrder.status !== "Cancelled" && hasPermission("cancel_order") && (
                    <button
                      type="button"
                      onClick={() => setCancellingOrder(editingOrder)}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingOrder}
                    className="btn-primary py-2.5 px-6 font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingOrder ? "Saving..." : "Save Order Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: CONFIRM ORDER CANCELLATION DIALOG
      ==================================================================== */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#161217] max-w-md w-full rounded-[24px] border border-rose-500/30 p-6 space-y-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Cancel Order {cancellingOrder.id}?
                </h3>
                <p className="text-[11px] text-gray-400">
                  Customer: {cancellingOrder.customerName}
                </p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed text-[11px]">
              This will update the order status to <strong>Cancelled</strong>, halt artisan production queue, and log the reason in the customer tracking timeline.
            </p>

            <div>
              <label className="block text-gray-400 uppercase text-[10px] mb-1.5 font-semibold">
                Select Cancellation Reason *
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1C141E] border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="Customer requested cancellation via WhatsApp">
                  Customer requested cancellation via WhatsApp
                </option>
                <option value="Customer requested cancellation via Email/Phone">
                  Customer requested cancellation via Email/Phone
                </option>
                <option value="Artisan materials or customized stock unavailable">
                  Artisan materials or customized stock unavailable
                </option>
                <option value="Incomplete or unverified destination address in Nigeria">
                  Incomplete or unverified destination address in Nigeria
                </option>
                <option value="Payment verification failed or flagged for dispute">
                  Payment verification failed or flagged for dispute
                </option>
                <option value="Duplicate order submitted by customer">
                  Duplicate order submitted by customer
                </option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                disabled={isSavingOrder}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{isSavingOrder ? "Processing..." : "Confirm Cancellation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

function mapApiOrderToAdminOrder(o: any): AdminOrder {
  const items: OrderItem[] = (o.items || []).map((it: any) => ({
    productId: it.productId || it.id || "item-1",
    name: it.name || "Bespoke Gift",
    price: Number(it.price || 0),
    quantity: Number(it.quantity || 1),
    customization: it.customization || undefined,
  }));

  const itemsSummary = items.map((i) => `${i.name} × ${i.quantity}`).join(", ");
  const customParts: string[] = [];
  items.forEach((it) => {
    if (it.customization?.customerName)
      customParts.push(`Name: '${it.customization.customerName}'`);
    if (it.customization?.selectedColor)
      customParts.push(`Colour: ${it.customization.selectedColor}`);
    if (it.customization?.message)
      customParts.push(`'${it.customization.message}'`);
  });

  return {
    id: `#${o.orderRef}`,
    orderRef: o.orderRef,
    customerName: o.customerName,
    email: o.customerEmail,
    phone: o.customerPhone || "+234 800 000 0000",
    address: o.deliveryAddress,
    city: o.deliveryCity,
    state: o.deliveryState,
    deliveryNotes: o.deliveryNotes,
    cancellationReason: o.cancellationReason,
    adminNotes: o.adminNotes,
    items,
    itemsSummary: itemsSummary || "Bespoke gift order",
    customizationDetails: customParts.join(" | ") || "Standard catalog order",
    subtotal: Number(o.subtotal || o.total),
    deliveryFee: Number(o.deliveryFee || 0),
    amount: Number(o.total),
    paymentMethod: o.paymentMethod || "paystack",
    paymentStatus: o.paymentStatus || "pending",
    status: o.orderStatus as OrderStatus,
    date: new Date(o.createdAt || Date.now()).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function getStatusBadgeClasses(status: OrderStatus): string {
  switch (status) {
    case "Delivered":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Shipped":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "Ready for Dispatch":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "Customization in Progress":
      return "bg-pink/15 text-pink border-pink/30";
    case "Payment Confirmed":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Cancelled":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    default:
      return "bg-white/10 text-gray-300 border-white/20";
  }
}

function formatPermissionName(p: Permission): string {
  switch (p) {
    case "view_admin_panel":
      return "Access staff merchant portal";
    case "view_orders":
      return "View orders & customer profiles";
    case "edit_order_status":
      return "Advance production milestones";
    case "edit_order_details":
      return "Edit addresses, phones & recipient info";
    case "cancel_order":
      return "Cancel orders & record reasons";
    case "delete_order":
      return "Permanently purge records";
    case "edit_customization":
      return "Edit artwork, text & engraved names";
    case "manage_inventory":
      return "Update catalog stock quantities";
    case "view_financials":
      return "Inspect revenue & transaction totals";
    case "manage_staff":
      return "Assign & modify RBAC permissions";
    default:
      return p;
  }
}
