import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROA Finance Blog",
  description: "신뢰할 수 있는 금융 정보와 기술 인사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
