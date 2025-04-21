"use client";

import ProtectedRoute from "@/features/ProtectedRoute/ProtectedRoute";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUpload, FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import "./global.css";

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
        }}
      >
        <Typography variant="h3" pt="3vh" component="h1">
          Интелектуальный текстовый агент - МАФ
        </Typography>
        <Typography
          pt="4vh"
          component="h2"
          sx={{ maxWidth: "70vw", textAlign: "center", fontSize: "1.2rem" }}
        >
          Загрузите книги и разблокируйте новые возможности с вашим ИИ агентом.
          Быстрый поиск, понимание смысла и контекста диалога. Используйте
          проверенную информацию из достоверных источников.
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: "7vh",
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

        <Grid2
          mt={10}
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
      </Grid2>
    </ProtectedRoute>
  );
}
