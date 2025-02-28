"use client";
import { ColorModeContext } from "@/app/context/ThemeContext";
import { useAppSelector } from "@/shared/redux/hooks";
import { Box, Button, CssBaseline } from "@mui/material";
import { useContext } from "react";
import { MdSunny } from "react-icons/md";
import { MdNightlight } from "react-icons/md";

export default function ThemeChanger() {
  const { toggleColorMode } = useContext(ColorModeContext);
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <>
      <CssBaseline enableColorScheme />
      <Box>
        <Button
          variant="outlined"
          onClick={toggleColorMode}
          sx={{ border: "2px solid" }}
        >
          {mode === "dark" ? (
            <MdSunny style={{ fontSize: "1.5rem" }} />
          ) : (
            <MdNightlight style={{ fontSize: "1.5rem" }} />
          )}
        </Button>
      </Box>
    </>
  );
}
