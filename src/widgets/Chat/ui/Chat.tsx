"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
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
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_API_URL);

    socketRef.current.on("chat message", (msg) => {
      setMessages((prev) => prev.filter((m) => m.id !== "loading"));

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

    socketRef.current.on("partial answer", (data) => {
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
      md={11}
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
            maxWidth: "1000px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, index) => {
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
                  {msg.loading && (
                    <CircularProgress
                      size={16}
                      sx={{ color: "inherit", mb: 1 }}
                    />
                  )}
                  {msg.loading ? (
                    <Typography variant="body1">{msg.text}</Typography>
                  ) : (
                    <ReactMarkdown
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
