import ProtectedRoute from "@/features/ProtectedRoute/ProtectedRoute";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Typography>История чатов</Typography>
      </ProtectedRoute>
    </>
  );
}
