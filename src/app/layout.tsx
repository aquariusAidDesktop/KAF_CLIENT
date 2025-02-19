import { Geist, Geist_Mono } from "next/font/google";
import ToggleColorMode from "./ThemeContext";
import "normalize.css/normalize.css";
import type { Metadata } from "next";
import Providers from "./providers";
import "./_assets/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Властелин ОЧКА",
  description: "Повелеваю твоим очком",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <ToggleColorMode>{children}</ToggleColorMode>
        </Providers>
      </body>
    </html>
  );
}
