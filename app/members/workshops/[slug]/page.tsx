import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getWorkshopBySlug,
  getWorkshopTrainingSections,
} from "@/lib/workshops";

type WorkshopPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const sections = getWorkshopTrainingSections(slug);
  const firstLesson = sections[0]?.lessons[0];

  // Find the "Join" lesson path for the live session link
  const joinLesson = sections
    .flatMap((s) => s.lessons)
    .find((l) => l.slug[1] === "join");

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-5">
          <Image
            src="/Michal-Juhas-headshot-square-v1.jpg"
            alt="Michal Juhas"
            width={100}
            height={100}
            className="h-[72px] w-[72px] flex-shrink-0 rounded-full object-cover shadow-sm"
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 mb-2">
              Welcome from Michal
            </p>
            <p className="text-[15px] leading-relaxed text-slate-700">
              Hi and welcome to <strong className="text-slate-900">{workshop.title}</strong>!
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Before the live session, please work through the{" "}
              <strong className="text-slate-700">pre-training modules</strong> in the
              sidebar — each takes about 10 minutes and will make the live session
              much more useful.
            </p>
            {joinLesson && workshop.displayDate && (
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                We go live on{" "}
                <strong className="text-slate-700">{workshop.displayDate}</strong>
                {workshop.displayTime && (
                  <> at <strong className="text-slate-700">{workshop.displayTime}</strong></>
                )}
                . The video call link is in the{" "}
                <Link
                  href={joinLesson.path}
                  className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  Join
                </Link>{" "}
                lesson.
              </p>
            )}
            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Have questions before or after? Post them in the{" "}
              <Link
                href={`/members/workshops/${slug}/workgroup`}
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
              >
                Workgroup
              </Link>{" "}
              — I reply to every thread.
            </p>
          </div>
        </div>
      </div>

      {/* Three action cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Pre-training */}
        <Link
          href={firstLesson?.path ?? "#"}
          className="group flex flex-col rounded-2xl border border-blue-100 bg-blue-50 p-5 transition hover:border-blue-300 hover:bg-blue-100/60"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 mb-1">
            Step 1
          </p>
          <p className="font-semibold text-slate-900">Pre-training</p>
          <p className="mt-1 text-sm text-slate-600 flex-1">
            {sections[0]?.lessons.length ?? 0} modules · ~10 min each
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Start now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        {/* Join live */}
        <Link
          href={joinLesson?.path ?? "#"}
          className="group flex flex-col rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition hover:border-emerald-300 hover:bg-emerald-100/60"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Step 2
          </p>
          <p className="font-semibold text-slate-900">Join live</p>
          <p className="mt-1 text-sm text-slate-600 flex-1">
            {workshop.displayDate}
            {workshop.displayTime && <> · {workshop.displayTime}</>}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
            Get the link
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        {/* Workgroup */}
        <Link
          href={`/members/workshops/${slug}/workgroup`}
          className="group flex flex-col rounded-2xl border border-violet-100 bg-violet-50 p-5 transition hover:border-violet-300 hover:bg-violet-100/60"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 mb-1">
            Any time
          </p>
          <p className="font-semibold text-slate-900">Workgroup</p>
          <p className="mt-1 text-sm text-slate-600 flex-1">
            Post questions · I reply to every thread
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 group-hover:gap-2 transition-all">
            Open discussion
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
