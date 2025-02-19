import { Grid, Typography } from "@mui/material";

export default function HistoryChats() {
  return (
    <>
      <Grid
        item
        xs={0}
        md={2}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          backgroundColor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          alignItems: "center",
          p: 1,
          gap: 2,
        }}
      >
        <Typography variant="h6">Разработка истории чатов...</Typography>
      </Grid>
    </>
  );
}
