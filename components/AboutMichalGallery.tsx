"use client";

import type { ElementType, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Star, GraduationCap, Youtube, BookOpen, Video, Map } from "lucide-react";
import { motion } from "framer-motion";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";

const PHOTOS: { src: string; alt: string }[] = [
  { src: "/about-michal/about-01.jpg", alt: "Michal Juhas presenting at a conference" },
  { src: "/about-michal/about-02.jpg", alt: "Michal Juhas speaking on stage" },
  { src: "/about-michal/about-03.jpg", alt: "Michal Juhas consulting with a team" },
  { src: "/about-michal/about-04.jpg", alt: "Michal Juhas giving a workshop" },
  { src: "/about-michal/about-05.jpg", alt: "Michal Juhas at a live event" },
  { src: "/about-michal/about-06.jpg", alt: "Michal Juhas interacting with audience" },
  { src: "/about-michal/about-07.jpg", alt: "Michal Juhas on a panel" },
  { src: "/about-michal/about-08.jpg", alt: "Michal Juhas delivering a keynote" },
  { src: "/about-michal/about-09.jpg", alt: "Michal Juhas teaching AI concepts" },
  { src: "/about-michal/about-10.jpg", alt: "Michal Juhas leading a training session" },
  { src: "/about-michal/about-11.jpg", alt: "Michal Juhas at a corporate event" },
  { src: "/about-michal/about-12.jpg", alt: "Michal Juhas in a meeting" },
  { src: "/about-michal/about-13.jpg", alt: "Michal Juhas explaining workflow automation" },
  { src: "/about-michal/about-14.jpg", alt: "Michal Juhas smiling at a conference" },
  { src: "/about-michal/about-15.jpg", alt: "Michal Juhas during a Q&A" },
  { src: "/about-michal/about-16.jpg", alt: "Michal Juhas with event attendees" },
  { src: "/about-michal/about-17.jpg", alt: "Michal Juhas presenting slides" },
  { src: "/about-michal/about-18.jpg", alt: "Michal Juhas on stage" },
];

const DISPLAY_COUNT = 8;
const SWIPE_MIN_PX = 50;

const defaultStats = [
  { icon: Star, value: "190+", label: "Trustpilot Reviews", iconColor: "text-yellow-500" },
  { icon: BookOpen, value: "1,500+", label: "Udemy Ratings", iconColor: "text-violet-500" },
  { icon: Youtube, value: "1M+", label: "YouTube Views", iconColor: "text-red-500" },
  { icon: GraduationCap, value: "50k+", label: "Course Students", iconColor: "text-blue-500" },
  { icon: Video, value: "100+", label: "Webinars Hosted", iconColor: "text-teal-500" },
  { icon: Map, value: "5,000+", label: "Mind Maps Sold", iconColor: "text-orange-500" },
];

export default function AboutMichalGallery({
  title = "Who we are",
  heading = "A Community of AI Enthusiasts Led by Michal Juhas",
  stats = defaultStats,
  children,
}: {
  title?: string;
  heading?: string;
  stats?: { icon: ElementType; value: string; label: string; iconColor: string }[];
  children?: ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const n = PHOTOS.length;

  const goPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + n) % n));
  }, [n]);

  const goNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % n));
  }, [n]);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, goPrev, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || openIndex === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const displayedPhotos = PHOTOS.slice(0, DISPLAY_COUNT);
  const remainingCount = Math.max(0, n - DISPLAY_COUNT);

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            {title}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            {heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left Column: Text & Stats */}
          <motion.div
            className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                  <Image
                    src="/Michal-Juhas-headshot-square-v1.jpg"
                    alt="Michal Juhas"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 text-2xl font-bold mb-1">Michal Juhas</h3>
                <p className="text-blue-600 text-sm font-medium">
                  AI Educator & Automation Expert
                </p>
              </div>
            </div>

            <div className="space-y-4 text-slate-600 leading-relaxed mb-8">
              {children || (
                <>
                  <p>
                    With years of experience in technical recruiting, AI education, and
                    workflow automation, Michal helps professionals and teams adopt AI in
                    ways that deliver real, measurable results — not just buzzwords.
                  </p>
                  <p>
                    From live workshops and 1-on-1 mentoring to enterprise-grade integration
                    projects, our mission is to make AI practical and accessible for everyone.
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6 pt-8 border-t border-slate-100">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <Icon size={18} className={`shrink-0 ${stat.iconColor}`} />
                    <div>
                      <p className="text-slate-900 font-bold text-sm leading-tight">{stat.value}</p>
                      <p className="text-slate-400 text-xs leading-tight mt-0.5">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <MichalProfileLearnMoreLink className="mt-8" />
          </motion.div>

          {/* Right Column: Photo Gallery */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayedPhotos.map(({ src, alt }, index) => {
              const isLast = index === DISPLAY_COUNT - 1;
              const isFirst = index === 0;
              
              return (
                <button
                  key={src}
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={isLast && remainingCount > 0 ? `View ${remainingCount} more photos` : `View larger: ${alt}`}
                  className={`group relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 text-left shadow-sm outline-none ring-offset-2 transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isFirst ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "col-span-1 aspect-square"
                  }`}
                  onClick={() => setOpenIndex(index)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    aria-hidden
                  />
                  {isLast && remainingCount > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] transition group-hover:bg-slate-900/70">
                      <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        +{remainingCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Lightbox Portal */}
        {openIndex !== null &&
          createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Photo gallery"
              className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-900/90 backdrop-blur-sm p-0 md:items-center md:p-6"
              onClick={close}
            >
              <div
                className="relative flex h-[100dvh] w-full max-w-none flex-col overflow-hidden bg-slate-950 md:h-[min(90vh,880px)] md:max-w-[1200px] md:rounded-2xl md:border md:border-white/10 md:shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 md:px-4 bg-slate-900/50">
                  <span className="text-xs font-medium tabular-nums text-white/70">
                    {openIndex + 1} / {n}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous photo"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                      <ChevronLeft size={24} strokeWidth={2} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next photo"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                      <ChevronRight size={24} strokeWidth={2} aria-hidden />
                    </button>
                    <button
                      ref={closeBtnRef}
                      type="button"
                      onClick={close}
                      aria-label="Close gallery"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80 bg-white/5 hover:bg-white/15"
                    >
                      <X size={22} strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                </div>

                <div
                  className="relative min-h-[min(60dvh,560px)] flex-1 touch-pan-y md:min-h-0 bg-slate-950/50"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <Image
                    key={PHOTOS[openIndex].src}
                    src={PHOTOS[openIndex].src}
                    alt={PHOTOS[openIndex].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-contain"
                    priority
                  />
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous photo"
                    className="absolute left-4 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white outline-none backdrop-blur-sm transition hover:bg-black/60 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 md:flex"
                  >
                    <ChevronLeft size={32} strokeWidth={2} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next photo"
                    className="absolute right-4 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white outline-none backdrop-blur-sm transition hover:bg-black/60 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 md:flex"
                  >
                    <ChevronRight size={32} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </section>
  );
}
