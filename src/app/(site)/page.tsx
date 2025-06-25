"use client";

import { Box, Button, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUpload, FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import "./global.css";
import ProtectedRoute from "@/features/ProtectedRoute/ui/ProtectedRoute";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <FiUpload color="#0DE6BE" size={30} />,
      title: "Легкая загрузка",
      description: "Поддержка PDF с возможностями предпросмотра",
      route: "/upload",
    },
    {
      icon: <FiSearch color="#0DE6BE" size={30} />,
      title: "Умный поиск",
      description:
        "Выбирайте между семантичиским, гибридным и поиском по ключевым словам",
      route: "/search",
    },
    {
      icon: <GoHistory color="#0DE6BE" size={30} />,
      title: "История чатов",
      description: "Отслеживайте и возвращайтесь к предыдущим запросам",
      route: "/history",
    },
  ];

  return (
    <ProtectedRoute>
      <Grid2
        container
        size="grow"
        flexDirection={"column"}
        alignItems={"center"}
        sx={{
          backgroundColor: "background",
          p: 2,
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            mt: 4,
            px: 1.5,
            py: 1.2,
            borderRadius: 2,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, #0DE6BE22 0%, #161B22 100%)`
                : `linear-gradient(135deg, #e0f7f4 0%, #fff 100%)`,
            boxShadow: 2,
            maxWidth: "900px",
            width: "100%",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#0DE6BE" : "#00bfae",
              fontFamily: "Montserrat, Arial, sans-serif",
              mb: 1,
              textShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 12px #0DE6BE44"
                  : "0 2px 8px #00bfae22",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            Интелектуальный текстовый агент — МАФ
          </Typography>
          <Typography
            variant="body1"
            component="h2"
            sx={{
              color: (theme) =>
                theme.palette.mode === "dark" ? "#C9D1D9" : "#222",
              fontFamily: "Nunito, Arial, sans-serif",
              fontWeight: 300,
              lineHeight: 1.4,
              fontSize: { xs: "0.98rem", sm: "1.08rem", md: "1.15rem" },
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(22,27,34,0.7)"
                  : "rgba(255,255,255,0.85)",
              borderRadius: 1.5,
              px: 1.5,
              py: 0.7,
              display: "inline-block",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 8px 0 #0DE6BE22"
                  : "0 2px 8px 0 #00bfae22",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            Загрузите книги и разблокируйте новые возможности с вашим ИИ агентом.
            <br />
            Быстрый поиск, понимание смысла и контекста диалога. <br />
            Используйте проверенную информацию из достоверных источников.
          </Typography>
        </Box>

        <Grid2
          mt={9}
          gap={9}
          sx={{
            width: "85vw",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={feature.title}
              onClick={() => router.push(feature.route)}
              sx={{
                backgroundColor: "background.paper",
                p: 3,
                borderRadius: "20px",
                cursor: "pointer",
                minWidth: "22%",
                maxWidth: "22%",
                opacity: 0,
                transform: "translateY(40px) scale(0.9)",
                animationName: "fadeInUp",
                animationDuration: "0.6s",
                animationTimingFunction: "ease-out",
                animationFillMode: "forwards",
                animationDelay: `${index * 0.4}s`,
                transition:
                  "box-shadow 0.3s cubic-bezier(.4,2,.6,1), transform 0.3s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  boxShadow: 8,
                  transform: "translateY(-8px) scale(1.03)",
                },
              }}
            >
              {feature.icon}
              <Typography mt={3} variant="h5">
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ width: "100%", mt: 2 }}>
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Grid2>

        <Button
          variant="contained"
          sx={{
            mt: "10vh",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: "#0DE6BE",
            },
          }}
          onClick={() => router.push("/upload")}
        >
          <Typography p={1}>Загрузить книги</Typography>
          <FaArrowRightLong />
        </Button>
      </Grid2>
    </ProtectedRoute>
  );
}
