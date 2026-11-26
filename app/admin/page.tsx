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
  Settings,
  Activity,
  UserPlus,
} from "lucide-react";
import { products, categories as defaultCategories, formatPrice, Product } from "@/lib/products";
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

const initialOrders: AdminOrder[] = [];

export default function AdminDashboardPage() {
  const {
    user,
    isAuthenticated,
    isAdmin,
    role,
    hasPermission,
    logout,
    refreshSession,
    isLoading,
  } = useAuth();

  // Admin Portal Sign-in Gate state
  const [adminEmail, setAdminEmail] = useState("preciousoludare23@gmail.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Dashboard Tabs & Data
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "customers" | "staff" | "audit"
  >("overview");
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(initialOrders);
  const [productList, setProductList] = useState<Product[]>(products);
  const [productSearch, setProductSearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Product Add / Edit Modal state
  const [editingProductModal, setEditingProductModal] = useState<{
    mode: "create" | "edit";
    id?: string;
    name: string;
    price: string;
    compareAtPrice: string;
    category: string;
    description: string;
    primaryImage: string;
    stockCount: string;
    inStock: boolean;
    featured: boolean;
    designsText: string;
  } | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Customers Directory state
  const [customersList, setCustomersList] = useState<
    Array<{
      email: string;
      name: string;
      phone: string;
      city: string;
      state: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: string;
      suspended: boolean;
    }>
  >([]);
  const [customerSearch, setCustomerSearch] = useState("");

  // Staff & Custom Permissions state
  const [staffList, setStaffList] = useState<
    Array<{
      id: string;
      email: string;
      name: string;
      role: Exclude<Role, "customer">;
      active: boolean;
      isProtectedOwner?: boolean;
      customGrant: Permission[];
      customRevoke: Permission[];
    }>
  >([]);
  const [newStaffModal, setNewStaffModal] = useState<{
    name: string;
    email: string;
    password: string;
    role: "admin" | "manager" | "support";
  } | null>(null);
  const [editingStaffPerms, setEditingStaffPerms] = useState<{
    id: string;
    name: string;
    email: string;
    role: Exclude<Role, "customer">;
    customGrant: Permission[];
    customRevoke: Permission[];
  } | null>(null);
  const [isSavingStaff, setIsSavingStaff] = useState(false);

  // Audit Log & System Settings state
  const [auditLogsList, setAuditLogsList] = useState<
    Array<{
      id: string;
      timestamp: string;
      actorEmail: string;
      actorRole: Role;
      action: string;
      target: string;
      details: string;
    }>
  >([]);
  const [systemSettings, setSystemSettings] = useState({
    storeName: "OLUDAX CONCEPT",
    whatsappNumber: "2348144412006",
    dispatchHub: "Ile-Ife, Osun State (Dispatches to Akure & Nationwide)",
    freeDeliveryThreshold: 50000,
    standardShippingFee: 3500,
    acceptingOrders: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Active Order for Inspection / Editing
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<AdminOrder | null>(
    null,
  );
  const [cancelReason, setCancelReason] = useState(
    "Customer requested cancellation via WhatsApp",
  );
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const getAdminHeaders = () => {
    return {
      "Content-Type": "application/json",
    };
  };

  const loadAdminResources = () => {
    fetch("/api/admin/orders", { headers: getAdminHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.orders)) {
          setOrdersList(data.orders.map((o: any) => mapApiOrderToAdminOrder(o)));
        }
      })
      .catch(() => {});

    fetch("/api/admin/products", { headers: getAdminHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products)) {
          setProductList(data.products);
        }
      })
      .catch(() => {});

    fetch("/api/admin/customers", { headers: getAdminHeaders() })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.customers)) {
          setCustomersList(data.customers);
        }
      })
      .catch(() => {});

    if (role === "super_admin" || role === "admin") {
      fetch("/api/admin/staff", { headers: getAdminHeaders() })
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.staff)) {
            setStaffList(data.staff);
          }
        })
        .catch(() => {});
    }

    if (role === "super_admin") {
      fetch("/api/admin/audit", { headers: getAdminHeaders() })
        .then((r) => r.json())
        .then((data) => {
          if (data?.success) {
            if (Array.isArray(data.logs)) setAuditLogsList(data.logs);
            if (data.settings) setSystemSettings(data.settings);
          }
        })
        .catch(() => {});
    }
  };

  // Fetch admin resources on load and upon auth/role change
  useEffect(() => {
    if (!isAdmin) return;
    loadAdminResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, role]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAdminAuthError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAdminAuthError(data.error || "Access denied. Invalid credentials.");
        return;
      }

      await refreshSession();
      showToast(`Authenticated as ${data.user?.name || "Administrator"}`);

      // Immediately fetch live orders upon successful login
      try {
        const ordersRes = await fetch("/api/admin/orders", {
          headers: getAdminHeaders(),
        });
        const ordersData = await ordersRes.json();
        if (
          ordersData &&
          ordersData.success &&
          Array.isArray(ordersData.orders) &&
          ordersData.orders.length > 0
        ) {
          setOrdersList(
            ordersData.orders.map((o: any) => mapApiOrderToAdminOrder(o)),
          );
        }
      } catch {}
    } catch {
      setAdminAuthError("Authentication network error. Please try again.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Fast inline status transition
  const updateQuickOrderStatus = async (
    orderRef: string,
    newStatus: OrderStatus,
  ) => {
    if (!hasPermission("edit_order_status")) {
      showToast(
        "Access Denied: Your role lacks permission to update order status.",
      );
      return;
    }

    setOrdersList((prev) =>
      prev.map((o) =>
        o.orderRef === orderRef ? { ...o, status: newStatus } : o,
      ),
    );

    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: getAdminHeaders(),
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
      showToast(
        "Access Denied: Your role lacks permission to edit order details.",
      );
      return;
    }

    setIsSavingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: getAdminHeaders(),
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
          prev.map((o) => (o.orderRef === updated.orderRef ? updated : o)),
        );
        showToast(`Order #${editingOrder.orderRef} saved successfully!`);
        setEditingOrder(null);
      } else {
        // Fallback update in state
        setOrdersList((prev) =>
          prev.map((o) =>
            o.orderRef === editingOrder.orderRef ? editingOrder : o,
          ),
        );
        showToast("Changes saved locally.");
        setEditingOrder(null);
      }
    } catch {
      showToast("Server error. Changes updated locally.");
      setOrdersList((prev) =>
        prev.map((o) =>
          o.orderRef === editingOrder.orderRef ? editingOrder : o,
        ),
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
        headers: getAdminHeaders(),
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
            : o,
        ),
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
            : o,
        ),
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

    if (
      !confirm(
        `Are you sure you want to permanently delete order #${orderRef}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await fetch(`/api/admin/orders?ref=${encodeURIComponent(orderRef)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      setOrdersList((prev) => prev.filter((o) => o.orderRef !== orderRef));
      showToast(`Order #${orderRef} permanently deleted.`);
      if (editingOrder?.orderRef === orderRef) setEditingOrder(null);
    } catch {
      setOrdersList((prev) => prev.filter((o) => o.orderRef !== orderRef));
      showToast("Order removed locally.");
    }
  };

  // Persistent Stock toggle for products
  const toggleProductStock = async (prod: Product) => {
    if (!hasPermission("manage_inventory")) {
      showToast("Access Denied: Inventory management permission required.");
      return;
    }

    const nextInStock = !prod.inStock;
    const nextCount = nextInStock ? Math.max(prod.stockCount || 0, 25) : 0;

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: prod.id,
          inStock: nextInStock,
          stockCount: nextCount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update stock.");
        return;
      }
      setProductList((prev) =>
        prev.map((p) => (p.id === prod.id ? data.product : p)),
      );
      showToast(`${prod.name} marked ${nextInStock ? "In Stock" : "Out of Stock"}.`);
      if (role === "super_admin") loadAdminResources();
    } catch {
      showToast("Network error updating product stock.");
    }
  };

  // Create or Update product (goods)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductModal) return;
    setIsSavingProduct(true);

    const designs = editingProductModal.designsText
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const isCreate = editingProductModal.mode === "create";
      const res = await fetch("/api/admin/products", {
        method: isCreate ? "POST" : "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: editingProductModal.id,
          name: editingProductModal.name,
          price: Number(editingProductModal.price),
          compareAtPrice: editingProductModal.compareAtPrice
            ? Number(editingProductModal.compareAtPrice)
            : undefined,
          category: editingProductModal.category,
          description: editingProductModal.description,
          primaryImage: editingProductModal.primaryImage,
          stockCount: Number(editingProductModal.stockCount || 0),
          inStock: editingProductModal.inStock,
          featured: editingProductModal.featured,
          designs,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to save product.");
        return;
      }

      if (isCreate) {
        setProductList((prev) => [data.product, ...prev]);
        showToast(`Added "${data.product.name}" to catalog.`);
      } else {
        setProductList((prev) =>
          prev.map((p) => (p.id === data.product.id ? data.product : p)),
        );
        showToast(`Updated "${data.product.name}".`);
      }
      setEditingProductModal(null);
      if (role === "super_admin") loadAdminResources();
    } catch {
      showToast("Network error saving product.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete product (goods)
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!hasPermission("manage_inventory")) {
      showToast("Access Denied: Inventory permission required.");
      return;
    }
    if (!confirm(`Delete "${name}" permanently from the store catalog?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to delete product.");
        return;
      }
      setProductList((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted "${name}".`);
      if (role === "super_admin") loadAdminResources();
    } catch {
      showToast("Network error deleting product.");
    }
  };

  // Staff CRUD handlers (Super Admin only)
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffModal) return;
    setIsSavingStaff(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(newStaffModal),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to create staff account.");
        return;
      }
      setStaffList((prev) => [...prev, data.staff]);
      setNewStaffModal(null);
      showToast(`Staff account created for ${data.staff.email}.`);
      loadAdminResources();
    } catch {
      showToast("Network error creating staff account.");
    } finally {
      setIsSavingStaff(false);
    }
  };

  const handleUpdateStaffRole = async (
    id: string,
    newRole: "admin" | "manager" | "support",
  ) => {
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update role.");
        return;
      }
      setStaffList((prev) => prev.map((s) => (s.id === id ? data.staff : s)));
      showToast(`Updated role to ${ROLES[newRole].name}.`);
      loadAdminResources();
    } catch {
      showToast("Network error updating staff role.");
    }
  };

  const handleToggleStaffActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ id, active }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update staff status.");
        return;
      }
      setStaffList((prev) => prev.map((s) => (s.id === id ? data.staff : s)));
      showToast(active ? "Staff account reactivated." : "Staff account suspended.");
      loadAdminResources();
    } catch {
      showToast("Network error updating staff status.");
    }
  };

  const handleSaveStaffPermissions = async () => {
    if (!editingStaffPerms) return;
    setIsSavingStaff(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          id: editingStaffPerms.id,
          customGrant: editingStaffPerms.customGrant,
          customRevoke: editingStaffPerms.customRevoke,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update custom permissions.");
        return;
      }
      setStaffList((prev) =>
        prev.map((s) => (s.id === editingStaffPerms.id ? data.staff : s)),
      );
      setEditingStaffPerms(null);
      showToast("Custom permissions updated.");
      loadAdminResources();
    } catch {
      showToast("Network error saving permissions.");
    } finally {
      setIsSavingStaff(false);
    }
  };

  const handleDeleteStaff = async (id: string, email: string) => {
    if (!confirm(`Permanently delete staff account ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to delete staff.");
        return;
      }
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Deleted staff account ${email}.`);
      loadAdminResources();
    } catch {
      showToast("Network error deleting staff.");
    }
  };

  const handleToggleCustomerSuspended = async (
    email: string,
    suspended: boolean,
  ) => {
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ email, suspended }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update customer.");
        return;
      }
      setCustomersList((prev) =>
        prev.map((c) => (c.email === email ? { ...c, suspended } : c)),
      );
      showToast(
        suspended
          ? `Suspended customer ${email}.`
          : `Reactivated customer ${email}.`,
      );
      if (role === "super_admin") loadAdminResources();
    } catch {
      showToast("Network error updating customer.");
    }
  };

  const handleSaveSystemSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/audit", {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify(systemSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to save settings.");
        return;
      }
      setSystemSettings(data.settings);
      showToast("System settings saved.");
      loadAdminResources();
    } catch {
      showToast("Network error saving settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered orders list (defensive & null-safe)
  const filteredOrders = (ordersList || []).filter((o) => {
    if (!o) return false;
    const matchesFilter =
      selectedStatusFilter === "All" || o.status === selectedStatusFilter;
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return matchesFilter;
    const matchesSearch =
      (o.orderRef || "").toLowerCase().includes(q) ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q) ||
      (o.phone || "").toLowerCase().includes(q) ||
      (o.city || "").toLowerCase().includes(q) ||
      (o.state || "").toLowerCase().includes(q) ||
      (o.itemsSummary || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalSales = ordersList
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const activeProcessing = ordersList.filter(
    (o) => o.status === "Processing" || o.status === "Payment Confirmed",
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
                You are signed in as <strong>{user?.email}</strong>.
                Administrative credentials are required to manage orders,
                dispatches, and inventory.
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

            <form
              onSubmit={handleAdminLogin}
              className="space-y-4 font-mono text-xs"
            >
              <div>
                <label className="block text-gray-300 uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="preciousoludare23@gmail.com"
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
                  placeholder="Enter administrator passkey"
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
                  {isSubmittingAuth
                    ? "Verifying..."
                    : "Unlock Merchant Console"}
                </span>
              </button>
            </form>
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
              <span
                className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentRoleDef.badgeColor} font-semibold`}
              >
                {currentRoleDef.name}
              </span>
            </div>
            <span className="text-[0.65rem] text-gray-400 font-mono block">
              Merchant Management & Store Fulfillment Hub
            </span>
          </div>
        </div>

        {/* Verified Staff Role & User Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold bg-white/5 border-white/10 text-gray-200">
            <Shield className="w-3.5 h-3.5 text-pink" />
            <span>{ROLES[role]?.name || role}</span>
          </div>

          <button
            onClick={async () => {
              await logout();
            }}
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
            { id: "overview", label: "Overview", icon: TrendingUp, show: true },
            {
              id: "orders",
              label: `Orders (${ordersList.length})`,
              icon: Package,
              show: hasPermission("view_orders"),
            },
            {
              id: "products",
              label: `Goods & Inventory (${productList.length})`,
              icon: Layers,
              show: true,
            },
            {
              id: "customers",
              label: `Customers (${customersList.length})`,
              icon: Users,
              show: hasPermission("view_orders"),
            },
            {
              id: "staff",
              label: "Staff & RBAC",
              icon: Shield,
              show: role === "super_admin" || role === "admin",
            },
            {
              id: "audit",
              label: "Audit & Settings",
              icon: Activity,
              show: role === "super_admin",
            },
          ]
            .filter((t) => t.show)
            .map((tab) => {
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
                  {ordersList.length > 0
                    ? "Calculated from completed orders"
                    : "Awaiting first settlement"}
                </span>
              </div>

              <div className="glass rounded-[20px] p-5 border border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Active Processing
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-pink mt-1">
                  {activeProcessing}
                </p>
                <span className="text-[10px] font-mono text-gray-400 mt-2 block">
                  Curation & packaging queue
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
                  {ordersList.filter((o) => o.status === "Cancelled").length}{" "}
                  cancelled
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
                {ordersList.length === 0 ? (
                  <div className="py-10 text-center font-mono text-xs text-gray-500">
                    No active orders in production queue. Live customer orders
                    will appear here automatically.
                  </div>
                ) : (
                  ordersList.slice(0, 4).map((order) => (
                    <div
                      key={order.orderRef}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-pink">
                            {order.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeClasses(order.status)}`}
                          >
                            {order.status}
                          </span>
                          {order.status === "Cancelled" &&
                            order.cancellationReason && (
                              <span className="text-[10px] text-rose-400 truncate max-w-[200px]">
                                ({order.cancellationReason})
                              </span>
                            )}
                        </div>
                        <p className="text-white font-semibold">
                          {order.customerName} • {order.city}, {order.state}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5">
                          {order.itemsSummary}
                        </p>
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
                  ))
                )}
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
                        <span className="font-bold text-sm text-pink">
                          {order.id}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadgeClasses(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.date}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {(order.paymentStatus || "pending").toUpperCase()}
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
                        {order.status !== "Cancelled" &&
                          order.status !== "Delivered" && (
                            <button
                              onClick={() => {
                                if (!hasPermission("cancel_order")) {
                                  showToast(
                                    "Access Denied: You do not have permission to cancel orders.",
                                  );
                                  return;
                                }
                                setCancellingOrder(order);
                              }}
                              disabled={!hasPermission("cancel_order")}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1 transition disabled:opacity-30 cursor-pointer"
                              title={
                                !hasPermission("cancel_order")
                                  ? "Requires Support, Manager, or Admin role"
                                  : "Cancel this order"
                              }
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
                        <p className="font-semibold text-white">
                          {order.customerName}
                        </p>
                        <p className="text-gray-400 mt-0.5">{order.phone}</p>
                        <p className="text-gray-400">{order.email}</p>
                      </div>

                      <div>
                        <span className="text-gray-400 uppercase text-[10px] block mb-1">
                          Delivery Destination
                        </span>
                        <p className="text-white font-semibold">
                          {order.address}
                        </p>
                        <p className="text-gray-400 mt-0.5">
                          {order.city}, {order.state}
                        </p>
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
                          Subtotal: {formatPrice(order.subtotal)} | Delivery:{" "}
                          {formatPrice(order.deliveryFee)}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5 capitalize">
                          Via: {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Customization & Item Highlights */}
                    <div className="space-y-2 text-xs font-mono">
                      <span className="text-gray-400 uppercase text-[10px] block">
                        Ordered Items & Custom Details
                      </span>
                      {(order.items || []).map((it, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-white">
                              {it.name}
                            </span>{" "}
                            <span className="text-pink font-semibold">
                              × {it.quantity}
                            </span>
                            {it.customization && (
                              <div className="text-[11px] text-gray-300 mt-1 space-x-2">
                                {it.customization.customerName && (
                                  <span className="bg-pink/15 text-pink px-2 py-0.5 rounded-md border border-pink/20">
                                    Name: &quot;{it.customization.customerName}
                                    &quot;
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
                          <strong>Order Cancelled:</strong>{" "}
                          {order.cancellationReason || "No reason specified"}
                        </span>
                      </div>
                    )}

                    {/* Quick Stage Progression Buttons */}
                    {order.status !== "Cancelled" &&
                      order.status !== "Delivered" &&
                      hasPermission("edit_order_status") && (
                        <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                          <span className="text-gray-400">Quick Advance:</span>
                          {order.status === "Pending" && (
                            <button
                              onClick={() =>
                                updateQuickOrderStatus(
                                  order.orderRef,
                                  "Payment Confirmed",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                            >
                              → Confirm Payment
                            </button>
                          )}
                          {order.status === "Payment Confirmed" && (
                            <button
                              onClick={() =>
                                updateQuickOrderStatus(
                                  order.orderRef,
                                  "Customization in Progress",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-pink/20 text-pink border border-pink/30 hover:bg-pink/30 transition"
                            >
                              → Start Customization
                            </button>
                          )}
                          {order.status === "Customization in Progress" && (
                            <button
                              onClick={() =>
                                updateQuickOrderStatus(
                                  order.orderRef,
                                  "Ready for Dispatch",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition"
                            >
                              → Mark Ready for Dispatch
                            </button>
                          )}
                          {order.status === "Ready for Dispatch" && (
                            <button
                              onClick={() =>
                                updateQuickOrderStatus(
                                  order.orderRef,
                                  "Shipped",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition"
                            >
                              → Dispatch with Courier
                            </button>
                          )}
                          {order.status === "Shipped" && (
                            <button
                              onClick={() =>
                                updateQuickOrderStatus(
                                  order.orderRef,
                                  "Delivered",
                                )
                              }
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
            TAB 3: CATALOG & INVENTORY MANAGEMENT (ADD / EDIT / DELETE GOODS)
        ==================================================================== */}
        {activeTab === "products" && (
          <div className="glass rounded-[24px] p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Goods, Catalogue & Stock Control
                </h3>
                <p className="font-mono text-xs text-gray-400">
                  Add new goods, edit prices/details, toggle stock, or remove items
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filter goods..."
                    className="pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink"
                  />
                </div>
                {hasPermission("manage_inventory") && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProductModal({
                        mode: "create",
                        name: "",
                        price: "",
                        compareAtPrice: "",
                        category: defaultCategories[0]?.name || "Custom Frames",
                        description: "",
                        primaryImage: "/images/products/custom-mug.png",
                        stockCount: "25",
                        inStock: true,
                        featured: false,
                        designsText: "",
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-pink hover:brightness-110 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Good</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productList
                .filter((p) => {
                  const q = productSearch.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    p.name.toLowerCase().includes(q) ||
                    (p.category || "").toLowerCase().includes(q)
                  );
                })
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 font-mono text-xs"
                  >
                    <div className="flex gap-3">
                      <img
                        src={
                          prod.primaryImage || "/images/products/sample-mug.jpg"
                        }
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-white truncate">
                          {prod.name}
                        </h4>
                        <p className="text-pink font-semibold mt-0.5">
                          {formatPrice(prod.price)}
                        </p>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {prod.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => toggleProductStock(prod)}
                        disabled={!hasPermission("manage_inventory")}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition cursor-pointer disabled:opacity-40 ${
                          prod.inStock
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : "bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                        }`}
                        title="Click to toggle stock status"
                      >
                        {prod.inStock
                          ? `In Stock (${prod.stockCount})`
                          : "Out of Stock"}
                      </button>

                      {hasPermission("manage_inventory") && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProductModal({
                                mode: "edit",
                                id: prod.id,
                                name: prod.name,
                                price: String(prod.price),
                                compareAtPrice: prod.compareAtPrice
                                  ? String(prod.compareAtPrice)
                                  : "",
                                category: prod.category || defaultCategories[0]?.name || "Custom Frames",
                                description: prod.description || "",
                                primaryImage: prod.primaryImage || "",
                                stockCount: String(prod.stockCount || 0),
                                inStock: Boolean(prod.inStock),
                                featured: Boolean(prod.featured),
                                designsText: (
                                  prod.customizationOptions?.designs || []
                                ).join("\n"),
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] flex items-center gap-1 transition cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(prod.id, prod.name)
                            }
                            className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 text-[11px] flex items-center transition cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: CUSTOMERS DIRECTORY
        ==================================================================== */}
        {activeTab === "customers" && (
          <div className="glass rounded-[24px] p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-pink" />
                  <span>Customer Accounts & Order History</span>
                </h3>
                <p className="font-mono text-xs text-gray-400 mt-1">
                  Aggregated shopper directory from placed orders
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name, email, city..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-pink"
                />
              </div>
            </div>

            {customersList.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-gray-500">
                No customer orders recorded yet. Customers will appear here automatically after placing an order.
              </div>
            ) : (
              <div className="divide-y divide-white/5 font-mono text-xs">
                {customersList
                  .filter((c) => {
                    const q = customerSearch.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      c.name.toLowerCase().includes(q) ||
                      c.email.toLowerCase().includes(q) ||
                      c.phone.toLowerCase().includes(q) ||
                      c.city.toLowerCase().includes(q)
                    );
                  })
                  .map((c) => (
                    <div
                      key={c.email}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.name}</span>
                          {c.suspended && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[11px]">
                          {c.email} • {c.phone} • {c.city}, {c.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-white font-bold block">
                            {formatPrice(c.totalSpent)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {c.orderCount} order{c.orderCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        {(role === "super_admin" || role === "admin") && (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCustomerSuspended(c.email, !c.suspended)
                            }
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
                              c.suspended
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25"
                            }`}
                          >
                            {c.suspended ? "Reactivate" : "Suspend"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 5: STAFF ACCOUNTS, CUSTOM PERMISSIONS & RBAC MATRIX
        ==================================================================== */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            {/* Live Staff Directory */}
            <div className="glass rounded-[24px] p-6 border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-pink" />
                    <span>Staff Accounts & Custom Permissions</span>
                  </h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">
                    {role === "super_admin"
                      ? "Create, promote, suspend, delete staff and grant or revoke individual permissions."
                      : "Read-only staff overview. Only the Super Admin can modify roles or permissions."}
                  </p>
                </div>
                {role === "super_admin" && (
                  <button
                    type="button"
                    onClick={() =>
                      setNewStaffModal({
                        name: "",
                        email: "",
                        password: "",
                        role: "manager",
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-pink hover:brightness-110 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink/20 cursor-pointer self-start"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Staff Account</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-white/5 font-mono text-xs">
                {staffList.map((member) => {
                  const roleDef = ROLES[member.role] || ROLES.support;
                  return (
                    <div
                      key={member.id}
                      className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white">
                            {member.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleDef.badgeColor}`}
                          >
                            {roleDef.name}
                          </span>
                          {member.isProtectedOwner && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Protected Owner
                            </span>
                          )}
                          {!member.active && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              Suspended
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-[11px]">{member.email}</p>
                        {(member.customGrant.length > 0 ||
                          member.customRevoke.length > 0) && (
                          <p className="text-[10px] text-amber-300">
                            {member.customGrant.length > 0 &&
                              `+Granted: ${member.customGrant.join(", ")} `}
                            {member.customRevoke.length > 0 &&
                              `-Revoked: ${member.customRevoke.join(", ")}`}
                          </p>
                        )}
                      </div>

                      {role === "super_admin" && !member.isProtectedOwner && (
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateStaffRole(
                                member.id,
                                e.target.value as "admin" | "manager" | "support",
                              )
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] cursor-pointer"
                          >
                            <option value="admin" className="bg-[#121216]">
                              Store Administrator
                            </option>
                            <option value="manager" className="bg-[#121216]">
                              Operations Manager
                            </option>
                            <option value="support" className="bg-[#121216]">
                              Customer Support
                            </option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingStaffPerms({
                                id: member.id,
                                name: member.name,
                                email: member.email,
                                role: member.role,
                                customGrant: [...member.customGrant],
                                customRevoke: [...member.customRevoke],
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Custom Permissions
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStaffActive(member.id, !member.active)
                            }
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border cursor-pointer ${
                              member.active
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                            }`}
                          >
                            {member.active ? "Suspend" : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteStaff(member.id, member.email)
                            }
                            className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 cursor-pointer"
                            title="Delete staff account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RBAC Hierarchy Reference */}
            <div className="glass rounded-[24px] p-6 border border-white/10 space-y-6">
              <div className="pb-4 border-b border-white/10">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-pink" />
                  <span>Role-Based Access Control (RBAC) Hierarchy</span>
                </h3>
                <p className="font-mono text-xs text-gray-400 mt-1">
                  Default authority tiers across the store
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
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${def.badgeColor}`}
                          >
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
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 6: AUDIT LOGS & SYSTEM SETTINGS (SUPER ADMIN ONLY)
        ==================================================================== */}
        {activeTab === "audit" && role === "super_admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* System Settings */}
            <div className="lg:col-span-5 glass rounded-[24px] p-6 border border-white/10 space-y-5 h-fit">
              <div className="pb-3 border-b border-white/10 flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink" />
                <h3 className="font-display text-lg font-bold text-white">
                  System Settings
                </h3>
              </div>

              <form onSubmit={handleSaveSystemSettings} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={systemSettings.storeName}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, storeName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    WhatsApp Order Number
                  </label>
                  <input
                    type="text"
                    value={systemSettings.whatsappNumber}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Primary Dispatch Hub
                  </label>
                  <input
                    type="text"
                    value={systemSettings.dispatchHub}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        dispatchHub: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      Free Shipping (₦)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase text-[10px] mb-1">
                      Standard Fee (₦)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.standardShippingFee}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          standardShippingFee: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.acceptingOrders}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        acceptingOrders: e.target.checked,
                      })
                    }
                    className="rounded accent-pink"
                  />
                  <span className="text-gray-300">Store is accepting new orders</span>
                </label>

                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="w-full py-2.5 rounded-xl bg-pink hover:brightness-110 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSettings ? "Saving..." : "Save Settings"}</span>
                </button>
              </form>
            </div>

            {/* Security Audit Log */}
            <div className="lg:col-span-7 glass rounded-[24px] p-6 border border-white/10 space-y-4">
              <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Security & Activity Audit Log
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-gray-400">
                  {auditLogsList.length} recorded events
                </span>
              </div>

              {auditLogsList.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-gray-500">
                  No sensitive actions logged yet in this session.
                </div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto pr-1 font-mono text-xs">
                  {auditLogsList.map((log) => (
                    <div key={log.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-pink/15 text-pink text-[10px] font-semibold border border-pink/25">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-200 text-[11px]">{log.details}</p>
                      <p className="text-[10px] text-gray-500">
                        Actor: {log.actorEmail} ({log.actorRole}) • Target: {log.target}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                    Placed: {editingOrder.date} • Placed via{" "}
                    {(editingOrder.paymentMethod || "paystack").toUpperCase()}
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
                      <option
                        key={st}
                        value={st}
                        className="bg-[#1C141E] text-white"
                      >
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
                    <option
                      value="refunded"
                      className="bg-[#1C141E] text-white"
                    >
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
                        setEditingOrder({
                          ...editingOrder,
                          customerName: e.target.value,
                        })
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
                        setEditingOrder({
                          ...editingOrder,
                          phone: e.target.value,
                        })
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
                      setEditingOrder({
                        ...editingOrder,
                        email: e.target.value,
                      })
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
                      setEditingOrder({
                        ...editingOrder,
                        address: e.target.value,
                      })
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
                        setEditingOrder({
                          ...editingOrder,
                          city: e.target.value,
                        })
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
                        setEditingOrder({
                          ...editingOrder,
                          state: e.target.value,
                        })
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
                      setEditingOrder({
                        ...editingOrder,
                        deliveryNotes: e.target.value,
                      })
                    }
                    placeholder="e.g. Call before delivery, gate code..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Gift Customization Specs */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block border-b border-white/10 pb-1">
                  Gift Notes & Inscription Specs
                </span>

                {(editingOrder.items || []).map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-2"
                  >
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
                          disabled={!hasPermission("edit_order_details")}
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
                            setEditingOrder({
                              ...editingOrder,
                              items: newItems,
                            });
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
                          disabled={!hasPermission("edit_order_details")}
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
                            setEditingOrder({
                              ...editingOrder,
                              items: newItems,
                            });
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
                  Internal Staff Notes
                </label>
                <textarea
                  rows={2}
                  value={editingOrder.adminNotes || ""}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      adminNotes: e.target.value,
                    })
                  }
                  placeholder="Private internal notes (e.g. customer verified gold monogram thread via WhatsApp call)..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-pink"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {editingOrder.status !== "Cancelled" &&
                    hasPermission("cancel_order") && (
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
                    <span>
                      {isSavingOrder ? "Saving..." : "Save Order Changes"}
                    </span>
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
              This will update the order status to <strong>Cancelled</strong>,
              halt production queue, and log the reason in the customer
              tracking timeline.
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
                <option value="Production materials or customized stock unavailable">
                  Production materials or customized stock unavailable
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
                <span>
                  {isSavingOrder ? "Processing..." : "Confirm Cancellation"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: ADD / EDIT PRODUCT (GOODS)
      ==================================================================== */}
      {editingProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="glass bg-[#121216] max-w-xl w-full rounded-[28px] border border-white/15 p-6 sm:p-8 space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">
                {editingProductModal.mode === "create"
                  ? "Add New Good to Catalog"
                  : `Edit "${editingProductModal.name}"`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProductModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Product / Good Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProductModal.name}
                  onChange={(e) =>
                    setEditingProductModal({
                      ...editingProductModal,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Borderless Photo Frame (A4)"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingProductModal.price}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        price: e.target.value,
                      })
                    }
                    placeholder="9000"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Compare-At Price (₦)
                  </label>
                  <input
                    type="number"
                    value={editingProductModal.compareAtPrice}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        compareAtPrice: e.target.value,
                      })
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProductModal.category}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#1C141E] border border-white/10 text-white"
                  >
                    {defaultCategories.map((c) => (
                      <option key={c.id} value={c.name} className="bg-[#121216]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProductModal.stockCount}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        stockCount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Image Path or URL
                </label>
                <input
                  type="text"
                  value={editingProductModal.primaryImage}
                  onChange={(e) =>
                    setEditingProductModal({
                      ...editingProductModal,
                      primaryImage: e.target.value,
                    })
                  }
                  placeholder="/images/products/custom-mug.png"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProductModal.description}
                  onChange={(e) =>
                    setEditingProductModal({
                      ...editingProductModal,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Variants / Sizes (one per line, optional)
                </label>
                <textarea
                  rows={3}
                  value={editingProductModal.designsText}
                  onChange={(e) =>
                    setEditingProductModal({
                      ...editingProductModal,
                      designsText: e.target.value,
                    })
                  }
                  placeholder={"A4 (₦9,000)\nA3 (₦12,000)"}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProductModal.inStock}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        inStock: e.target.checked,
                      })
                    }
                    className="accent-pink"
                  />
                  <span className="text-gray-300">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProductModal.featured}
                    onChange={(e) =>
                      setEditingProductModal({
                        ...editingProductModal,
                        featured: e.target.checked,
                      })
                    }
                    className="accent-pink"
                  />
                  <span className="text-gray-300">Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 rounded-xl bg-pink text-white font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>
                    {isSavingProduct
                      ? "Saving..."
                      : editingProductModal.mode === "create"
                      ? "Create Good"
                      : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: ADD STAFF ACCOUNT (SUPER ADMIN)
      ==================================================================== */}
      {newStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#121216] max-w-md w-full rounded-[24px] border border-white/15 p-6 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">
                Add Staff Account
              </h3>
              <button
                type="button"
                onClick={() => setNewStaffModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffModal.name}
                  onChange={(e) =>
                    setNewStaffModal({ ...newStaffModal, name: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Staff Email *
                </label>
                <input
                  type="email"
                  required
                  value={newStaffModal.email}
                  onChange={(e) =>
                    setNewStaffModal({ ...newStaffModal, email: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newStaffModal.password}
                  onChange={(e) =>
                    setNewStaffModal({
                      ...newStaffModal,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">
                  Role *
                </label>
                <select
                  value={newStaffModal.role}
                  onChange={(e) =>
                    setNewStaffModal({
                      ...newStaffModal,
                      role: e.target.value as "admin" | "manager" | "support",
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C141E] border border-white/10 text-white"
                >
                  <option value="admin" className="bg-[#121216]">
                    Store Administrator
                  </option>
                  <option value="manager" className="bg-[#121216]">
                    Operations Manager
                  </option>
                  <option value="support" className="bg-[#121216]">
                    Customer Support
                  </option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewStaffModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingStaff}
                  className="px-5 py-2 rounded-xl bg-pink text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSavingStaff ? "Creating..." : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 5: CUSTOM PERMISSIONS OVERRIDES (SUPER ADMIN)
      ==================================================================== */}
      {editingStaffPerms && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass bg-[#121216] max-w-lg w-full rounded-[24px] border border-white/15 p-6 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Custom Permissions — {editingStaffPerms.name}
                </h3>
                <p className="text-[11px] text-gray-400">
                  Base Role: {ROLES[editingStaffPerms.role]?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaffPerms(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {(
                [
                  "view_orders",
                  "edit_order_status",
                  "edit_order_details",
                  "cancel_order",
                  "delete_order",
                  "manage_inventory",
                  "view_financials",
                ] as Permission[]
              ).map((perm) => {
                const inBase =
                  ROLES[editingStaffPerms.role]?.permissions.includes(perm) ||
                  false;
                const isGranted = editingStaffPerms.customGrant.includes(perm);
                const isRevoked = editingStaffPerms.customRevoke.includes(perm);
                const effective = (inBase || isGranted) && !isRevoked;

                return (
                  <label
                    key={perm}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                  >
                    <div>
                      <span className="text-white font-semibold block">
                        {formatPermissionName(perm)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {inBase ? "Included in base role" : "Not in base role"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={effective}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let nextGrant = editingStaffPerms.customGrant.filter(
                          (p) => p !== perm,
                        );
                        let nextRevoke = editingStaffPerms.customRevoke.filter(
                          (p) => p !== perm,
                        );
                        if (checked && !inBase) nextGrant.push(perm);
                        if (!checked && inBase) nextRevoke.push(perm);
                        setEditingStaffPerms({
                          ...editingStaffPerms,
                          customGrant: nextGrant,
                          customRevoke: nextRevoke,
                        });
                      }}
                      className="accent-pink w-4 h-4"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingStaffPerms(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStaffPermissions}
                disabled={isSavingStaff}
                className="px-5 py-2 rounded-xl bg-pink text-white font-semibold cursor-pointer disabled:opacity-50"
              >
                {isSavingStaff ? "Saving..." : "Save Permissions"}
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
  if (!o) {
    return {
      id: "#OLU-000000",
      orderRef: "OLU-000000",
      customerName: "Customer",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      items: [],
      itemsSummary: "No items",
      customizationDetails: "None",
      subtotal: 0,
      deliveryFee: 0,
      amount: 0,
      paymentMethod: "paystack",
      paymentStatus: "pending",
      status: "Pending",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }

  const rawItems = Array.isArray(o.items) ? o.items : [];
  const items: OrderItem[] = rawItems.map((it: any) => ({
    productId: String(it?.productId || it?.id || "item-1"),
    name: String(it?.name || "Custom Gift"),
    price: Number(it?.price || 0),
    quantity: Number(it?.quantity || 1),
    customization: it?.customization || undefined,
  }));

  const itemsSummary =
    items.length > 0
      ? items.map((i) => `${i.name} × ${i.quantity}`).join(", ")
      : typeof o.itemsSummary === "string" && o.itemsSummary.trim()
        ? o.itemsSummary.trim()
        : "Custom gift order";

  const customParts: string[] = [];
  items.forEach((it) => {
    if (it.customization?.customerName)
      customParts.push(`Name: '${it.customization.customerName}'`);
    if (it.customization?.selectedColor)
      customParts.push(`Colour: ${it.customization.selectedColor}`);
    if (it.customization?.message)
      customParts.push(`'${it.customization.message}'`);
  });

  const rawStatus = o.orderStatus || o.status || "Pending";
  const validStatus = (ORDER_STATUSES as readonly string[]).includes(rawStatus)
    ? (rawStatus as OrderStatus)
    : "Pending";

  const rawPaymentStatus = (o.paymentStatus || "pending").toLowerCase();
  const validPaymentStatus: PaymentStatus = [
    "paid",
    "pending",
    "failed",
    "refunded",
  ].includes(rawPaymentStatus)
    ? (rawPaymentStatus as PaymentStatus)
    : "pending";

  let formattedDate = "Recently";
  try {
    const d = new Date(o.createdAt || o.date || Date.now());
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    formattedDate = "Recently";
  }

  const orderRef = String(o.orderRef || o.id || "OLU-UNKNOWN").replace(
    /^#/,
    "",
  );

  return {
    id: `#${orderRef}`,
    orderRef: orderRef,
    customerName: String(o.customerName || "Customer"),
    email: String(o.customerEmail || o.email || "No email"),
    phone: String(o.customerPhone || o.phone || "+234 800 000 0000"),
    address: String(o.deliveryAddress || o.address || "Ile-Ife, Osun State"),
    city: String(o.deliveryCity || o.city || "Ile-Ife"),
    state: String(o.deliveryState || o.state || "Osun"),
    deliveryNotes: o.deliveryNotes || undefined,
    cancellationReason: o.cancellationReason || undefined,
    adminNotes: o.adminNotes || undefined,
    items,
    itemsSummary: itemsSummary || "Custom gift order",
    customizationDetails:
      customParts.join(" | ") ||
      (typeof o.customizationDetails === "string"
        ? o.customizationDetails
        : "Standard catalog order"),
    subtotal: Number(o.subtotal || o.total || 0),
    deliveryFee: Number(o.deliveryFee || 0),
    amount: Number(o.total || o.amount || 0),
    paymentMethod: String(o.paymentMethod || "paystack"),
    paymentStatus: validPaymentStatus,
    status: validStatus,
    date: formattedDate,
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
