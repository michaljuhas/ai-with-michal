declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType;
  export const lesson: unknown;
  export default MDXComponent;
}
