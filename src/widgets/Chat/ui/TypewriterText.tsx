import { useEffect, useState } from "react";

interface TypewriterTextProps {
  fullText: string;
  speed?: number;
}

const TypewriterText = ({ fullText, speed = 15 }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [fullText]);

  return <span>{displayedText}</span>;
};

export default TypewriterText;
