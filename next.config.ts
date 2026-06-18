import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up stray lockfiles in
  // parent directories (which broke module resolution and file watching/HMR).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
