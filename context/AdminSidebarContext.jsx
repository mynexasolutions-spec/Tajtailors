"use client";

import { createContext, useContext, useState } from "react";

const AdminSidebarContext = createContext(undefined);

export function AdminSidebarProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AdminSidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  return ctx;
}
