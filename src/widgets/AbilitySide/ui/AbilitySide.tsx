"use client";

import { Box, Grid2 } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import routesConfig from "@/widgets/AbilitySide/model/routesConfig";

export default function AbilitySide() {
  const pathname = usePathname();

  return (
    <Grid2
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        {routesConfig.map((route) => {
          const Icon = route.icon;
          const active = route.isActive(pathname);

          return (
            <Link key={route.path} href={route.path}>
              <Box sx={{ cursor: "pointer", p: "2px" }}>
                <Icon
                  style={{
                    fontSize: active ? "1.7rem" : "1.7rem",
                    color: active ? "tomato" : "#0DE6BE",
                  }}
                  title={route.label}
                />
              </Box>
            </Link>
          );
        })}
      </Box>
    </Grid2>
  );
}
