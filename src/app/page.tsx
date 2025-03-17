"use client";

import ProtectedRoute from "@/features/ProtectedRoute/ProtectedRoute";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { FiUpload, FiSearch } from "react-icons/fi";
import { GoHistory } from "react-icons/go";

export default function Home() {
  const router = useRouter();

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
          Интелектуальный текстовый агент
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
          sx={{ mt: "7vh" }}
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
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: 3,
              borderRadius: "20px",
              cursor: "pointer",
              minWidth: "22%",
              maxWidth: "22%",
            }}
            onClick={() => router.push("/upload")}
          >
            <FiUpload color="#2563EB" size={30} />
            <Typography mt={3} variant="h5">
              Легкая загрузка
            </Typography>
            <Typography variant="body2" sx={{ width: "100%", mt: 2 }}>
              Поддержка PDF с возможностями предпросмотра
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "20px",
              cursor: "pointer",
              p: 3,
              minWidth: "22%",
              maxWidth: "22%",
            }}
            onClick={() => router.push("/search")}
          >
            <FiSearch color="#2563EB" size={30} />
            <Typography mt={3} variant="h5">
              Умный поиск
            </Typography>
            <Typography variant="body2" sx={{ width: "100%", mt: 2 }}>
              Выбирайте между семантичиским, гибридным и поиском по ключевым
              словам
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "background.paper",
              p: 3,
              borderRadius: "20px",
              cursor: "pointer",
              minWidth: "22%",
              maxWidth: "22%",
            }}
            onClick={() => router.push("/history")}
          >
            <GoHistory color="#2563EB" size={30} />
            <Typography mt={3} variant="h5">
              История чатов
            </Typography>
            <Typography variant="body2" sx={{ width: "100%", mt: 2 }}>
              Отслеживайте и возвращайтесь к предыдущим запросам
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </ProtectedRoute>
  );
}
