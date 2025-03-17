"use client";

import { useAuth } from "@/widgets/AuthForm/model/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return <div>{user.name}</div>;
}
