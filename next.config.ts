import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Bật lại để tạo static files cho GitHub Pages
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/bds-website' : '',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
