import type { ReactNode } from "react";
import MembersAreaShell from "@/components/members/MembersAreaShell";

export default function MembersHubLayout({ children }: { children: ReactNode }) {
  return <MembersAreaShell>{children}</MembersAreaShell>;
}
