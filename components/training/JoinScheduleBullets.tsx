"use client";

import { useWorkshopJoinSchedule } from "@/components/training/workshop-join-schedule-context";

const MEET_HREF = "https://meet.google.com/zbn-wevi-dwf";

export default function JoinScheduleBullets() {
  const v = useWorkshopJoinSchedule();

  if (!v) {
    return null;
  }

  return (
    <ul className="my-5 list-disc space-y-2 pl-6 text-slate-700">
      <li>
        <strong className="font-semibold text-slate-900">Date:</strong>{" "}
        {v.displayDate || "—"}
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Time:</strong>{" "}
        {v.displayTime || "—"}
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Video call:</strong>{" "}
        <a
          href={MEET_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline underline-offset-4"
        >
          meet.google.com/zbn-wevi-dwf
        </a>
      </li>
    </ul>
  );
}
