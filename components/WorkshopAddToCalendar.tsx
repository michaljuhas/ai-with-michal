"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import posthog from "posthog-js";
import type { WorkshopCalendarEvent } from "@/lib/workshop-calendar";
import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  generateICSContent,
} from "@/lib/workshop-calendar";

type Props = {
  event: WorkshopCalendarEvent;
  variant?: "card" | "embedded";
  /** PostHog analytics context */
  source: string;
  workshopSlug?: string;
  icsFilename?: string;
  className?: string;
  /** When false, use `sharedMeetingUrl` only (avoids duplicate fetch if parent already loads `/api/meeting-url`). */
  fetchMeetingUrl?: boolean;
  sharedMeetingUrl?: string | null;
};

export default function WorkshopAddToCalendar({
  event,
  variant = "card",
  source,
  workshopSlug,
  icsFilename = "ai-with-michal-workshop.ics",
  className = "",
  fetchMeetingUrl = true,
  sharedMeetingUrl = null,
}: Props) {
  const [internalMeetingUrl, setInternalMeetingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fetchMeetingUrl) return;
    if (!workshopSlug?.trim()) return;
    const q = `?workshopSlug=${encodeURIComponent(workshopSlug.trim())}`;
    fetch(`/api/meeting-url${q}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((d) => setInternalMeetingUrl(d?.url ?? null))
      .catch(() => {});
  }, [fetchMeetingUrl, workshopSlug]);

  const meetingUrl = fetchMeetingUrl ? internalMeetingUrl : sharedMeetingUrl;
  const location = meetingUrl ?? event.location;

  function capture(provider: string) {
    posthog.capture("calendar_added", {
      provider,
      source,
      ...(workshopSlug ? { workshop_slug: workshopSlug } : {}),
    });
  }

  function downloadICS() {
    capture("ics");
    const content = generateICSContent(event, location);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = icsFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const buttons = (
    <div className="grid sm:grid-cols-3 gap-3">
      <a
        href={buildGoogleCalendarUrl(event, location)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => capture("google")}
        className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-sm font-medium px-4 py-3 rounded-xl transition-all"
      >
        <ExternalLink size={14} className="text-blue-500" />
        Google Calendar
      </a>

      <a
        href={buildOutlookCalendarUrl(event, location)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => capture("outlook")}
        className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-sm font-medium px-4 py-3 rounded-xl transition-all"
      >
        <ExternalLink size={14} className="text-blue-500" />
        Outlook
      </a>

      <button
        type="button"
        onClick={downloadICS}
        className="cursor-pointer flex items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-sm font-medium px-4 py-3 rounded-xl transition-all"
      >
        <Download size={14} className="text-blue-500" />
        Download .ics
      </button>
    </div>
  );

  if (variant === "embedded") {
    return (
      <div className={className}>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Add to your calendar
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Don&apos;t miss it — save the date to your calendar now.
        </p>
        {buttons}
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl p-8 shadow-sm ${className}`}
    >
      <h2 className="text-slate-900 font-semibold text-lg mb-2">
        Add to Your Calendar
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Don&apos;t miss it — save the date to your calendar now.
      </p>
      {buttons}
    </div>
  );
}
