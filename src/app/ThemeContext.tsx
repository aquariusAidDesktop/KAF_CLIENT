"use client";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function ToggleColorMode({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => dispatch(toggleTheme()),
    }),
    [dispatch]
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#0D1117" : "#E8E8EC",
            paper: mode === "dark" ? "#161B22" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#C9D1D9" : "#111827",
            secondary: "#8B949E",
            disabled: "#484F58",
          },
          primary: {
            main: "#2563EB",
            light: "#3B82F6",
            dark: "#1E40AF",
          },
          secondary: {
            main: "#1F6FEB",
            light: "#58A6FF",
            dark: "#1C4F9B",
          },
          divider: "#30363D",
          error: {
            main: "#DA3633",
            light: "#FF7B72",
            dark: "#A91511",
          },
          warning: {
            main: "#E3B341",
          },
          success: {
            main: "#2EA043",
          },
          info: {
            main: "#58A6FF",
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
