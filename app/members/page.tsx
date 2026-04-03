import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import {
  workshops,
  getWorkshopDefByPublicSlug,
  PUBLIC_WORKSHOPS,
} from "@/lib/workshops";
import type { WorkshopDef } from "@/lib/workshops";
import WorkshopCard from "@/components/members/WorkshopCard";
import MembersNav from "@/components/members/MembersNav";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

export default async function MembersPage() {
  const { userId } = await auth();
  const now = new Date();

  let myWorkshops: WorkshopDef[] = [];

  if (userId === ADMIN_USER_ID) {
    // Admin sees every workshop that has a members-area page, sorted upcoming first then past
    myWorkshops = [...workshops].sort((a, b) => {
      const aUpcoming = a.date >= now;
      const bUpcoming = b.date >= now;
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      if (aUpcoming) return a.date.getTime() - b.date.getTime(); // soonest first
      return b.date.getTime() - a.date.getTime(); // most recent first
    });
  } else if (userId) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("workshop_slug")
      .eq("clerk_user_id", userId)
      .eq("status", "paid")
      .not("workshop_slug", "is", null);

    const purchasedSlugs = [...new Set(
      (data ?? []).map((o: { workshop_slug: string }) => o.workshop_slug).filter(Boolean)
    )];

    // Map each purchased public slug → WorkshopDef (members-area entry)
    const defs = purchasedSlugs
      .map((slug) => getWorkshopDefByPublicSlug(slug))
      .filter((w): w is WorkshopDef => w !== null);

    // Sort: upcoming first (soonest), then past (most recent)
    myWorkshops = defs.sort((a, b) => {
      const aUpcoming = a.date >= now;
      const bUpcoming = b.date >= now;
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      if (aUpcoming) return a.date.getTime() - b.date.getTime();
      return b.date.getTime() - a.date.getTime();
    });
  }

  const hasWorkshops = myWorkshops.length > 0;

  // Count upcoming public workshops (for the "explore" CTA)
  const upcomingCount = PUBLIC_WORKSHOPS.filter((w) => w.date > now).length;

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Members Area
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            My Workshops
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-500">
            All the workshops you have access to — past and upcoming.
          </p>
        </div>

        <MembersNav />

        {hasWorkshops ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {myWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.slug}
                workshop={workshop}
                upcoming={workshop.date >= now}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">No workshops yet</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              You haven&apos;t joined any workshops yet.
              {upcomingCount > 0 && (
                <> There {upcomingCount === 1 ? "is" : "are"} <strong className="text-slate-700">{upcomingCount} upcoming {upcomingCount === 1 ? "workshop" : "workshops"}</strong> you can join.</>
              )}
            </p>
            <Link
              href="/workshops"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Explore workshops
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
