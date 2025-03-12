"use client";
import { useEffect, useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../model/useAuth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const { login, register, fetchUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "22rem",
        width: "27rem",
        maxWidth: "27rem",
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h2" textAlign="center">
        {isRegistering ? "Регистрация" : "Вход"}
      </Typography>
      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {isRegistering && (
          <TextField
            label="Имя"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isRegistering ? "Зарегистрироваться" : "Войти"}
        </Button>
      </form>
      <Button
        onClick={() => setIsRegistering(!isRegistering)}
        variant="text"
        color="secondary"
      >
        {isRegistering ? "Войти" : "Зарегистрироваться"}
      </Button>
    </Box>
  );
}
