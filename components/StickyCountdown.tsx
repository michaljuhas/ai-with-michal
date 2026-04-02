"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock } from "lucide-react";
import { getDaysUntilWorkshop, isRegistrationOpen } from "@/lib/workshop";
import { getPublicWorkshopBySlug, isOpen } from "@/lib/workshops";
import RegisterButton from "@/components/RegisterButton";

const VISIBLE_PREFIXES = ["/", "/workshops"];

function shouldShowOnRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return VISIBLE_PREFIXES.some((p) => p !== "/" && pathname.startsWith(p));
}

export default function StickyCountdown() {
  const pathname = usePathname();

  // If on a /workshops/[slug] page, use that workshop's data; else fall back to global
  const slugMatch = pathname.match(/^\/workshops\/([^/]+)/);
  const pageWorkshop = slugMatch ? getPublicWorkshopBySlug(slugMatch[1]) : undefined;

  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const [visible, setVisible] = useState(false);
  const [viewportBottomOffset, setViewportBottomOffset] = useState(0);

  useEffect(() => {
    if (pageWorkshop) {
      const diff = pageWorkshop.date.getTime() - Date.now();
      setDaysLeft(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
      setOpen(isOpen(pageWorkshop));
    } else {
      setDaysLeft(getDaysUntilWorkshop());
      setOpen(isRegistrationOpen());
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    const updateViewportOffset = () => {
      const viewport = window.visualViewport;
      if (!viewport) {
        setViewportBottomOffset(0);
        return;
      }

      // Track the visible viewport edge on iOS so the fixed bar stays attached
      // when the browser chrome expands/collapses.
      const nextOffset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      );
      setViewportBottomOffset(nextOffset);
    };

    const viewport = window.visualViewport;

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateViewportOffset);
    viewport?.addEventListener("resize", updateViewportOffset);
    viewport?.addEventListener("scroll", updateViewportOffset);
    handleScroll();
    updateViewportOffset();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateViewportOffset);
      viewport?.removeEventListener("resize", updateViewportOffset);
      viewport?.removeEventListener("scroll", updateViewportOffset);
    };
  }, []);

  if (daysLeft === null || !open || !shouldShowOnRoute(pathname)) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50 pointer-events-none"
      style={{ bottom: viewportBottomOffset }}
    >
      <div
        className={`pointer-events-auto bg-slate-950 border-t-2 border-blue-500 px-4 pt-3 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: date + countdown */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-200 text-sm font-medium">
              <Clock size={14} className="text-blue-400" />
              <span>{pageWorkshop?.displayDateShort ?? ""}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white font-bold text-base px-3 py-1.5 rounded-lg min-w-[3rem] text-center shadow-lg shadow-blue-500/30">
                {daysLeft}
              </div>
              <span className="text-white text-sm font-semibold">
                {daysLeft === 1 ? "day" : "days"} left
              </span>
            </div>

            <span className="hidden md:inline text-amber-400 text-sm font-medium">
              — seats are limited, don&apos;t wait
            </span>
          </div>

          {/* Right: CTA */}
          <RegisterButton
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors group whitespace-nowrap"
            disabledClassName="inline-flex items-center gap-2 bg-slate-600 text-slate-400 font-semibold text-sm px-5 py-2.5 rounded-lg cursor-not-allowed whitespace-nowrap"
            workshopSlug={pageWorkshop?.slug}
            open={open}
          />
        </div>
      </div>
    </div>
  );
}
