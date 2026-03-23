import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
