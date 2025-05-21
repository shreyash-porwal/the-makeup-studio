"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { LogOut } from "@/services/operations/authAPI";
import { setUser } from "@/store/slices/profileSlice";
import { setToken } from "@/store/slices/authSlice";

type AdminNavbarProps = {
  onMenuToggle?: () => void;
};

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuToggle }) => {
  const { user, loading } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(LogOut);
    dispatch(setUser(null));
    dispatch(setToken(null));
    router.push("/");
  };
  if (loading) return;

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md z-50 border-b bg-white text-black shadow">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        {/* Left: Logo + toggle */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo.png"
              alt="the-makeup-studio"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
            />
            <span className="ml-2 text-xs font-light text-red-500 hidden sm:inline">
              Admin
            </span>
          </Link>
        </div>

        {/* Right: User + toggle button */}
        <div className="flex items-center gap-x-4 text-sm">
          {user && (
            <span className="hidden md:inline font-medium">
              Welcome, {user.firstName}
            </span>
          )}

          {/* Sidebar toggle button for mobile */}
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="md:hidden focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { Button } from "../ui/button";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";
// import { LogOut } from "@/services/operations/authAPI";
// import { setUser } from "@/store/slices/profileSlice";
// import { setToken } from "@/store/slices/authSlice";

// const AdminNavbar = () => {
//   const { user, loading } = useAppSelector((state) => state.profile);
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const handleLogout = async () => {
//     dispatch(LogOut);
//     dispatch(setUser(null));
//     dispatch(setToken(null));
//     router.push("/");
//   };
//   return (
//     <header className="fixed top-0 w-full backdrop-blur-md z-50 border-b text-black">
//       <nav className="mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo and Home Link */}
//         <Link href="/admin" className="flex items-center">
//           <Image
//             src={"/logo.png"}
//             alt="the-makeup-studio"
//             width={200}
//             height={60}
//             className="h-12 w-auto object-contain"
//           />

//           <span className="ml-2 text-xs font-light text-red-500">Admin</span>
//         </Link>

//         {/* Right Side of Navbar */}
//         <div className="flex items-center gap-4">
//           <>
//             <span className="text-sm font-medium">
//               Welcome, {user?.firstName}
//             </span>

//             {/* Conditional Profile Link */}
//             <Link href="/admin-dashboard">
//               <Button variant="ghost">Admin Profile</Button>
//             </Link>

//             <Button onClick={handleLogout} variant="destructive">
//               Logout
//             </Button>
//           </>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default AdminNavbar;
