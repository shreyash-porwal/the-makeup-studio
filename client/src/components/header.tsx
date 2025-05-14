"use client";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { LogOut } from "@/services/operations/authAPI";
import { setUser } from "@/store/slices/profileSlice";
import { setToken } from "@/store/slices/authSlice";

const Navbar = () => {
  const user: any = useAppSelector((state) => state.profile.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  console.log("usr======", user);
  const handleLogout = async () => {
    // clear user and token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    await LogOut();
    router.push("/login");
    dispatch(setUser(null));
    dispatch(setToken(null));
    window.location.reload();
  };

  const isAdmin = user?.role === "Admin";

  return (
    <header className="fixed top-0 w-full backdrop-blur-md z-50 border-b bg-gray-50 text-black">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Home Link */}
        <Link href={isAdmin ? "/admin" : "/"} className="flex items-center">
          <Image
            src={"/logo.png"}
            alt="the-makeup-studio"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          {isAdmin && (
            <span className="ml-2 text-xs font-light text-red-500">Admin</span>
          )}
        </Link>

        {/* Right Side of Navbar */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" className="text-black">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : user?.role === "Admin" ? (
            <>
              <span className="text-sm font-medium">
                Welcome, {user?.firstName}
              </span>
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost">Admin Panel</Button>
                </Link>
              )}
              {!isAdmin && (
                <Link href="/dashboard/my-profile">
                  <Button variant="ghost">My Profile</Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">
                Welcome, {user?.firstName}
              </span>
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost">User Panel</Button>
                </Link>
              )}
              {!isAdmin && (
                <Link href="/dashboard/my-profile">
                  <Button variant="ghost">User Profile</Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import { ArrowLeft, Heart } from "lucide-react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { useAppSelector } from "@/store/hooks";

// const Navbar = () => {
//   const user: any = useAppSelector((state: RootState) => state.profile.user);
//   const token = useAppSelector((state: RootState) => state.auth.token);

//   const isAdmin = user?.role === "Admin";
//   const isAdminPage = isAdmin;

//   return (
//     <header className="fixed top-0 w-full  backdrop-blur-md z-50 border-b bg-gray-50">
//       <nav className="mx-auto px-4 py-4 flex items-center justify-between">
//         <Link href={isAdminPage ? "/admin" : "/"} className="flex">
//           <Image
//             src={"/logo.png"}
//             alt="Vehicle-AI Logo"
//             width={200}
//             height={60}
//             className="h-12 w-auto object-contain"
//           ></Image>
//           {isAdminPage && (
//             <span className="text-xs font-extralight">admin</span>
//           )}
//         </Link>
//         <div>
//           {/* <p>isAuthenticated == {isAuthenticated ? user?.role : "nothing"}</p>
//           <p>user == {user?.name}</p> */}
//           Hello
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
