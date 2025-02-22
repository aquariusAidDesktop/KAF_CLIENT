"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import ControlPanel from "./ControlPanel";
import FinalAnswer from "./FinalAnswer";

interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  loading?: boolean;
  id?: string;
}

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);

  // Цвета для темной/светлой темы
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

  // Прокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_API_URL);

    // Окончательный (финальный) ответ от сервера
    socketRef.current.on("chat message", (msg) => {
      // Удаляем "черновой" ответ, если висит
      setMessages((prev) => prev.filter((m) => m.id !== "loading"));

      // Добавляем финальный ответ
      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { sender: "assistant", text: msg }]);
      } else if (typeof msg === "object" && msg.text) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: msg.text,
            searchType: msg.searchType,
          },
        ]);
      }

      setIsLoadingAnswer(false);
    });

    // Промежуточные (partial) ответы
    socketRef.current.on("partial answer", (data) => {
      setMessages((prev) => {
        const loadingIndex = prev.findIndex((m) => m.id === "loading");
        // Если уже есть "черновик" - обновим
        if (loadingIndex !== -1) {
          const updated = [...prev];
          updated[loadingIndex] = {
            ...updated[loadingIndex],
            text: data.text,
          };
          return updated;
        } else {
          // Иначе создаём "черновик"
          return [
            ...prev,
            {
              sender: "assistant",
              text: data.text,
              id: "loading",
              loading: true,
            },
          ];
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Отправка сообщения
  const sendMessage = () => {
    if (newMessage.trim() === "" || isLoadingAnswer) return;

    // Отправляем на сервер
    const payload = { text: newMessage, searchType };
    socketRef.current?.emit("chat message", payload);

    // Добавляем сообщение от пользователя
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);

    // Добавляем "черновик"
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

  // Обработка Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Рендер
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
      {/* Область со списком сообщений */}
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
          {messages.map((msg, index) => {
            // Финальный ответ ассистента (не loading)
            const isFinalAssistant = msg.sender === "assistant" && !msg.loading;

            return (
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
                    borderRadius: isFinalAssistant ? 1 : 2,
                    boxShadow: msg.loading ? 1 : "none",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    opacity: msg.loading ? 0.7 : 1,
                  }}
                >
                  {/* Спиннер во время генерации */}
                  {msg.loading && (
                    <CircularProgress
                      size={16}
                      sx={{ color: "inherit", mb: 1 }}
                    />
                  )}

                  {/* Если готово — Markdown; если нет — просто текст */}
                  {msg.loading ? (
                    <Typography variant="body1">{msg.text}</Typography>
                  ) : (
                    <ReactMarkdown
                      // Увеличиваем отступ между элементами списка
                      components={{
                        ul: ({ node, ...props }) => (
                          <ul
                            style={{
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              paddingLeft: "1.4em",
                              listStylePosition: "outside",
                            }}
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            style={{
                              marginTop: "0.5em",
                              marginBottom: "0.5em",
                              paddingLeft: "1.4em",
                              listStylePosition: "outside",
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}

                  {/* (опционально) тип поиска */}
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
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Панель с инпутом и выбором типа поиска */}
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
