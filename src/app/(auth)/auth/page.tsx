import LoginForm from "@/features/LoginForm/ui/LoginForm";
import RegisterForm from "@/features/RegisterForm/ui/RegisterForm";
import AuthForm from "@/widgets/AuthForm/ui/AuthForm";
import { Grid2 } from "@mui/material";

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
