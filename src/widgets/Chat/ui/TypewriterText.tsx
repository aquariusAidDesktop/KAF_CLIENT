import { useEffect, useState, useRef } from "react";

interface TypewriterTextProps {
  fullText: string;
  speed?: number;
}

const TypewriterText = ({ fullText, speed = 15 }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const fullTextRef = useRef(fullText);

  useEffect(() => {
    fullTextRef.current = fullText;
  }, [fullText]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentText = fullTextRef.current;
      if (indexRef.current < currentText.length) {
        setDisplayedText((prev) => prev + currentText.charAt(indexRef.current));
        indexRef.current += 1;
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  return <span>{displayedText}</span>;
};

export default TypewriterText;
