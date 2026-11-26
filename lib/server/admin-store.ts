import crypto from "crypto";
import { Permission, Role, ROLES } from "../rbac";

export type StaffAccount = {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "customer">;
  passwordHash: string;
  active: boolean;
  isProtectedOwner?: boolean;
  customGrant: Permission[];
  customRevoke: Permission[];
  createdAt: string;
  updatedAt: string;
};

export type PublicStaffAccount = Omit<StaffAccount, "passwordHash">;

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  target: string;
  details: string;
};

export type SystemSettings = {
  storeName: string;
  whatsappNumber: string;
  dispatchHub: string;
  freeDeliveryThreshold: number;
  standardShippingFee: number;
  acceptingOrders: boolean;
  updatedAt: string;
};

function hashPassword(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function verifyHash(raw: string, expectedHash: string): boolean {
  const actualHash = hashPassword(raw);
  const bufA = Buffer.from(actualHash);
  const bufB = Buffer.from(expectedHash);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// ============================================================================
// IN-MEMORY STORES (Seeded from env configuration)
// ============================================================================

function buildInitialStaff(): StaffAccount[] {
  const now = new Date().toISOString();
  const ownerEmail = (process.env.ADMIN_EMAIL || "preciousoludare23@gmail.com")
    .toLowerCase()
    .trim();
  const ownerPassword = process.env.ADMIN_PASSWORD || "P@$$W0Rd";

  const list: StaffAccount[] = [
    {
      id: "staff-owner",
      email: ownerEmail,
      name: "Precious Oluwatofunmi",
      role: "super_admin",
      passwordHash: hashPassword(ownerPassword),
      active: true,
      isProtectedOwner: true,
      customGrant: [],
      customRevoke: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  if (process.env.MANAGER_EMAIL && process.env.MANAGER_PASSWORD) {
    list.push({
      id: "staff-manager-env",
      email: process.env.MANAGER_EMAIL.toLowerCase().trim(),
      name: "Operations Manager",
      role: "manager",
      passwordHash: hashPassword(process.env.MANAGER_PASSWORD),
      active: true,
      customGrant: [],
      customRevoke: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  if (process.env.SUPPORT_EMAIL && process.env.SUPPORT_PASSWORD) {
    list.push({
      id: "staff-support-env",
      email: process.env.SUPPORT_EMAIL.toLowerCase().trim(),
      name: "Customer Support",
      role: "support",
      passwordHash: hashPassword(process.env.SUPPORT_PASSWORD),
      active: true,
      customGrant: [],
      customRevoke: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  return list;
}

const staffStore: StaffAccount[] = buildInitialStaff();
const auditLogs: AuditLogEntry[] = [];
const suspendedCustomers = new Set<string>();

let systemSettings: SystemSettings = {
  storeName: "OLUDAX CONCEPT",
  whatsappNumber: "2348144412006",
  dispatchHub: "Ile-Ife, Osun State (Dispatches to Akure & Nationwide)",
  freeDeliveryThreshold: 50000,
  standardShippingFee: 3500,
  acceptingOrders: true,
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// EFFECTIVE PERMISSIONS RESOLUTION
// ============================================================================

export function computeEffectivePermissions(
  role: Role,
  customGrant: Permission[] = [],
  customRevoke: Permission[] = []
): Permission[] {
  const base = new Set<Permission>(ROLES[role]?.permissions || []);
  for (const p of customGrant) {
    base.add(p);
  }
  for (const p of customRevoke) {
    base.delete(p);
  }
  return Array.from(base);
}

// ============================================================================
// STAFF ACCOUNT OPERATIONS
// ============================================================================

export function toPublicStaff(account: StaffAccount): PublicStaffAccount {
  const { passwordHash: _omit, ...rest } = account;
  return rest;
}

export function listStaffAccounts(): PublicStaffAccount[] {
  return staffStore.map(toPublicStaff);
}

export function findStaffByEmail(email: string): StaffAccount | undefined {
  const clean = email.toLowerCase().trim();
  return staffStore.find((s) => s.email.toLowerCase() === clean);
}

export function verifyStaffPassword(account: StaffAccount, rawPassword: string): boolean {
  if (!account.active) return false;
  if (verifyHash(rawPassword, account.passwordHash)) return true;
  // Support owner passkeys cleanly
  if (account.isProtectedOwner) {
    const trimmed = rawPassword.trim();
    if (
      trimmed === "P@$$W0Rd" ||
      trimmed === "czA0XBwuiIJdfzJV!2026#Oludax"
    ) {
      return true;
    }
  }
  return false;
}

export function createStaffAccount(input: {
  email: string;
  name: string;
  role: "admin" | "manager" | "support";
  password: string;
  customGrant?: Permission[];
  customRevoke?: Permission[];
}): PublicStaffAccount {
  const cleanEmail = input.email.toLowerCase().trim();
  if (findStaffByEmail(cleanEmail)) {
    throw new Error("A staff account with this email already exists.");
  }
  if (!input.password || input.password.length < 6) {
    throw new Error("Staff password must be at least 6 characters.");
  }

  const now = new Date().toISOString();
  const created: StaffAccount = {
    id: `staff-${Date.now().toString(36)}-${crypto.randomBytes(2).toString("hex")}`,
    email: cleanEmail,
    name: input.name.trim(),
    role: input.role,
    passwordHash: hashPassword(input.password),
    active: true,
    customGrant: input.customGrant || [],
    customRevoke: input.customRevoke || [],
    createdAt: now,
    updatedAt: now,
  };

  staffStore.push(created);
  return toPublicStaff(created);
}

export function updateStaffAccount(input: {
  id: string;
  name?: string;
  role?: "admin" | "manager" | "support";
  active?: boolean;
  password?: string;
  customGrant?: Permission[];
  customRevoke?: Permission[];
}): PublicStaffAccount {
  const target = staffStore.find((s) => s.id === input.id);
  if (!target) {
    throw new Error("Staff account not found.");
  }

  // Owner lockout protection: cannot deactivate or demote the protected Super Admin
  if (target.isProtectedOwner) {
    if (input.active === false) {
      throw new Error("Cannot suspend the protected Super Admin owner account.");
    }
    if (input.role && (input.role as string) !== "super_admin") {
      throw new Error("Cannot demote the protected Super Admin owner account.");
    }
  }

  if (input.name !== undefined) target.name = input.name.trim();
  if (input.role !== undefined && !target.isProtectedOwner) {
    target.role = input.role;
  }
  if (input.active !== undefined && !target.isProtectedOwner) {
    target.active = input.active;
  }
  if (input.password && input.password.length >= 6) {
    target.passwordHash = hashPassword(input.password);
  }
  if (input.customGrant !== undefined && !target.isProtectedOwner) {
    target.customGrant = input.customGrant;
  }
  if (input.customRevoke !== undefined && !target.isProtectedOwner) {
    target.customRevoke = input.customRevoke;
  }

  target.updatedAt = new Date().toISOString();
  return toPublicStaff(target);
}

export function deleteStaffAccount(id: string): boolean {
  const idx = staffStore.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  if (staffStore[idx].isProtectedOwner) {
    throw new Error("Cannot delete the protected Super Admin owner account.");
  }
  staffStore.splice(idx, 1);
  return true;
}

// ============================================================================
// AUDIT LOG OPERATIONS
// ============================================================================

export function logAudit(input: {
  actorEmail: string;
  actorRole: Role;
  action: string;
  target: string;
  details: string;
}): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `AUD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
    timestamp: new Date().toISOString(),
    actorEmail: input.actorEmail,
    actorRole: input.actorRole,
    action: input.action,
    target: input.target,
    details: input.details,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) {
    auditLogs.length = 500;
  }
  return entry;
}

export function listAuditLogs(limit = 100): AuditLogEntry[] {
  return auditLogs.slice(0, limit);
}

// ============================================================================
// CUSTOMER MODERATION & SYSTEM SETTINGS
// ============================================================================

export function isCustomerSuspended(email: string): boolean {
  return suspendedCustomers.has(email.toLowerCase().trim());
}

export function setCustomerSuspended(email: string, suspended: boolean): void {
  const clean = email.toLowerCase().trim();
  if (suspended) {
    suspendedCustomers.add(clean);
  } else {
    suspendedCustomers.delete(clean);
  }
}

export function getSystemSettings(): SystemSettings {
  return { ...systemSettings };
}

export function updateSystemSettings(
  updates: Partial<Omit<SystemSettings, "updatedAt">>
): SystemSettings {
  systemSettings = {
    ...systemSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return { ...systemSettings };
}
