"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { LogOut } from "@/services/operations/authAPI";
import { setUser } from "@/store/slices/profileSlice";
import { setToken } from "@/store/slices/authSlice";

const navItems = [
  { label: "Dashboard", href: "/admin-dashboard" },
  { label: "Category", href: "/categories" },
  // { label: "Users", href: "/admin-dashboard/users" },
  // { label: "Orders", href: "/admin-dashboard/orders" },
  // { label: "Settings", href: "/admin-dashboard/settings" },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    dispatch(LogOut);
    dispatch(setUser(null));
    dispatch(setToken(null));
    router.push("/");
  };

  return (
    // <aside className="h-screen w-64 pt-20 bg-gray-800 text-white fixed top-0 left-0 shadow-lg">
    <aside className="sticky top-20 h-[calc(100vh-5rem)] w-full bg-gray-800 text-white shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 hover:bg-gray-700 ${
                  pathname === item.href ? "bg-gray-700 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logout button styled like nav links */}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="block text-left px-4 py-2 hover:bg-gray-700 w-full"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
