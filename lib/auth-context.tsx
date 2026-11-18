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
  login: (email: string, password?: string, roleOverride?: Role) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  setRole: (role: Role) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    try {
      const saved = localStorage.getItem("oludax_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password?: string, roleOverride?: Role) => {
      setIsLoading(true);
      try {
        let assignedRole: Role = "customer";

        if (roleOverride) {
          assignedRole = roleOverride;
        } else if (
          email.toLowerCase().includes("superadmin") ||
          password === "superadmin"
        ) {
          assignedRole = "super_admin";
        } else if (
          email.toLowerCase().includes("admin") ||
          password === "admin2026" ||
          password === "admin"
        ) {
          assignedRole = "admin";
        } else if (email.toLowerCase().includes("manager")) {
          assignedRole = "manager";
        } else if (email.toLowerCase().includes("artisan")) {
          assignedRole = "artisan";
        } else if (email.toLowerCase().includes("support")) {
          assignedRole = "support";
        }

        const isStaff = assignedRole !== "customer";

        const mockUser: User = {
          id: isStaff ? `staff-${assignedRole}` : "user-1",
          email,
          name: isStaff
            ? `${assignedRole.replace("_", " ").toUpperCase()} Officer`
            : email.split("@")[0],
          role: assignedRole,
        };

        setUser(mockUser);
        localStorage.setItem("oludax_user", JSON.stringify(mockUser));
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
        const mockUser: User = {
          id: "user-" + Date.now(),
          email,
          name,
          role: "customer",
        };
        setUser(mockUser);
        localStorage.setItem("oludax_user", JSON.stringify(mockUser));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("oludax_user");
  }, []);

  const setRole = useCallback((newRole: Role) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: User = { ...prev, role: newRole };
      localStorage.setItem("oludax_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("oludax_user", JSON.stringify(updated));
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
        setRole,
        updateProfile,
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
