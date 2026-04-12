import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Member area | AI with Michal",
  robots: {
    index: false,
    follow: false,
  },
};

/** Auth for /members is enforced in proxy.ts (redirect_url preserved). */
export default function MembersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
