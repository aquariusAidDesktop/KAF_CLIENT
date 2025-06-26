"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import type { CSSProperties } from "react";
import { useTheme } from "@mui/material/styles";

interface MarkdownRendererProps {
  content: string;
  mode: "dark" | "light";
}

export default function MarkdownRenderer({
  content,
  mode,
}: MarkdownRendererProps) {
  const theme = useTheme();
  const colors = {
    text: theme.palette.text.primary,
    link: theme.palette.text.primary,
    blockquoteBg: theme.customColors.blockquoteBg,
    codeBg: theme.customColors.codeBg,
    tableHeaderBg: theme.customColors.tableHeaderBg,
  };

  const commonCodeStyle: CSSProperties = {
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    fontSize: "0.95em",
  };

  return (
    <ReactMarkdown
      components={{
        h1: ({ ...props }) => (
          <h1
            style={{
              fontSize: "1.4em",
              fontWeight: 600,
              margin: "1em 0 0.6em",
              color: colors.text,
            }}
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            style={{
              fontSize: "1.3em",
              fontWeight: 600,
              margin: "1em 0 0.6em",
              color: colors.text,
            }}
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            style={{
              fontSize: "1.2em",
              fontWeight: 600,
              margin: "0.8em 0",
              color: colors.text,
            }}
            {...props}
          />
        ),
        h4: ({ ...props }) => (
          <h4
            style={{
              fontSize: "1.1em",
              fontWeight: 600,
              margin: "0.8em 0",
              color: colors.text,
            }}
            {...props}
          />
        ),
        h5: ({ ...props }) => (
          <h5
            style={{
              fontSize: "1em",
              fontWeight: 600,
              margin: "0.6em 0",
              color: colors.text,
            }}
            {...props}
          />
        ),
        h6: ({ ...props }) => (
          <h6
            style={{
              fontSize: "0.95em",
              fontWeight: 600,
              margin: "0.6em 0",
              color: colors.text,
            }}
            {...props}
          />
        ),
        p: ({ ...props }) => (
          <p
            style={{
              margin: "0.25em 0",
              lineHeight: 1.6,
              color: colors.text,
            }}
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul
            style={{
              margin: "0.6em 0",
              paddingLeft: "1.4em",
              color: colors.text,
            }}
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            style={{
              margin: "0.6em 0",
              paddingLeft: "1.4em",
              color: colors.text,
            }}
            {...props}
          />
        ),
        blockquote: ({ ...props }) => (
          <blockquote
            style={{
              background: colors.blockquoteBg,
              margin: "1em 0",
              padding: "0.8em 1em",
              borderRadius: "4px",
              opacity: 0.9,
              color: colors.text,
            }}
            {...props}
          />
        ),
        a: ({ ...props }) => (
          <a
            style={{
              color: colors.link,
              textDecoration: "underline",
            }}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        img: ({ ...props }) => (
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
        table: ({ ...props }) => (
          <div style={{ overflowX: "auto", margin: "1em 0" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.95em",
                color: colors.text,
              }}
              {...props}
            />
          </div>
        ),
        th: ({ ...props }) => (
          <th
            style={{
              border: "1px solid #555",
              padding: "0.5em",
              backgroundColor: colors.tableHeaderBg,
              textAlign: "left",
              color: colors.text,
            }}
            {...props}
          />
        ),
        td: ({ ...props }) => (
          <td
            style={{
              border: "1px solid #555",
              padding: "0.5em",
              textAlign: "left",
              color: colors.text,
            }}
            {...props}
          />
        ),
        code: ({ children, className, ...props }) => {
          const isInline = !className;

          if (!isInline) {
            return (
              <pre
                style={{
                  margin: "0.75em 0",
                  padding: "0.9em",
                  backgroundColor: colors.codeBg,
                  borderRadius: "6px",
                  overflowX: "auto",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <code style={{ ...commonCodeStyle, color: "#E2E8F0" }} {...props}>
                  {children}
                </code>
              </pre>
            );
          }

          return (
            <code
              style={{
                ...commonCodeStyle,
                backgroundColor: colors.codeBg,
                color: "#E2E8F0",
                padding: "0.2em 0.4em",
                borderRadius: "4px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        hr: ({ ...props }) => (
          <hr
            style={{
              border: "none",
              borderBottom: `1px solid ${theme.palette.divider}`,
              margin: "1.2em 0",
            }}
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
