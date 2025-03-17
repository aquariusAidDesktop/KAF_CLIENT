"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import ControlPanel from "./ControlPanel";
import socketService from "@/shared/socket/socketService";

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
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("SpeechSynthesis API не поддерживается вашим браузером.");
    }
  };

  useEffect(() => {
    const socket = socketService.connect(
      process.env.NEXT_PUBLIC_SOCKET_API_URL!
    );

    socket.on("connect", () => {
      console.log(`Подключился к сокету: ${socketService.on.name}`);
    });

    socket.on("disconnect", () => {
      console.log(`Отключился от сокета: ${socketService.on.name}`);
    });

    socket.on("chat message", (msg) => {
      setMessages((prev) => prev.filter((m) => m.id !== "loading"));

      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { sender: "assistant", text: msg }]);
        speakText(msg);
      } else if (typeof msg === "object" && msg.text) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: msg.text,
            searchType: msg.searchType,
          },
        ]);
        speakText(msg.text);
      }
      setIsLoadingAnswer(false);
    });

    socket.on("partial answer", (data) => {
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

    if (newMessage.trim() === "" || isLoadingAnswer) return;

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
      container
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
            maxWidth: "800px",
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
                    <Typography variant="body2">{msg.text}</Typography>
                  ) : (
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            style={{
                              fontSize: "2em",
                              margin: "0.67em 0",
                              fontWeight: 600,
                            }}
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            style={{
                              fontSize: "1.75em",
                              margin: "0.75em 0",
                              fontWeight: 600,
                            }}
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            style={{
                              fontSize: "1.5em",
                              margin: "0.75em 0",
                              fontWeight: 600,
                            }}
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p style={{ lineHeight: 1.6 }} {...props} />
                        ),
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
                        code: ({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) => {
                          // Извлекаем ref, чтобы избежать конфликта с типами pre/code
                          const { ref, ...restProps } = props;
                          if (!inline) {
                            return (
                              <pre
                                style={{
                                  overflowX: "auto",
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  maxWidth: "100%",
                                  background:
                                    msg.sender === "assistant"
                                      ? assistantBg
                                      : userBg,
                                  padding: "1em",
                                  borderRadius: "4px",
                                }}
                                {...restProps}
                              >
                                <code className={className}>{children}</code>
                              </pre>
                            );
                          } else {
                            return (
                              <code
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                  background: "rgba(27,31,35,0.05)",
                                  padding: "0.2em 0.4em",
                                  borderRadius: "3px",
                                }}
                                className={className}
                                {...restProps}
                              >
                                {children}
                              </code>
                            );
                          }
                        },
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            style={{
                              borderLeft: "4px solid #dfe2e5",
                              paddingLeft: "1em",
                              color: "#6a737d",
                              fontStyle: "italic",
                              margin: "0.5em 0",
                            }}
                            {...props}
                          />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            style={{
                              color: "#0366d6",
                              textDecoration: "none",
                              borderBottom: "1px solid #0366d6",
                            }}
                            {...props}
                          />
                        ),
                        table: ({ node, ...props }) => (
                          <table
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                              margin: "1em 0",
                            }}
                            {...props}
                          />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5em",
                              background: "#f6f8fa",
                            }}
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "0.5em",
                            }}
                            {...props}
                          />
                        ),
                        img: ({ node, ...props }) => (
                          <img
                            style={{
                              maxWidth: "100%",
                              borderRadius: "4px",
                              margin: "1em 0",
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
