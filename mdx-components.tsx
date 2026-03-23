import type { MDXComponents } from "mdx/types";
import YouTubeEmbed from "@/components/training/YouTubeEmbed";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    YouTubeEmbed,
    ...components,
  };
}
