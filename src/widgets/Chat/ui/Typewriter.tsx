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
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
    }
    if (displayedText.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [text, displayedText, speed]);

  return <>{displayedText}</>;
};

export default Typewriter;
