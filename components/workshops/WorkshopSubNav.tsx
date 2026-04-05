"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "workshop",      label: "Workshop",      href: null },
  { id: "agenda",        label: "Agenda",        href: "#agenda" },
  { id: "how-it-works",  label: "How it works",  href: "#how-it-works" },
  { id: "pricing",       label: "Pricing",       href: "#pricing" },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

export default function WorkshopSubNav() {
  const [active, setActive] = useState<NavId>("workshop");

  useEffect(() => {
    const sectionIds: NavId[] = ["agenda", "how-it-works", "pricing"];
    const intersecting = new Set<NavId>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as NavId;
          if (entry.isIntersecting) {
            intersecting.add(id);
          } else {
            intersecting.delete(id);
          }
        });

        const ordered: NavId[] = ["agenda", "how-it-works", "pricing"];
        const first = ordered.find((id) => intersecting.has(id));
        if (first) {
          setActive(first);
        } else if (window.scrollY < 300) {
          setActive("workshop");
        }
      },
      { rootMargin: "-64px 0px -50% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 300) setActive("workshop");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.href === null) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(item.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/70">
      <nav
        aria-label="Workshop sections"
        className="max-w-7xl mx-auto px-6 flex items-center gap-1 h-11"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={[
                "px-3 py-1 rounded-md text-xs transition-colors",
                isActive
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
