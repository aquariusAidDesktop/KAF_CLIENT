"use client";

import { useState, useContext } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Grid2,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Input,
  TextField,
} from "@mui/material";
import { ColorModeContext } from "./ThemeContext";
import { MdNightlight } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { useAppSelector } from "@/lib/redux/hooks";

const steps = ["Выбор товара", "Доставка", "Оплата", "Подтверждение"];

export default function Checkout() {
  const { toggleColorMode } = useContext(ColorModeContext);
  const mode = useAppSelector((state) => state.theme.mode);
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ height: "100vh" }}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1.2rem" }}>
        <Button variant="outlined" onClick={toggleColorMode}>
          {mode === "dark" ? (
            <CiLight style={{ fontSize: "1.5rem" }} />
          ) : (
            <MdNightlight style={{ fontSize: "1.5rem" }} />
          )}
        </Button>
      </Box>

      <Grid2
        container
        component="div"
        sx={{
          height: "100%",
          backgroundColor: "pink",
          mt: { xs: 2, sm: 0 },
        }}
      >
        {/* Левая панель */}
        <Grid2
          component="div"
          size={{ xs: 12, sm: 5, md: 2 }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
            alignItems: "center",
            p: 1,
            gap: 2,
          }}
        >
          <Typography variant="h6">Разработка истории чатов</Typography>
        </Grid2>

        {/* Основной контент */}
        <Grid2
          component="div"
          size={{ xs: 12, sm: 7, md: 10 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            height: "100%",
          }}
        >
          {/* Прокручиваемая область */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0, // Позволяет корректно вычислить высоту внутри flex-контейнера
              width: "100%",
              overflowY: "auto",
              pt: { xs: 2, sm: 4 },
              px: { xs: 2, sm: 4 },
              gap: 4,
            }}
          >
            {/* Обёртка для центрирования и ограничения ширины */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{ width: "100%" }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Пример карточек */}
              {Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} sx={{ width: "100%" }}>
                  <CardContent>
                    <Typography variant="body1">
                      {`Элемент ${index + 1}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Фиксированная область с кнопками */}
          <Box
            sx={{
              width: "100%",
              mx: "auto",
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextField
              label="Введите текст"
              variant="filled"
              sx={{ width: "80%" }}
              margin="none"
            />
            <Button onClick={handleNext} variant="contained" size="medium">
              Отправить
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}
