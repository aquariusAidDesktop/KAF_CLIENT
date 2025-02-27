import ToggleColorMode from "./ThemeContext";
import "normalize.css/normalize.css";
import type { Metadata } from "next";
import Providers from "./providers";
import "./_assets/global.css";
import { Box, Grid } from "@mui/material";
import ThemeChanger from "@/components/lib/ThemeChanger";
import AbilitySide from "@/components/searchPage/AbilitySide";

export const metadata: Metadata = {
  title: "Властелин",
  description: "Text AI Chat Bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <ToggleColorMode>
            <Box sx={{ height: "100vh" }}>
              <Grid container sx={{ height: "100%", mt: { xs: 2, sm: 0 } }}>
                <AbilitySide />
                {children}
              </Grid>
            </Box>
          </ToggleColorMode>
        </Providers>
      </body>
    </html>
  );
}
