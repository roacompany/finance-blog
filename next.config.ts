import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  reactStrictMode: true,

  // better-sqlite3를 서버사이드에서 사용하기 위한 설정
  serverExternalPackages: ['better-sqlite3'],

  // 이미지 최적화
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
  },

  // 압축 활성화
  compress: true,

  // 프로덕션 최적화
  poweredByHeader: false,

  // 정적 페이지 재검증
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
