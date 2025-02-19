"use client";
import { ColorModeContext } from "@/app/ThemeContext";
import { useAppSelector } from "@/lib/redux/hooks";
import { Box, Button, CssBaseline } from "@mui/material";
import { useContext } from "react";
import { CiLight } from "react-icons/ci";
import { MdNightlight } from "react-icons/md";

export default function ThemeChanger() {
  const { toggleColorMode } = useContext(ColorModeContext);
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1.2rem" }}>
        <Button variant="outlined" onClick={toggleColorMode}>
          {mode === "dark" ? (
            <CiLight style={{ fontSize: "1.5rem" }} />
          ) : (
            <MdNightlight style={{ fontSize: "1.5rem" }} />
          )}
        </Button>
      </Box>
    </>
  );
}
