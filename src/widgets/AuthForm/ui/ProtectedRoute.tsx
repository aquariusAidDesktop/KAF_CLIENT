"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/redux/hooks";
import { UserBadger } from "@/features/UserBadge/ui/UserBadge";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? (
    <>
      <UserBadger />
      {children}
    </>
  ) : null;
}
