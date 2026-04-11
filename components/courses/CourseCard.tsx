import Link from "next/link";
import { ArrowRight, BookOpen, Video, Layers } from "lucide-react";
import type { CourseDef, CourseFormat } from "@/lib/courses";

const FORMAT_LABEL: Record<CourseFormat, string> = {
  recorded: "Self-paced",
  "live-session": "Live sessions",
  hybrid: "Hybrid",
};

const FORMAT_ICON: Record<CourseFormat, typeof Video> = {
  recorded: Video,
  "live-session": BookOpen,
  hybrid: Layers,
};

const cardAccents = [
  {
    gradient: "from-blue-50 via-white to-white",
    border: "border-blue-100 hover:border-blue-300",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
    arrow: "group-hover:text-blue-500",
  },
  {
    gradient: "from-violet-50 via-white to-white",
    border: "border-violet-100 hover:border-violet-300",
    badgeBg: "bg-violet-50 border-violet-200 text-violet-700",
    arrow: "group-hover:text-violet-500",
  },
] as const;

type Props = {
  course: CourseDef;
  index?: number;
};

export default function CourseCard({ course, index = 0 }: Props) {
  const accent = cardAccents[index % cardAccents.length];
  const Icon = FORMAT_ICON[course.format];
  const formatLabel = FORMAT_LABEL[course.format];
  const priceFrom = Math.min(course.prices.basic, course.prices.pro);

  return (
    <Link
      href={`/training/${course.slug}`}
      className={`group relative flex flex-col gap-4 rounded-2xl border bg-gradient-to-br ${accent.gradient} ${accent.border} hover:shadow-md transition-all p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${accent.badgeBg}`}
        >
          <Icon size={12} />
          {formatLabel}
        </span>
        {course.sessionsIncluded && (
          <span className="text-xs text-slate-500 font-medium shrink-0">
            {course.sessionsIncluded}× live call{course.sessionsIncluded > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <h2 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-slate-700 transition-colors">
        {course.title}
      </h2>

      {course.tagline && (
        <p className="text-sm text-slate-500 italic leading-relaxed">{course.tagline}</p>
      )}

      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
        {course.description}
      </p>

      <div className="flex items-center justify-between gap-4 mt-auto">
        <p className="text-sm font-semibold text-slate-700">
          From €{priceFrom}
        </p>
        <ArrowRight
          size={18}
          className={`shrink-0 text-slate-300 ${accent.arrow} group-hover:translate-x-0.5 transition-all`}
        />
      </div>
    </Link>
  );
}
