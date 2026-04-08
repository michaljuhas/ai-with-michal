import type { Metadata } from "next";
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Member area | AI with Michal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MembersLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  return <>{children}</>;
}
