import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import OfflineVoiceInput from "@/widgets/VoiceInput/model/OfflineVoiceInput";

export default function ControlPanel({
  newMessage,
  setNewMessage,
  handleKeyDown,
  isLoadingAnswer,
  searchType,
  setSearchType,
  sendMessage,
  mode,
}: any) {
  const [listening, setListening] = useState(false);

  // Обёртка для безопасного обновления newMessage
  const safeSetNewMessage = (text: string) => {
    try {
      setNewMessage(text);
    } catch (err) {
      console.error("Ошибка обновления newMessage:", err);
    }
  };

  // Обработчик изменения input с отловом ошибок
  const safeHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      safeSetNewMessage(e.target.value);
    } catch (err) {
      console.error("Ошибка при изменении input:", err);
    }
  };

  // Обработчик нажатия клавиш
  const safeHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    try {
      handleKeyDown(e);
    } catch (err) {
      console.error("Ошибка в обработчике keyDown:", err);
    }
  };

  // Обёртка для отправки сообщения
  const safeSendMessage = () => {
    try {
      sendMessage();
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
    }
  };

  return (
    <>
      {/* Монтируем компонент офлайн-распознавания */}
      <OfflineVoiceInput
        onResult={(text) => {
          try {
            safeSetNewMessage(text);
          } catch (err) {
            console.error(
              "Ошибка при получении результата голосового ввода:",
              err
            );
          }
        }}
        listening={listening}
        setListening={setListening}
      />

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background",
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* Текстовое поле */}
          <Box
            id="composer-background"
            sx={{
              display: "flex",
              flexDirection: "column",
              cursor: "text",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "24px",
              px: 2,
              py: 1,
              transition: "all 150ms ease-in-out",
              backgroundColor:
                mode === "dark" ? "#303030" : "background.default",
            }}
          >
            <TextField
              fullWidth
              multiline
              placeholder="Искать в хранилище"
              variant="standard"
              value={newMessage}
              onChange={safeHandleChange}
              onKeyDown={safeHandleKeyDown}
              disabled={isLoadingAnswer}
              sx={{ maxHeight: "15vh", overflowY: "auto" }}
              InputProps={{
                disableUnderline: true,
                sx: {
                  px: 0,
                  py: 0,
                  fontSize: "1.1rem",
                  color: mode === "dark" ? "#D1D5DB" : "#202123",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: 1,
                mr: "1rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Тип поиска</InputLabel>
                <Select
                  label="Тип поиска"
                  value={searchType}
                  onChange={(e) => {
                    try {
                      setSearchType(e.target.value as string);
                    } catch (err) {
                      console.error("Ошибка при смене типа поиска:", err);
                    }
                  }}
                  disabled={isLoadingAnswer}
                >
                  <MenuItem value="1">Гибридный поиск (alpha: 0.7)</MenuItem>
                  <MenuItem value="2">
                    Семантический (по сходству векторов)
                  </MenuItem>
                  <MenuItem value="3">Ключевые слова</MenuItem>
                </Select>
              </FormControl>

              {/* Кнопка для отправки сообщения */}
              <Button
                onClick={safeSendMessage}
                disabled={newMessage.trim() === "" || isLoadingAnswer}
                variant="contained"
                size="medium"
              >
                {isLoadingAnswer ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Поиск"
                )}
              </Button>
            </Box>

            {/* Кнопка для включения/выключения микрофона */}
            <Button
              onClick={() => {
                try {
                  setListening((prev: boolean) => !prev);
                } catch (err) {
                  console.error("Ошибка при переключении прослушивания:", err);
                }
              }}
              variant={listening ? "outlined" : "contained"}
              color={listening ? "error" : "primary"}
            >
              {listening ? "Стоп" : "Голос"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
