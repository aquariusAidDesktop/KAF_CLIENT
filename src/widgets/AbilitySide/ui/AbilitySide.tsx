"use client";

import { Grid, Box, Grid2 } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeChanger from "@/features/themeToggler/ui/ThemeChanger";
import routesConfig from "@/widgets/AbilitySide/model/routesConfig";

export default function AbilitySide() {
  const pathname = usePathname();

  return (
    <Grid
      container
      xs={0}
      md={1}
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
                    fontSize: active ? "2rem" : "1.7rem",
                    color: active ? "tomato" : "inherit",
                  }}
                  title={route.label}
                />
              </Box>
            </Link>
          );
        })}
      </Box>
      <ThemeChanger />
    </Grid>
  );
}
