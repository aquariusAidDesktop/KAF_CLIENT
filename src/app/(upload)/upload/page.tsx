import ProtectedRoute from "@/features/ProtectedRoute/ProtectedRoute";
import UploadPage from "@/widgets/UploadPage/ui/UploadPage";
import { Box, Grid, Typography } from "@mui/material";

export default function Home() {
  return (
    <ProtectedRoute>
      <UploadPage />
    </ProtectedRoute>
  );
}
