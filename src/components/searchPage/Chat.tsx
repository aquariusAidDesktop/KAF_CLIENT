"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import {
  Box,
  Button,
  CircularProgress,
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

interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  loading?: boolean;
  id?: string;
}

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);

  // Основные цвета для сообщений
  const assistantBg = mode === "dark" ? "#343541" : "#F7F7F7";
  const assistantTextColor = mode === "dark" ? "#D1D5DB" : "#202123";
  const userBg = mode === "dark" ? "#444654" : "#E5E5EA";
  const userTextColor = mode === "dark" ? "#FFFFFF" : "#202123";

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "assistant", text: "Чем могу помочь?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchType, setSearchType] = useState("1");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // При изменении списка сообщений плавно скроллим вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5041");

    socketRef.current.on("chat message", (msg: any) => {
      // Удаляем загрузочные сообщения
      setMessages((prev) => prev.filter((m) => !m.loading));

      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { sender: "assistant", text: msg }]);
      } else if (typeof msg === "object" && msg.text) {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: msg.text, searchType: msg.searchType },
        ]);
      }
      setIsLoadingAnswer(false);
    });

    socketRef.current.on("loading answer", (data: any) => {
      // Обновляем текст загрузочного сообщения
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "loading" ? { ...msg, text: data.text } : msg
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() === "" || isLoadingAnswer) return;

    const payload = { text: newMessage, searchType };
    socketRef.current?.emit("chat message", payload);

    // Добавляем сообщение пользователя
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);

    // Добавляем сообщение загрузки с первым статусом
    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text: "Вычисляем пространство векторов…",
        loading: true,
        id: "loading",
      },
    ]);

    setNewMessage("");
    setIsLoadingAnswer(true);
  };

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
          scrollBehavior: "smooth",
          pt: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 4 },
          pb: 16,
          // Стилизация скроллбара для плавного появления
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
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
                  backgroundColor:
                    msg.sender === "user"
                      ? userBg
                      : msg.loading
                      ? "#b0bec5" // читаемый фон для загрузочного сообщения
                      : assistantBg,
                  color:
                    msg.sender === "user"
                      ? userTextColor
                      : msg.loading
                      ? "#000000" // текст для загрузочного сообщения
                      : assistantTextColor,
                  p: 2,
                  borderRadius: 2,
                  maxWidth: "80%",
                  boxShadow: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  opacity: msg.loading ? 0.7 : 1,
                }}
              >
                {msg.loading && (
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                )}
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
          {/* Контейнер для автоскролла */}
          <div ref={messagesEndRef} />
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
              disabled={isLoadingAnswer} // блокируем ввод, если идёт генерация ответа
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
                  disabled={isLoadingAnswer} // блокируем выбор типа, если идёт генерация ответа
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
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
