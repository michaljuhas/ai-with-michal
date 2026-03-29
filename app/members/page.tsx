import Link from "next/link";
import {
  STREAMS,
  getWorkshopsByStream,
  getUpcomingWorkshop,
} from "@/lib/workshops";
import type { Stream } from "@/lib/workshops";
import WelcomeVideo from "@/components/members/WelcomeVideo";
import StreamSection from "@/components/members/StreamSection";

// Set your YouTube welcome video ID here when ready (e.g. "dQw4w9WgXcQ")
const WELCOME_VIDEO_ID = "";

export default function MembersPage() {
  const upcomingWorkshop = getUpcomingWorkshop();

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Members Area
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Practical AI workshops for professionals. Browse your streams, join
            upcoming sessions, and connect with your workshop group.
          </p>
        </div>

        {/* Welcome video + upcoming workshop — side by side on larger screens */}
        <div className="mb-12 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
          {WELCOME_VIDEO_ID && (
            <WelcomeVideo youtubeVideoId={WELCOME_VIDEO_ID} />
          )}

          {upcomingWorkshop && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-amber-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                    Coming up
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    {upcomingWorkshop.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {upcomingWorkshop.displayDate}
                    {upcomingWorkshop.displayTime && (
                      <> · {upcomingWorkshop.displayTime}</>
                    )}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-lg">
                    {upcomingWorkshop.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
                >
                  Get your ticket
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/members/workshops/${upcomingWorkshop.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
                >
                  View workshop
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Stream sections */}
        <div className="space-y-12">
          {(Object.entries(STREAMS) as [Stream, (typeof STREAMS)[Stream]][]).map(
            ([key, stream]) => (
              <StreamSection
                key={key}
                stream={key}
                label={stream.label}
                description={stream.description}
                workshops={getWorkshopsByStream(key)}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}
