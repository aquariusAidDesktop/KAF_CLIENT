import "normalize.css/normalize.css";

export const metadata = {
  title: "МАФ | ИИ Агент",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
