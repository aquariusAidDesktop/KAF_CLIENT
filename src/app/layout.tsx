import ToggleColorMode from "./context/ThemeContext";
import { Box, Grid } from "@mui/material";
import type { Metadata } from "next";
import Providers from "./providers/providers";
import AbilitySide from "@/widgets/AbilitySide/ui/AbilitySide";
import "normalize.css/normalize.css";
import "./global.css";

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
