"use client";

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { toggleTheme } from "@/shared/redux/slices/themeSlice";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";

declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      blockquoteBg: string;
      codeBg: string;
      tableHeaderBg: string;
      assistantBackground: string;
      userBackground: string;
      controlPanelBackground: string;
    };
  }
  interface ThemeOptions {
    customColors?: {
      blockquoteBg?: string;
      codeBg?: string;
      tableHeaderBg?: string;
      assistantBackground?: string;
      userBackground?: string;
      controlPanelBackground?: string;
    };
  }
}

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

  const theme = React.useMemo(() => {
    const darkCustomColors = {
        blockquoteBg: "#2C3E50",
        codeBg: "#1E293B",
        tableHeaderBg: "#374151",
        assistantBackground: "#242633",
        userBackground: "#444654",
        controlPanelBackground: "#303030",
      },
      lightCustomColors = {
        blockquoteBg: "#F1F5F9",
        codeBg: "#334155",
        tableHeaderBg: "#E2E8F0",
        assistantBackground: "#F7F7F7",
        userBackground: "#F7F7F7",
        controlPanelBackground: "#FFFFFF",
      };
    return createTheme({
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
          main: "#0DE6BE",
          light: "#3B82F6",
          dark: "#0DE6BE",
        },
        secondary: {
          main: "#0DE6BE",
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
      customColors: mode === "dark" ? darkCustomColors : lightCustomColors,
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
