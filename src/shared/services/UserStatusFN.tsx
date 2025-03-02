"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/redux/hooks";

export default function UserStatus() {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (
      !user.isAuthenticated &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/"
    ) {
      router.push("/auth");
    }
  }, [user, router]);

  return null;
}
