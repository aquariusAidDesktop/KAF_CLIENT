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

  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
