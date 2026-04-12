import type { Metadata } from "next";
import Image from "next/image";
import UpcomingWorkshopCards from "@/components/workshops/UpcomingWorkshopCards";
import WorkshopsAnimatedShell from "@/components/workshops/WorkshopsAnimatedShell";
import WorkshopsSeriesNav from "@/components/workshops/WorkshopsSeriesNav";
import { getWorkshopSeriesDefinition, parseWorkshopSeriesParam } from "@/lib/workshop-series";
import { getUpcomingPublicWorkshopsForSeries } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "Workshops | AI with Michal",
  description:
    "Live online workshops across recruiting, GTM, and agency paths — practical AI systems you can run the same week. Browse by series and grab a seat.",
  alternates: {
    canonical: "/workshops",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Workshops | AI with Michal",
    description:
      "Live 90-minute sessions for recruiting, go-to-market, and agency teams — systems-first AI, no fluff.",
    url: "/workshops",
    siteName: "AI with Michal",
    type: "website",
    images: [
      {
        url: "/workshop-og.jpeg",
        width: 2048,
        height: 1152,
        alt: "AI with Michal live workshops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshops | AI with Michal",
    description:
      "Live workshops for recruiting, GTM, and agency operators — practical AI systems without fluff.",
    images: ["/workshop-og.jpeg"],
  },
};

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const { series: seriesParam } = await searchParams;
  const activeSeries = parseWorkshopSeriesParam(seriesParam);
  const seriesMeta = getWorkshopSeriesDefinition(activeSeries)!;
  const upcoming = getUpcomingPublicWorkshopsForSeries(activeSeries);

  return (
    <WorkshopsAnimatedShell>
      <main>
        <section className="pt-24 md:pt-28 pb-10 px-4 sm:px-6 border-b border-slate-200/50 bg-white/40 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
              Live online workshops
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Workshops
            </h1>
            <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed">
              Three paths — recruiting, go-to-market, and agency — each built as a progression of
              live sessions. Pick a series, see what&apos;s scheduled, and join a focused 90 minutes
              with concrete workflows.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14 px-4 sm:px-6 pb-20 md:pb-24">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] xl:items-start xl:gap-6">
              <aside className="order-1 xl:sticky xl:top-24 shrink-0">
                <WorkshopsSeriesNav activeSeries={activeSeries} />
              </aside>

              <div className="order-2 min-w-0 w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-2xl shadow-slate-200/50 md:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  {seriesMeta.kicker}
                </p>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight md:text-3xl mb-5">
                  {seriesMeta.label}
                </h2>
                <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                  {seriesMeta.body.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Upcoming in this series
                  </p>
                  {upcoming.length > 0 ? (
                    <UpcomingWorkshopCards workshops={upcoming} />
                  ) : (
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Nothing scheduled in this series yet. Check back soon — we&apos;re adding
                      dates to the calendar.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex gap-4 items-start rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
                  <div className="shrink-0 pt-0.5">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-amber-200/90 shadow-sm ring-2 ring-amber-100/90">
                      <Image
                        src="/Michal-Juhas-headshot-square-v1.jpg"
                        alt="Michal Juhas"
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-amber-900">Did you know?</p>
                    <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                      I&apos;ve recorded over 300 webinars with more than 2,500 people since 2018.{" "}
                      <a
                        href="https://michaljuhas.com/training#past"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-2 hover:text-amber-950 transition-colors"
                      >
                        See all replays on my personal website →
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </WorkshopsAnimatedShell>
  );
}
