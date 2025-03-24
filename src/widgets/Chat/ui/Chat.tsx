"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import {
  Box,
  CircularProgress,
  Grid,
  keyframes,
  Typography,
} from "@mui/material";
import { useEffect, useState, useRef, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import ControlPanel from "./ControlPanel";
import { socketService } from "@/shared/socket/socketService";
import MarkdownRenderer from "./MarkdownRenderer";
import { useRouter } from "next/navigation";

interface ChatMessage {
  sender: "assistant" | "user";
  text: string;
  searchType?: string;
  loading?: boolean;
  id?: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Chat() {
  const mode = useAppSelector((state) => state.theme.mode);
  const router = useRouter();

  const assistantBg = mode === "dark" ? "#242633" : "#F7F7F7";
  const assistantTextColor = mode === "dark" ? "#f5f5f5" : "#202123";
  const userBg = mode === "dark" ? "#444654" : "#E5E5EA";
  const userTextColor = mode === "dark" ? "#e8f1ff" : "#202123";

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
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(`Отключился от сокета: ${socketService.on.name}`);
      setSocketConnected(false);
    });

    socket.on(
      "chat message",
      (msg: string | { text: string; searchType?: string }) => {
        setMessages((prev: ChatMessage[]) =>
          prev.filter((m) => m.id !== "loading")
        );

        if (typeof msg === "string") {
          setMessages((prev: ChatMessage[]) => [
            ...prev,
            { sender: "assistant", text: msg },
          ]);
          speakText(msg);
        } else if (typeof msg === "object" && msg.text) {
          setMessages((prev: ChatMessage[]) => [
            ...prev,
            { sender: "assistant", text: msg.text, searchType: msg.searchType },
          ]);
          speakText(msg.text);
        }
        setIsLoadingSearch(false);
      }
    );

    socket.on("partial answer", (data: { text: string }) => {
      setMessages((prev: ChatMessage[]) => {
        const loadingIndex = prev.findIndex((m) => m.id === "loading");
        if (loadingIndex !== -1) {
          const updated = [...prev];
          updated[loadingIndex] = { ...updated[loadingIndex], text: data.text };
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

    setMessages((prev: ChatMessage[]) => [
      ...prev,
      { sender: "user", text: newMessage, searchType },
    ]);

    setMessages((prev: ChatMessage[]) => [
      ...prev,
      {
        sender: "assistant",
        text: "Вычисляем пространство векторов…",
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
          {messages.map((msg: ChatMessage, index) => {
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
                    borderRadius:
                      msg.sender === "assistant"
                        ? isFinalAssistant
                          ? 1
                          : 2
                        : 2,
                    boxShadow: msg.loading ? 1 : "none",
                    maxWidth: "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    opacity: msg.loading ? 0.7 : 1,
                    animation:
                      msg.sender === "assistant" && !msg.loading
                        ? `${fadeIn} 0.5s ease-out`
                        : "none",
                  }}
                >
                  {msg.loading ? (
                    <>
                      <CircularProgress
                        size={16}
                        sx={{ color: "inherit", mb: 1 }}
                      />
                      <MarkdownRenderer content={msg.text} mode={mode} />
                    </>
                  ) : msg.sender === "assistant" ? (
                    <MarkdownRenderer content={msg.text} mode={mode} />
                  ) : (
                    <Typography variant="body2">{msg.text}</Typography>
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
