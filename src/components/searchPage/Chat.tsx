"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { io, Socket } from "socket.io-client";

// Интерфейс для сообщений чата
interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
}

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);

  const assistantBg = mode === "dark" ? "#343541" : "#F7F7F7";
  const assistantTextColor = mode === "dark" ? "#D1D5DB" : "#202123";
  const userBg = mode === "dark" ? "#444654" : "#E5E5EA";
  const userTextColor = mode === "dark" ? "#FFFFFF" : "#202123";

  // Состояния для сообщений, текущего запроса и выбора типа поиска
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "assistant", text: "Чем могу помочь?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchType, setSearchType] = useState("1");

  // Хранение экземпляра сокета
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Инициализация подключения к Socket.IO серверу
    socketRef.current = io("http://localhost:4000");

    // Слушатель получения сообщений от сервера
    socketRef.current.on("chat message", (msg: any) => {
      // Если сервер отправляет строку
      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { sender: "assistant", text: msg }]);
      }
      // Если сервер отправляет объект с полем text
      else if (typeof msg === "object" && msg.text) {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: msg.text, searchType: msg.searchType },
        ]);
      }
    });

    // Очистка сокета при размонтировании компонента
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Функция отправки сообщения (запроса)
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const payload = { text: newMessage, searchType };
    // Отправка на сервер (при необходимости, сервер можно модифицировать для обработки объектов)
    socketRef.current?.emit("chat message", payload);

    // Локальное обновление списка сообщений (от пользователя)
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);
    setNewMessage("");
  };

  // Отправка по нажатию Enter (без Shift)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={10}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: { xs: "transparent", sm: "background.default" },
        height: "100%",
      }}
    >
      {/* Область для сообщений */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflowY: "auto",
          pt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 },
          pb: 16, // Отступ снизу для композера
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  backgroundColor: msg.sender === "user" ? userBg : assistantBg,
                  color:
                    msg.sender === "user" ? userTextColor : assistantTextColor,
                  p: 2,
                  borderRadius: 2,
                  maxWidth: "80%",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                {msg.searchType && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Тип поиска: {msg.searchType}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Композер: ввод запроса, выбор типа поиска и кнопка "Поиск" */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background.paper",
          p: 2,
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
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
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

          {/* Ряд с выбором типа поиска и кнопкой "Поиск" */}
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
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <MenuItem value="1">Гибридный поиск (alpha: 0.7)</MenuItem>
                  <MenuItem value="2">
                    Поиск по сходству векторов (смысловой поиск)
                  </MenuItem>
                  <MenuItem value="3">Поиск по ключевым словам</MenuItem>
                </Select>
              </FormControl>
              <Button
                onClick={sendMessage}
                disabled={newMessage.trim() === ""}
                variant="contained"
                size="medium"
              >
                Поиск
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
