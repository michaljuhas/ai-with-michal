"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { WORKSHOP, getDaysUntilWorkshop, isRegistrationOpen } from "@/lib/workshop";
import RegisterButton from "@/components/RegisterButton";

export default function StickyCountdown() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [open, setOpen] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDaysLeft(getDaysUntilWorkshop());
    setOpen(isRegistrationOpen());

    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (daysLeft === null || !open) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Left: date + countdown */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
              <Clock size={14} className="text-blue-400" />
              <span>{WORKSHOP.displayDateShort}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-bold text-sm px-3 py-1.5 rounded-lg min-w-[3rem] text-center">
                {daysLeft}
              </div>
              <span className="text-slate-300 text-sm font-medium">
                {daysLeft === 1 ? "day" : "days"} left
              </span>
            </div>

            <span className="hidden md:inline text-slate-500 text-sm">
              — seats are limited, don&apos;t wait
            </span>
          </div>

          {/* Right: CTA */}
          <RegisterButton
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors group whitespace-nowrap"
            disabledClassName="inline-flex items-center gap-2 bg-slate-600 text-slate-400 font-semibold text-sm px-5 py-2.5 rounded-lg cursor-not-allowed whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
}
