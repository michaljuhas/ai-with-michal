"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PHOTOS: { src: string; alt: string }[] = [
  { src: "/consulting/consulting-01.jpg", alt: "Michal facilitating an AI consulting session" },
  { src: "/consulting/consulting-02.jpg", alt: "Workshop and consulting work with a team" },
  { src: "/consulting/consulting-03.jpg", alt: "Executive AI consulting discussion" },
  { src: "/consulting/consulting-04.jpg", alt: "On-site AI training and consulting" },
  { src: "/consulting/consulting-05.jpg", alt: "Team working session with Michal" },
  { src: "/consulting/consulting-06.jpeg", alt: "Consulting engagement — working with leadership" },
  { src: "/consulting/consulting-07.jpg", alt: "Hands-on AI consulting workshop" },
  { src: "/consulting/consulting-08.jpg", alt: "Client workshop and AI advisory" },
  { src: "/consulting/consulting-09.jpg", alt: "Group consulting and facilitation" },
  { src: "/consulting/consulting-10.jpg", alt: "Michal presenting during a consulting sprint" },
];

const SWIPE_MIN_PX = 50;

export default function ConsultingPhotoMosaic() {
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

  return (
    <div className="space-y-3" aria-label="Photos from workshops and consulting">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">From the field</p>
      <div className="grid grid-cols-2 gap-2.5">
        {PHOTOS.map(({ src, alt }, index) => (
          <button
            key={src}
            type="button"
            aria-haspopup="dialog"
            aria-label={`View larger: ${alt}`}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 text-left shadow-sm outline-none ring-offset-2 transition hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={() => setOpenIndex(index)}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1279px) 45vw, 280px"
              className="object-cover transition group-hover:scale-[1.02]"
              aria-hidden
            />
          </button>
        ))}
      </div>

      {openIndex !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-900/85 p-0 md:items-center md:p-6"
            onClick={close}
          >
            <div
              className="relative flex h-[100dvh] w-full max-w-none flex-col overflow-hidden bg-slate-950 md:h-[min(90vh,880px)] md:max-w-[1000px] md:rounded-2xl md:border md:border-white/10 md:shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 md:px-4">
                <span className="text-xs tabular-nums text-white/70">
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
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white/90 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    <X size={22} strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>

              <div
                className="relative min-h-[min(60dvh,560px)] flex-1 touch-pan-y md:min-h-0"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  key={PHOTOS[openIndex].src}
                  src={PHOTOS[openIndex].src}
                  alt={PHOTOS[openIndex].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="object-contain bg-slate-950"
                  priority
                />
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white outline-none backdrop-blur-sm transition hover:bg-black/55 focus-visible:ring-2 focus-visible:ring-white/80 md:flex"
                >
                  <ChevronLeft size={28} strokeWidth={2} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white outline-none backdrop-blur-sm transition hover:bg-black/55 focus-visible:ring-2 focus-visible:ring-white/80 md:flex"
                >
                  <ChevronRight size={28} strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
