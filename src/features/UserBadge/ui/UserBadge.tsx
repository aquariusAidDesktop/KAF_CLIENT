"use client";

import { useAuth } from "@/widgets/AuthForm/model/useAuth";
import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export const UserBadger: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <Box
      onClick={() => {
        router.push("/profile");
      }}
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 40,
        height: 40,
        backgroundColor: "#FBC02D",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff",
        fontSize: 16,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {typeof user.name === "string" && user.name.length > 0
        ? user.name.slice(0, 2).toUpperCase()
        : "??"}
    </Box>
  );
};
