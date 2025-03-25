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

  // Если поток закончился, сразу показываем весь text
  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }
  }, [isStreaming, text]);

  // Если text растёт — продолжаем "допечатывать"
  useEffect(() => {
    if (!isStreaming) return; // если не стримим, ничего не печатаем постепенно

    // Если text поменялся, не обнуляем displayedText, а допечатываем дальше
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
    }

    if (displayedText.length >= text.length) return; // уже всё напечатали

    const timer = setTimeout(() => {
      setDisplayedText((prev) => {
        const nextIndex = prev.length + 1;
        return text.slice(0, nextIndex);
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isStreaming, displayedText, speed]);

  // ----
  // Далее делаем "мелкий" fade-in для каждого символа.
  // Сформируем массив "символов", где каждый обёрнут в <span> с анимацией opacity.
  // Чтобы Markdown корректно парсился, нам нужна именно строка. Но если хотим реально
  // видеть fade-in на каждый символ - придётся "схитрить":
  //
  // 1) Либо показать готовую строку в Markdown и просто плавно "наращивать" её целиком
  //    (тогда fade-in будет у всей строчки сразу).
  // 2) Либо парсить построчно/поблочно - что очень сложно.
  //
  // Ниже - простой вариант: печатается строка, а анимация - у всей строки целиком.

  // Можно добавить ключ при каждом изменении, чтобы элемент "пересоздавался"
  // и срабатывала CSS-анимация "fadeIn 0.15s"
  const wrapperKey = displayedText; // чтобы при каждом новом символе заново проигрывалась анимация

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
