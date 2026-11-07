import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Server action & external package config if needed
  serverExternalPackages: ["@aws-sdk", "@neondatabase/serverless", "bcryptjs"],
};

export default nextConfig;
