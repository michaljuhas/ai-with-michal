import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  pageExtensions: ["ts", "tsx", "mdx"],
  async redirects() {
    return [
      {
        source: "/work-together",
        destination: "/consulting",
        permanent: true,
      },
      {
        source: "/consulting/levelling-ai-adoption-recruiting-teams",
        destination: "/consulting/recruiting-ai-workflow-advisory",
        permanent: true,
      },
      {
        source: "/consulting/levelling-ai-adoption-gtm-teams",
        destination: "/consulting/gtm-ai-systems-advisory",
        permanent: true,
      },
      {
        source: "/consulting/levelling-ai-adoption-operations-teams",
        destination: "/consulting/operations-ai-systems-advisory",
        permanent: true,
      },
      {
        source: "/private-workshops/levelling-ai-adoption-recruiting-teams",
        destination: "/consulting/recruiting-ai-workflow-advisory",
        permanent: true,
      },
      {
        source: "/private-workshops/levelling-ai-adoption-gtm-teams",
        destination: "/consulting/gtm-ai-systems-advisory",
        permanent: true,
      },
      {
        source: "/private-workshops/levelling-ai-adoption-operations-teams",
        destination: "/consulting/operations-ai-systems-advisory",
        permanent: true,
      },
      {
        source: "/private-workshops/:slug",
        destination: "/consulting/:slug",
        permanent: true,
      },
      {
        source: "/ai-integrations",
        destination: "/ai-implementation",
        permanent: true,
      },
      // Redirect old /training lesson paths to /members/training
      // (only the two lesson sections that existed there)
      {
        source: "/training/pre-training/:path*",
        destination: "/members/training/pre-training/:path*",
        permanent: true,
      },
      {
        source: "/training/live-workshop/:path*",
        destination: "/members/training/live-workshop/:path*",
        permanent: true,
      },
    ];
  },
  // HMR: allow when the page is opened on 127.0.0.1 vs localhost (or Clerk redirects differ).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "dhnppoaejysrmpglqtvk.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/michaljuhas-public/**",
      },
    ],
  },
};

export default withMDX(nextConfig);
