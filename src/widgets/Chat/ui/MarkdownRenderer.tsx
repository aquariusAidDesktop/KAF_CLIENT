import React from "react";
import ReactMarkdown from "react-markdown";
import TypewriterText from "./TypewriterText"; // убедись, что путь верный

interface MarkdownRendererProps {
  content: string;
  mode: "dark" | "light";
  animate?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  mode,
  animate = false,
}) => {
  const commonCodeStyle: React.CSSProperties = {
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  };

  if (animate) {
    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
        <TypewriterText fullText={content} />
      </div>
    );
  }

  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 style={{ fontSize: "2em", margin: "0.67em 0" }} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ fontSize: "1.5em", margin: "0.75em 0" }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ fontSize: "1.17em", margin: "0.83em 0" }} {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 style={{ fontSize: "1em", margin: "1em 0 0.5em" }} {...props} />
        ),
        h5: ({ node, ...props }) => (
          <h5
            style={{ fontSize: "0.83em", margin: "1em 0 0.5em" }}
            {...props}
          />
        ),
        h6: ({ node, ...props }) => (
          <h6
            style={{ fontSize: "0.75em", margin: "1em 0 0.5em" }}
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p
            style={{
              margin: "0.1em 0",
              lineHeight: 1.6,
              overflowWrap: "break-word",
            }}
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul
            style={{
              margin: "0.5em 0",
              paddingLeft: "1.4em",
              listStylePosition: "outside",
            }}
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <ol
            style={{
              margin: "0.5em 0",
              paddingLeft: "1.4em",
              listStylePosition: "outside",
            }}
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            style={{
              borderLeft: "4px solid #ccc",
              margin: "1em 0",
              paddingLeft: "1em",
              color: mode === "dark" ? "#ccc" : "#555",
              fontStyle: "italic",
              backgroundColor: mode === "dark" ? "#393939" : "#f9f9f9",
            }}
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            style={{
              color: mode === "dark" ? "#58a6ff" : "#0366d6",
              textDecoration: "underline",
            }}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        img: ({ node, ...props }) => (
          <img
            style={{
              maxWidth: "100%",
              borderRadius: "5px",
              margin: "0.5em 0",
            }}
            alt=""
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div style={{ overflowX: "auto", margin: "1em 0" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              {...props}
            />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th
            style={{
              border: "1px solid #ddd",
              padding: "0.5em",
              backgroundColor: mode === "dark" ? "#555" : "#f6f8fa",
              textAlign: "left",
            }}
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td
            style={{
              border: "1px solid #ddd",
              padding: "0.5em",
              textAlign: "left",
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
        }: {
          node?: any;
          inline?: boolean;
          className?: string;
          children?: React.ReactNode;
          [x: string]: any;
        }) => {
          if (!inline) {
            return (
              <pre
                style={{
                  margin: "0.5em 0",
                  padding: "1em",
                  backgroundColor: mode === "dark" ? "#2d2d2d" : "#f6f8fa",
                  borderRadius: "5px",
                  overflowX: "auto",
                }}
                {...props}
              >
                <code
                  className={className}
                  style={{
                    ...commonCodeStyle,
                    display: "block",
                    color: mode === "dark" ? "#e0e0e0" : "#24292e",
                  }}
                >
                  {children}
                </code>
              </pre>
            );
          }
          return (
            <code
              className={className}
              style={{
                ...commonCodeStyle,
                backgroundColor: mode === "dark" ? "#2d2d2d" : "#f6f8fa",
                color: mode === "dark" ? "#e0e0e0" : "#24292e",
                padding: "0.2em 0.4em",
                borderRadius: "3px",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
