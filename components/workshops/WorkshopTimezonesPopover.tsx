"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Globe } from "lucide-react";
import {
  WORKSHOP_TIMEZONE_POPOVER_ZONES,
  formatWorkshopIntervalInTimeZone,
} from "@/lib/workshops";

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function computePopoverPosition(
  trigger: DOMRect,
  panelWidth: number,
  panelHeight: number,
): { top: number; left: number } {
  const margin = 8;
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;

  let top = trigger.bottom + margin;
  let left = trigger.left;

  if (top + panelHeight > vh - margin) {
    top = trigger.top - panelHeight - margin;
  }
  if (top < margin) {
    top = margin;
  }

  if (left + panelWidth > vw - margin) {
    left = vw - panelWidth - margin;
  }
  if (left < margin) {
    left = margin;
  }

  return { top, left };
}

type Props = {
  start: Date | string;
  end: Date | string;
  timezoneConverterUrl: string;
};

export default function WorkshopTimezonesPopover({
  start,
  end,
  timezoneConverterUrl,
}: Props) {
  const panelId = `workshop-tz-${useId().replace(/:/g, "")}`;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const startD = useMemo(() => toDate(start), [start]);
  const endD = useMemo(() => toDate(end), [end]);

  const rows = useMemo(
    () =>
      WORKSHOP_TIMEZONE_POPOVER_ZONES.map(({ label, timeZone }) => ({
        label,
        line: formatWorkshopIntervalInTimeZone(startD, endD, timeZone),
      })),
    [startD, endD],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const reposition = useCallback(() => {
    const btn = triggerRef.current;
    const panel = panelRef.current;
    if (!btn || !panel) return;
    const trigger = btn.getBoundingClientRect();
    const { width, height } = panel.getBoundingClientRect();
    const w = width || panel.offsetWidth;
    const h = height || panel.offsetHeight;
    setCoords(computePopoverPosition(trigger, w, h));
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    reposition();
    const onWin = () => reposition();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, mounted, reposition]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target as Node;
      if (triggerRef.current?.contains(node)) return;
      if (panelRef.current?.contains(node)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const panel = open && mounted && (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-label="Workshop times in other time zones"
      className="w-[min(calc(100vw-1rem),22rem)] border border-slate-200 bg-white p-4 text-left text-slate-800 shadow-xl shadow-slate-900/15 rounded-xl"
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        zIndex: 200,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Same session, local times
      </p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Listed times use each region&apos;s clock (including daylight saving when it applies).
      </p>
      <ul className="mt-3 space-y-2.5">
        {rows.map(({ label, line }) => (
          <li key={label}>
            <span className="text-xs font-semibold text-slate-700">{label}</span>
            <p className="text-sm leading-snug text-slate-900">{line}</p>
          </li>
        ))}
      </ul>
      <a
        href={timezoneConverterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
      >
        Open time zone converter
        <ExternalLink size={10} aria-hidden />
      </a>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label="Workshop times in other time zones"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={15} strokeWidth={2} aria-hidden />
      </button>
      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
