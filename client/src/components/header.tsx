"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full backdrop-blur-md z-50 border-b text-black bg-white/90">
      <nav className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={"/logo.png"}
            alt="the-makeup-studio"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Hamburger menu button for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Buttons for md and up */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="text-black">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full text-center text-black"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              <Button className="w-full text-center">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";
// import { LogOut } from "@/services/operations/authAPI";
// import { setUser } from "@/store/slices/profileSlice";
// import { setToken } from "@/store/slices/authSlice";

// const Navbar = () => {
//   const { user, loading } = useAppSelector((state) => state.profile);
//   const [menuOpen, setMenuOpen] = useState(false);
//   if (loading) return null;

//   return (
//     <header className="fixed top-0 w-full backdrop-blur-md z-50 border-b text-black">
//       <nav className="mx-auto px-4 py-4 flex items-center justify-between">
//         {/* Logo and Home Link */}
//         <Link href="/" className="flex items-center">
//           <Image
//             src={"/logo.png"}
//             alt="the-makeup-studio"
//             width={200}
//             height={60}
//             className="h-12 w-auto object-contain"
//           />
//         </Link>

//         {/* Right Side of Navbar */}
//         <div className="flex items-center gap-4">
//           <>
//             <Link href="/login">
//               <Button variant="outline" className="text-black">
//                 Login
//               </Button>
//             </Link>
//             <Link href="/signup">
//               <Button>Sign Up</Button>
//             </Link>
//           </>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
