"use client";
import { useState } from "react";
import { TextField, Button, Box, Typography, Switch } from "@mui/material";
import { useAppDispatch } from "@/shared/redux/hooks";
import { authService } from "@/shared/services/authService";
import { setUser } from "@/shared/redux/slices/userSlice";
import { motion } from "framer-motion";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = isLogin
        ? await authService.login(email, password)
        : await authService.register(name, email, password);
      dispatch(setUser(user));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "#3b82f6",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isLogin ? "Login" : "Signup"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {!isLogin && (
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              fullWidth
            />
          )}
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth>
            {isLogin ? "Login" : "Signup"}
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Typography>
          <Switch checked={!isLogin} onChange={() => setIsLogin(!isLogin)} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default AuthForm;
