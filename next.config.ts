import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16.3.4 currently emits malformed files under .next/dev/types that break
  // the build's type-check step. Our own source is type-checked separately
  // (npm run typecheck / tsc --noEmit), so we skip the build-time checks here.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
