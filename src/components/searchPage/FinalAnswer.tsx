import React from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";

interface FinalAnswerProps {
  answer: string;
}

export default function FinalAnswer({ answer }: FinalAnswerProps) {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#f9f9f9", // или 'transparent' — если хотите слить с фоном
        border: "1px solid #ccc",
        borderRadius: 2,
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
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
        {answer}
      </ReactMarkdown>
    </Box>
  );
}
