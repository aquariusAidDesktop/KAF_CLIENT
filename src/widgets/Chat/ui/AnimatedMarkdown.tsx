"use client";
import React, { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import type { CSSProperties } from "react";

interface AnimatedMarkdownProps {
  text: string; // Текст (partial или финальный), который будем "печатать"
  mode: "dark" | "light";
  isStreaming?: boolean; // Идёт ли генерация (partial answer)
  speed?: number; // Интервал (мс/символ)
}

export default function AnimatedMarkdown({
  text,
  mode,
  isStreaming = false,
  speed = 30,
}: AnimatedMarkdownProps) {
  const [displayedText, setDisplayedText] = useState("");
  const prevTextRef = useRef(text);

  // Если поток закончился, сразу показываем весь текст
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
    }
  }, [isStreaming, text]);

  // Если текст растёт — продолжаем "допечатывать"
  useEffect(() => {
    if (!isStreaming) return; // Если не стримим, ничего не печатаем постепенно

    // При изменении текста обновляем ref (без обнуления displayedText)
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
    }

    if (displayedText.length >= text.length) return; // Всё уже напечатано

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isStreaming, displayedText, speed]);

  // Для проигрывания CSS-анимации "fadeIn" при добавлении нового символа
  const wrapperKey = displayedText;

  return (
    <div
      key={wrapperKey}
      style={{
        animation: "fadeIn 0.15s ease-in",
        MozAnimation: "fadeIn 0.15s ease-in",
      }}
    >
      <MarkdownRenderer content={displayedText} mode={mode} />
    </div>
  );
}
