import { Box, Grid } from "@mui/material";
import Chat from "@/widgets/Chat/ui/Chat";
import ProtectedRoute from "@/features/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  );
}
