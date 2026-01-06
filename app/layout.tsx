import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ROA Finance Blog | 금융 정보와 투자 인사이트",
    template: "%s | ROA Finance Blog",
  },
  description:
    "금리, 대출, 투자에 대한 신뢰할 수 있는 금융 정보를 제공합니다. 기준금리부터 COFIX, CD금리까지 쉽게 이해할 수 있는 금융 가이드.",
  keywords: [
    "금리",
    "기준금리",
    "COFIX",
    "CD금리",
    "대출금리",
    "투자",
    "금융",
    "한국은행",
    "금통위",
    "채권",
    "예금",
    "적금",
  ],
  authors: [{ name: "ROA Finance" }],
  creator: "ROA Finance",
  publisher: "ROA Finance",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "ROA Finance Blog",
    title: "ROA Finance Blog | 금융 정보와 투자 인사이트",
    description:
      "금리, 대출, 투자에 대한 신뢰할 수 있는 금융 정보를 제공합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ROA Finance Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROA Finance Blog | 금융 정보와 투자 인사이트",
    description:
      "금리, 대출, 투자에 대한 신뢰할 수 있는 금융 정보를 제공합니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 (나중에 추가)
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FFFFFF" />
      </head>
      <body>{children}</body>
    </html>
  );
}
