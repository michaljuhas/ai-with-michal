import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import TrainingSidebar from "@/components/training/TrainingSidebar";
import { getWorkshopBySlug, getWorkshopTrainingSections, STREAMS } from "@/lib/workshops";
import { isAdminUser } from "@/lib/config";

type WorkshopLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function WorkshopLayout({ children, params }: WorkshopLayoutProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const sections = getWorkshopTrainingSections(slug);
  const stream = STREAMS[workshop.stream];

  // Check pro access (workgroup + recording)
  let hasProAccess = false;
  const { userId } = await auth();
  if (userId) {
    if (isAdminUser(userId)) {
      hasProAccess = true;
    } else {
      const supabase = createServiceClient();
      const { data } = await supabase
        .from("orders")
        .select("id")
        .eq("clerk_user_id", userId)
        .eq("workshop_slug", workshop.slug)
        .eq("tier", "pro")
        .eq("status", "paid")
        .maybeSingle();
      hasProAccess = !!data;
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/members"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
            >
              Members
            </Link>
            <span className="text-slate-300 text-xs">›</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {stream.label}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {workshop.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {workshop.description}
          </p>
          {workshop.displayDate && (
            <p className="mt-2 text-sm text-slate-500">
              {workshop.displayDate}
              {workshop.displayTime && <> · {workshop.displayTime}</>}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <TrainingSidebar
              sections={sections}
              backHref="/members"
              overviewHref={`/members/workshops/${slug}`}
              membersHref={`/members/workshops/${slug}/members`}
              workgroupHref={`/members/workshops/${slug}/workgroup`}
              hasWorkgroupAccess={hasProAccess}
              recordingUrl={workshop.recordingUrl}
              hasRecordingAccess={hasProAccess}
            />
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
