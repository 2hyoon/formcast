import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev 서버는 .next 사용. Stop 훅의 `next build`는 NEXT_DIST_DIR로 .next-prod에 출력해
  // 실행 중인 dev 서버의 청크와 충돌하지 않도록 분리한다.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
