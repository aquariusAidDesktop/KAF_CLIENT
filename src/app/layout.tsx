import Providers from "@/shared/providers/providers";
import ToggleColorMode from "../features/ThemeToggler/model/ThemeContext";
import { Box, Grid2 } from "@mui/material";
import AbilitySide from "@/widgets/AbilitySide/ui/AbilitySide";
import "normalize.css/normalize.css";
import "./global.css";
import UserStatus from "@/shared/services/UserStatusFN";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "бот",
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
              <Grid2 container sx={{ height: "100%", mt: { xs: 4, sm: 0 } }}>
                <AbilitySide />
                <UserStatus />
                {children}
              </Grid2>
            </Box>
          </ToggleColorMode>
        </Providers>
      </body>
    </html>
  );
}
