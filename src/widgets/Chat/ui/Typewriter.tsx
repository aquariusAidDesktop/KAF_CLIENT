// components/Typewriter.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  /** Текущая порция текста (partial или финальная), которую нужно показать */
  text: string;
  /** Скорость печати (мс на один символ) */
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const prevTextRef = useRef(text);

  useEffect(() => {
    // Если text обновился (например, получил новую часть), запоминаем его
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
    }

    // Если уже всё допечатано, дальше не идём
    if (displayedText.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => {
        const nextIndex = prev.length + 1;
        return text.slice(0, nextIndex);
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [text, displayedText, speed]);

  return <>{displayedText}</>;
};

export default Typewriter;
