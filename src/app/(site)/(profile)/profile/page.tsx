import ProtectedRoute from "@/features/ProtectedRoute";
import ProfilePage from "@/widgets/ProfilePage/ui/ProfilePage";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    </>
  );
}
