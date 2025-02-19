import { Box, Grid } from "@mui/material";
import Chat from "@/components/searchPage/Chat";
import HistoryChats from "@/components/searchPage/HistoryChats";
import ThemeChanger from "@/components/lib/ThemeChanger";

export default function Home() {
  return (
    <Box sx={{ height: "100vh" }}>
      <ThemeChanger />
      <Grid container sx={{ height: "100%", mt: { xs: 2, sm: 0 } }}>
        <HistoryChats />
        <Chat />
      </Grid>
    </Box>
  );
}
