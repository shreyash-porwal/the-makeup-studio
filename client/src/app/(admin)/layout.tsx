"use client";
import React, { use, useState } from "react";
import AdminSidebar from "./admin-dashboard/(components)/admin-sidebar";
import ProtectedRoute from "@/components/protectedRoute";
import AdminNavbar from "@/components/admin/adminNavbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed z-40 top-20 md:static transition-all duration-300 ${
            isSidebarOpen ? "left-0" : "-left-full"
          } md:left-0 w-64`}
        >
          <AdminSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 bg-gray-100 min-h-screen md:ml-0 ml-0">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
