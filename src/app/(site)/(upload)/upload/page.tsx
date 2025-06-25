import ProtectedRoute from "@/features/ProtectedRoute";
import UploadPage from "@/widgets/UploadPage/ui/UploadPage";

export default function Home() {
  return (
    <ProtectedRoute>
      <UploadPage />
    </ProtectedRoute>
  );
}
