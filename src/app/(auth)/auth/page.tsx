"use client";
import AuthForm from "@/widgets/AuthForm/ui/AuthForm";
import { Grid2 } from "@mui/material";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <Grid2
        size={"grow"}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <AuthForm />
      </Grid2>
    </>
  );
}
