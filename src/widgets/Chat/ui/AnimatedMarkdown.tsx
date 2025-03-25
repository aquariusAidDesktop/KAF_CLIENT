"use client";
import React, { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

interface AnimatedMarkdownProps {
  text: string; // Текст (partial или финальный), который будем "печатать"
  mode: "dark" | "light";
  isStreaming?: boolean; // Идёт ли генерация (partial answer)
  speed?: number; // Интервал (мс/слово)
}

export default function AnimatedMarkdown({
  text,
  mode,
  isStreaming = false,
  speed = 100, // Увеличиваем скорость для слов
}: AnimatedMarkdownProps) {
  const [displayedText, setDisplayedText] = useState("");
  const prevTextRef = useRef(text);

  // Если поток закончился, сразу показываем весь текст
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
    }
  }, [isStreaming, text]);

  // Постепенное добавление текста по словам
  useEffect(() => {
    if (!isStreaming) return; // Если не стримим, ничего не добавляем постепенно
    if (displayedText.length >= text.length) return; // Всё уже отображено

    // Находим позицию следующего пробела
    const nextSpaceIndex = text.indexOf(" ", displayedText.length);
    const nextFragmentEnd =
      nextSpaceIndex !== -1 ? nextSpaceIndex + 1 : text.length;

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, nextFragmentEnd));
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isStreaming, displayedText, speed]);

  return (
    <div>
      <MarkdownRenderer content={displayedText} mode={mode} />
    </div>
  );
}
