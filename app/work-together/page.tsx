import type { Metadata } from "next";
import WorkTogetherMenuPage from "@/components/work-together/WorkTogetherMenuPage";

export const metadata: Metadata = {
  title: "Work Together",
  description:
    "Bi-weekly mentoring, group circles, private workshops, advisory board, and hands-on AI implementation — explore options and pricing.",
};

export default function WorkTogetherRoute() {
  return <WorkTogetherMenuPage />;
}
