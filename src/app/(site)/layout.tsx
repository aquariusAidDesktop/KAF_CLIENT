import Providers from "@/shared/providers/providers";
import ToggleColorMode from "../../shared/themeContext/ThemeContext";
import { Box, Grid2 } from "@mui/material";
import AbilitySide from "@/widgets/AbilitySide/ui/AbilitySide";
import "normalize.css/normalize.css";
import "./global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "МАФ | ИИ Агент",
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
              <Grid2 container sx={{ height: "100%", mt: { xs: 0, sm: 0 } }}>
                <AbilitySide />
                {children}
              </Grid2>
            </Box>
          </ToggleColorMode>
        </Providers>
      </body>
    </html>
  );
}
