import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "customer-93d8iy2yaaaecxeg.cloudflarestream.com",
      "lh3.googleusercontent.com", 
      "pzfvtntvegbrhlgwraan.supabase.co",
      "sb.postclips.com"
    ],
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  }
};

export default nextConfig;