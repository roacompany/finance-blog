import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  reactStrictMode: true,

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

  // 정적 자산 캐싱 헤더
  async headers() {
    return [
      {
        source: "/og-image.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/api/og",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*.:ext(ico|png|jpg|jpeg|svg|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
