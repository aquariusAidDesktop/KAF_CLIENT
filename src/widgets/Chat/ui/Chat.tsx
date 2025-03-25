"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import ControlPanel from "./ControlPanel";
import { socketService } from "@/shared/socket/socketService";
import AnimatedMarkdown from "./AnimatedMarkdown";

interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  loading?: boolean;
  id?: string;
}

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);

  const userTextColor = mode === "dark" ? "#F7F7F7" : "#202123";
  const assistantTextColor = mode === "dark" ? "#F7F7F7" : "#202123";

  const assistantBg = mode === "dark" ? "#242633" : "#F7F7F7";
  const userBg = mode === "dark" ? "#444654" : "#F7F7F7";

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "assistant", text: "Чем помочь сегодня?" },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("1");
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.loading) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  useEffect(() => {
    const socket = socketService.connect(
      process.env.NEXT_PUBLIC_SOCKET_API_URL!
    );

    socket.on("connect", () => {
      console.log("Подключились к сокету");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Отключились от сокета");
      setSocketConnected(false);
    });

    socket.on(
      "chat message",
      (msg: string | { text: string; searchType?: string }) => {
        setMessages((prev) => prev.filter((m) => m.id !== "loading"));

        if (typeof msg === "string") {
          setMessages((prev) => [...prev, { sender: "assistant", text: msg }]);
        } else if (msg.text) {
          setMessages((prev) => [
            ...prev,
            { sender: "assistant", text: msg.text, searchType: msg.searchType },
          ]);
        }
        setIsLoadingSearch(false);
      }
    );

    socket.on("partial answer", (data: { text: string }) => {
      setMessages((prev) => {
        const loadingIndex = prev.findIndex((m) => m.id === "loading");
        if (loadingIndex !== -1) {
          const updated = [...prev];
          updated[loadingIndex] = {
            ...updated[loadingIndex],
            text: data.text,
          };
          return updated;
        } else {
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
      socketService.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socketService.isConnected()) {
      console.log("Нет подключения к сокету");
      return;
    }

    if (newMessage.trim() === "" || isLoadingSearch) return;

    const payload = { text: newMessage, searchType };
    socketService.emit("chat message", payload);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);

    setMessages((prev) => [
      ...prev,
      {
        sender: "assistant",
        text: "Генерирую ответ...",
        loading: true,
        id: "loading",
      },
    ]);

    setNewMessage("");
    setIsLoadingSearch(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Grid
      container
      md={11}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: { xs: "transparent", sm: "background.default" },
        height: "100%",
      }}
    >
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
            const isAssistant = msg.sender === "assistant";
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isAssistant ? "flex-start" : "flex-end",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: isAssistant
                      ? msg.loading
                        ? assistantBg
                        : assistantBg
                      : userBg,
                    color: isAssistant
                      ? msg.loading
                        ? assistantTextColor
                        : assistantTextColor
                      : userTextColor,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: msg.loading ? 1 : "none",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    opacity: 1,
                  }}
                >
                  {isAssistant ? (
                    <>
                      {msg.loading && (
                        <CircularProgress
                          size={20}
                          color="primary"
                          sx={{ color: "inherit", mb: 1 }}
                        />
                      )}
                      <AnimatedMarkdown
                        text={msg.text}
                        mode={mode}
                        isStreaming={!!msg.loading}
                        speed={7}
                      />
                      {msg.searchType && (
                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                          Тип поиска: {msg.searchType}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ fontSize: "1.05em" }}>
                      {msg.text}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>
      <ControlPanel
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleKeyDown={handleKeyDown}
        isLoadingSearch={isLoadingSearch}
        setIsLoadingSearch={setIsLoadingSearch}
        isLoadingVoice={isLoadingVoice}
        setIsLoadingVoice={setIsLoadingVoice}
        searchType={searchType}
        setSearchType={setSearchType}
        sendMessage={sendMessage}
        mode={mode}
      />
    </Grid>
  );
}
