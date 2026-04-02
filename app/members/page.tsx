import Link from "next/link";
import {
  STREAMS,
  PUBLIC_WORKSHOPS,
  getWorkshopsByStream,
  getUpcomingWorkshop,
} from "@/lib/workshops";
import type { Stream } from "@/lib/workshops";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import WelcomeVideo from "@/components/members/WelcomeVideo";
import StreamSection from "@/components/members/StreamSection";

// Set your YouTube welcome video ID here when ready (e.g. "dQw4w9WgXcQ")
const WELCOME_VIDEO_ID = "";
const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

export default async function MembersPage() {
  const { userId } = await auth();
  const upcomingWorkshop = getUpcomingWorkshop();

  // Determine which past workshops the user has access to
  const now = new Date();
  const pastPublicWorkshops = PUBLIC_WORKSHOPS.filter((w) => w.date < now).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  let accessiblePastWorkshops: typeof pastPublicWorkshops = [];
  if (userId && pastPublicWorkshops.length > 0) {
    if (userId === ADMIN_USER_ID) {
      accessiblePastWorkshops = pastPublicWorkshops;
    } else {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from("orders")
        .select("workshop_slug")
        .eq("clerk_user_id", userId)
        .eq("status", "paid")
        .not("workshop_slug", "is", null);
      const purchasedSlugs = new Set(
        (data ?? []).map((o: { workshop_slug: string }) => o.workshop_slug).filter(Boolean)
      );
      accessiblePastWorkshops = pastPublicWorkshops.filter((w) => purchasedSlugs.has(w.slug));
    }
  }

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

        {/* Stream sections — only streams with upcoming workshops */}
        <div className="space-y-12">
          {(Object.entries(STREAMS) as [Stream, (typeof STREAMS)[Stream]][]).map(
            ([key, stream]) => {
              const upcoming = getWorkshopsByStream(key).filter((w) => w.date >= new Date());
              if (upcoming.length === 0) return null;
              return (
                <StreamSection
                  key={key}
                  stream={key}
                  label={stream.label}
                  description={stream.description}
                  workshops={upcoming}
                />
              );
            }
          )}
        </div>

        {/* Past workshops the user has purchased */}
        {accessiblePastWorkshops.length > 0 && (
          <div className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400 mb-5">
              Your past workshops
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {accessiblePastWorkshops.map((workshop) => (
                <Link
                  key={workshop.slug}
                  href={`/workshops/${workshop.slug}`}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 mb-1">{workshop.displayDate}</p>
                      <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors text-sm leading-snug">
                        {workshop.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {workshop.description}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-slate-300 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
