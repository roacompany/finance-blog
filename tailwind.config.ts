import type { Config } from "tailwindcss";

const config: Config = {
  // 🔥 핵심: 경로 누락 방지를 위한 '전방위' 탐색 설정
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // Root app
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",    // Src app
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Root pages
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",  // Src pages
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Root components
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Src components
    "./content/**/*.{md,mdx}",                // Content files
    "./src/**/*.{js,ts,jsx,tsx,mdx}",        // Src fallback
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',       // 배경 (Pure White)
        'text-high': '#191F2B',   // 제목 (Dark Navy)
        'text-body': '#333D4B',   // 본문 (Dark Grey)
        'text-mid': '#8B95A1',    // 날짜/부가설명
        'text-low': '#B0B8C1',    // 연한 텍스트
        secondary: '#3182F6',     // Toss Blue
        rise: '#F04452',          // Red
        fall: '#3182F6',          // Blue
      },
      fontFamily: {
        pretendard: ["Pretendard Variable", "Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
