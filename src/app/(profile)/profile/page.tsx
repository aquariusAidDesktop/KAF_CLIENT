import ProtectedRoute from "@/widgets/AuthForm/ui/ProtectedRoute";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Typography>Профиль</Typography>
      </ProtectedRoute>
    </>
  );
}
