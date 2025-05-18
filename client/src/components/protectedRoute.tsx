"use client";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const router = useRouter();
  const { user, loading } = useAppSelector((state) => state.profile);
  useEffect(() => {
    if (!loading && user && user.role) {
      if (!allowedRoles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading]);

  if (loading || !user) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
