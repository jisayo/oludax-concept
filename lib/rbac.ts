/**
 * OLUDAX CONCEPT - Role-Based Access Control (RBAC) System
 */

export type Role =
  | "super_admin"
  | "admin"
  | "manager"
  | "artisan"
  | "support"
  | "customer";

export type Permission =
  | "view_admin_panel"
  | "view_orders"
  | "edit_order_status"
  | "edit_order_details"
  | "cancel_order"
  | "delete_order"
  | "edit_customization"
  | "manage_inventory"
  | "view_financials"
  | "manage_staff";

export type RoleDefinition = {
  name: string;
  description: string;
  badgeColor: string;
  permissions: Permission[];
};

export const ROLES: Record<Role, RoleDefinition> = {
  super_admin: {
    name: "Super Administrator",
    description: "Unrestricted operational authority, financial oversight, staff & order controls",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    permissions: [
      "view_admin_panel",
      "view_orders",
      "edit_order_status",
      "edit_order_details",
      "cancel_order",
      "delete_order",
      "edit_customization",
      "manage_inventory",
      "view_financials",
      "manage_staff",
    ],
  },
  admin: {
    name: "Store Administrator",
    description: "Full store management: editing orders, dispatching packages, inventory and cancellations",
    badgeColor: "bg-pink/15 text-pink border-pink/30",
    permissions: [
      "view_admin_panel",
      "view_orders",
      "edit_order_status",
      "edit_order_details",
      "cancel_order",
      "edit_customization",
      "manage_inventory",
      "view_financials",
    ],
  },
  manager: {
    name: "Operations Manager",
    description: "Supervises orders, courier dispatches, cancellations, and stock inventory",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    permissions: [
      "view_admin_panel",
      "view_orders",
      "edit_order_status",
      "edit_order_details",
      "cancel_order",
      "edit_customization",
      "manage_inventory",
    ],
  },
  artisan: {
    name: "Bespoke Artisan Lead",
    description: "Production studio: engraving, embroidery, ribbon packaging & milestone transitions",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    permissions: [
      "view_admin_panel",
      "view_orders",
      "edit_order_status",
      "edit_customization",
    ],
  },
  support: {
    name: "Concierge / Support",
    description: "Customer service: editing delivery destinations, phone numbers & order cancellations",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    permissions: [
      "view_admin_panel",
      "view_orders",
      "edit_order_details",
      "cancel_order",
    ],
  },
  customer: {
    name: "Store Customer",
    description: "Catalogue shopper, placing orders and viewing personal order tracking",
    badgeColor: "bg-gray-500/15 text-gray-400 border-gray-500/30",
    permissions: [],
  },
};

/**
 * Check if a role possesses a specific permission
 */
export function hasPermission(
  role: Role | undefined | null,
  permission: Permission
): boolean {
  if (!role) return false;
  const def = ROLES[role];
  if (!def) return false;
  return def.permissions.includes(permission);
}

/**
 * Check if role has admin panel access
 */
export function canAccessAdmin(role: Role | undefined | null): boolean {
  return hasPermission(role, "view_admin_panel");
}
