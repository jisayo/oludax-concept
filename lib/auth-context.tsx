"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Role, Permission, hasPermission, canAccessAdmin } from "./rbac";

export type { Role, Permission };

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: Role;
  hasPermission: (permission: Permission) => boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; isStaff: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize session with server HttpOnly cookie on boot
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch {}

    // Fall back to saved customer profile if not a staff session
    try {
      const saved = localStorage.getItem("oludax_customer_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Security: Customers can NEVER have administrative roles
        if (parsed && typeof parsed === "object") {
          setUser({
            id: String(parsed.id || `customer-${Date.now().toString(36)}`),
            email: String(parsed.email || ""),
            name: String(parsed.name || "Customer"),
            phone: parsed.phone ? String(parsed.phone) : undefined,
            role: "customer",
          });
          setIsLoading(false);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (email: string, password?: string) => {
      setIsLoading(true);
      try {
        // 1. First attempt authenticated staff login against server API
        if (password) {
          try {
            const adminRes = await fetch("/api/admin/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            if (adminRes.ok) {
              const data = await adminRes.json();
              if (data.success && data.user) {
                const verifiedStaffUser: User = {
                  id: data.user.id,
                  email: data.user.email,
                  name: data.user.name,
                  role: data.user.role,
                };
                setUser(verifiedStaffUser);
                return { success: true, isStaff: true };
              }
            }
          } catch {}
        }

        // 2. Standard customer authentication (strictly customer role, no admin privilege)
        const customerUser: User = {
          id: `customer-${Date.now().toString(36)}`,
          email: email.trim().toLowerCase(),
          name: email.split("@")[0],
          role: "customer",
        };

        setUser(customerUser);
        localStorage.setItem("oludax_customer_user", JSON.stringify(customerUser));
        return { success: true, isStaff: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, _password?: string) => {
      setIsLoading(true);
      try {
        const customerUser: User = {
          id: `customer-${Date.now().toString(36)}`,
          email: email.trim().toLowerCase(),
          name: name.trim(),
          role: "customer",
        };
        setUser(customerUser);
        localStorage.setItem("oludax_customer_user", JSON.stringify(customerUser));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    setUser(null);
    localStorage.removeItem("oludax_customer_user");
    localStorage.removeItem("oludax_user");
    localStorage.removeItem("oludax_admin_token");
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      // Do not allow client updates to change server-assigned role
      const updated: User = { ...prev, ...data, role: prev.role };
      if (prev.role === "customer") {
        localStorage.setItem("oludax_customer_user", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const userRole = user?.role || "customer";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: canAccessAdmin(userRole),
        role: userRole,
        hasPermission: (perm: Permission) => hasPermission(userRole, perm),
        login,
        register,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
