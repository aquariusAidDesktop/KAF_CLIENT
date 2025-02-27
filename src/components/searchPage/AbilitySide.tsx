import { Box, Grid, Typography } from "@mui/material";
import { FiBook } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import ThemeChanger from "../lib/ThemeChanger";

export default function AbilitySide() {
  return (
    <>
      <Grid
        item
        xs={0}
        md={1}
        sx={{
          display: { xs: "none", md: "flex" },
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
          <FiBook style={{ fontSize: "2.5rem", cursor: "pointer" }} />
          <FiUpload style={{ fontSize: "1.7rem", cursor: "pointer" }} />
          <FiSearch style={{ fontSize: "1.7rem", cursor: "pointer" }} />
          <GoHistory style={{ fontSize: "1.7rem", cursor: "pointer" }} />
        </Box>
        <ThemeChanger />
      </Grid>
    </>
  );
}
