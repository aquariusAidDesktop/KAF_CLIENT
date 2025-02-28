"use client";

import { Grid, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeChanger from "../lib/ThemeChanger";
import routesConfig from "@/app/routesConfig";

export default function AbilitySide() {
  const pathname = usePathname();

  return (
    <Grid
      item
      xs={0}
      md={1}
      sx={{
        display: { xs: "none", md: "flex" },
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
              <Icon
                style={{
                  fontSize: active ? "2rem" : "1.7rem",
                  cursor: "pointer",
                  color: active ? "tomato" : "inherit",
                }}
                title={route.label} // Можно использовать как подсказку
              />
            </Link>
          );
        })}
      </Box>
      <ThemeChanger />
    </Grid>
  );
}
