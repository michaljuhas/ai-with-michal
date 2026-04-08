"use client";

import Link from "next/link";
import { useWorkshopJoinSchedule } from "@/components/training/workshop-join-schedule-context";

export default function JoinAfterWorkshopBullets() {
  const v = useWorkshopJoinSchedule();

  if (!v?.workshopSlug) {
    return null;
  }

  const { workshopSlug } = v;
  const sessionNotesPath = `/members/workshops/${workshopSlug}/training/live-workshop/session-notes`;
  const workgroupPath = `/members/workshops/${workshopSlug}/workgroup`;
  const overviewPath = `/members/workshops/${workshopSlug}`;

  const linkClass =
    "font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800";

  return (
    <ul className="my-5 list-disc space-y-2 pl-6 text-slate-700">
      <li>
        Check{" "}
        <Link href={sessionNotesPath} className={linkClass}>
          Session notes
        </Link>{" "}
        for important links.
      </li>
      <li>
        Ask questions in the{" "}
        <Link href={workgroupPath} className={linkClass}>
          Workgroup
        </Link>
        ; Michal will respond. This is a unique opportunity to get feedback.
      </li>
      <li>
        Check{" "}
        <Link href={overviewPath} className={linkClass}>
          Recording
        </Link>{" "}
        (if you have access).
      </li>
    </ul>
  );
}
