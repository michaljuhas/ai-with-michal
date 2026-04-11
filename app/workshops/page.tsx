import type { Metadata } from "next";
import UpcomingWorkshopCards from "@/components/workshops/UpcomingWorkshopCards";
import { PUBLIC_WORKSHOPS } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "Upcoming Workshops | AI with Michal",
  description:
    "Live 90-minute online workshops for recruiters and talent teams. Practical AI workflows you can apply immediately.",
  alternates: {
    canonical: "/workshops",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Upcoming Workshops | AI with Michal",
    description:
      "Live 90-minute online workshops for recruiters and talent teams. Practical workflows you can apply immediately.",
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
    title: "Upcoming Workshops | AI with Michal",
    description:
      "Live online workshops for recruiters and talent teams — practical AI workflows without fluff.",
    images: ["/workshop-og.jpeg"],
  },
};

export default function WorkshopsPage() {
  const now = new Date();
  const upcoming = PUBLIC_WORKSHOPS.filter((w) => w.date >= now).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const past = PUBLIC_WORKSHOPS.filter((w) => w.date < now).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24 md:py-24">
        {/* Header */}
        <div className="mb-14">
          <p className="text-blue-600 text-xs font-semibold tracking-widest uppercase mb-3">
            Live Online Workshops
          </p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Upcoming Workshops
          </h1>
          <p className="mt-4 text-slate-500 text-lg leading-relaxed">
            90-minute live sessions for recruiters and talent teams. Practical
            AI workflows — no fluff, no slides-only decks.
          </p>
        </div>

        <UpcomingWorkshopCards workshops={upcoming} />

        {/* Past workshops */}
        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
              Past Workshops
            </h2>
            <div className="space-y-3">
              {past.map((workshop) => (
                <div
                  key={workshop.slug}
                  className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4"
                >
                  <div className="shrink-0 w-16 text-center">
                    <p className="text-xl font-bold text-slate-400 leading-none">
                      {workshop.date.getDate()}
                    </p>
                    <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mt-1">
                      {workshop.date.toLocaleString("en-US", { month: "short" })}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-500 leading-snug">
                      {workshop.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{workshop.displayDate}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Did you know */}
            <div className="mt-6 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
              <span className="text-lg leading-none mt-0.5">💡</span>
              <div>
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
        )}
      </div>
    </main>
  );
}
