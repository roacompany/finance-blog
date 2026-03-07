import type { Metadata } from "next";
import { THEME_SCRIPT } from "@/lib/theme";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/MotionProvider";

// ─── Fonts ────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
});

// ─── Metadata ─────────────────────────────────────────────
const BASE_URL = "https://www.roafinance.me";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ROA — 금융 인사이트 미디어",
    template: "%s | ROA",
  },
  description: "금융을 깊이 이해하는 사람들을 위한 인사이트 미디어. 매일 하나의 깊은 금융 이야기.",
  keywords: ["금리", "기준금리", "COFIX", "대출금리", "투자", "금융", "한국은행", "채권", "DSR", "LTV"],
  authors: [{ name: "ROA" }],
  creator: "ROA",
  publisher: "ROA Finance",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "ROA",
    title: "ROA — 금융 인사이트 미디어",
    description: "금융을 깊이 이해하는 사람들을 위한 인사이트 미디어.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ROA Finance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROA — 금융 인사이트 미디어",
    description: "금융을 깊이 이해하는 사람들을 위한 인사이트 미디어.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: BASE_URL },
};

// ─── Layout ───────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={playfair.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
        {/* Pretendard — 한국어 고품질 산세리프 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* Pretendard: preload → stylesheet 분리로 FOUT 없이 LCP 개선 */}
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* FOUC 방지: 렌더 전 테마 적용 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif" }}>
        <MotionProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
