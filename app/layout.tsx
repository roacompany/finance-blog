import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "금융답게 바라보기, 로아의 시선",
    template: "%s | 금융답게 바라보기, 로아의 시선",
  },
  description:
    "금융을 금융답게 풀어냅니다.",
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
  authors: [{ name: "로아" }],
  creator: "로아",
  publisher: "금융답게 바라보기, 로아의 시선",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "금융답게 바라보기, 로아의 시선",
    title: "금융답게 바라보기, 로아의 시선",
    description:
      "금융을 금융답게 풀어냅니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "금융답게 바라보기, 로아의 시선",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "금융답게 바라보기, 로아의 시선",
    description:
      "금융을 금융답게 풀어냅니다.",
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
