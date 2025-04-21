"use client";

import { useAuth } from "@/widgets/AuthForm/model/useAuth";
import React, { useState } from "react";
import { Box } from "@mui/material";
import SettingsPanel from "@/features/SettingsPanel/ui/SettingsPanel";

export const UserBadger: React.FC = () => {
  const { user } = useAuth();
  const [isOpenWindow, setIsOpenWindow] = useState(false);

  if (!user.isAuthenticated) {
    return undefined;
  }

  const onClose = () => {
    setIsOpenWindow(false);
  };

  return (
    <>
      <Box
        onClick={() => {
          setIsOpenWindow(!isOpenWindow);
        }}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 35,
          height: 35,
          backgroundColor: "#0de6be",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontWeight: "bold",
          color: "black",
          fontSize: 14,
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
      {isOpenWindow && <SettingsPanel open={isOpenWindow} onClose={onClose} />}
    </>
  );
};
