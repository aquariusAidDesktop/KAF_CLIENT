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
import ControlPanel from "./ControlPanel";

interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  loading?: boolean;
  id?: string;
}

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5041");

    socketRef.current.on("chat message", (msg) => {
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

    socketRef.current.on("loading answer", (data) => {
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

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);

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
                      ? "#b0bec5"
                      : assistantBg,
                  color:
                    msg.sender === "user"
                      ? userTextColor
                      : msg.loading
                      ? "#000000"
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
      <ControlPanel
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleKeyDown={handleKeyDown}
        isLoadingAnswer={isLoadingAnswer}
        searchType={searchType}
        setSearchType={setSearchType}
        sendMessage={sendMessage}
        mode={mode}
      />
    </Grid>
  );
}
