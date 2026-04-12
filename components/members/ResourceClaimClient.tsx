"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ResourceClaimClientProps = {
  slug: string;
  needsClaim: boolean;
};

/**
 * For unlisted resources: POST grant on mount, then refresh so the server can render content.
 */
export default function ResourceClaimClient({ slug, needsClaim }: ResourceClaimClientProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "claiming" | "done" | "error">(
    needsClaim ? "claiming" : "idle"
  );

  useEffect(() => {
    if (!needsClaim) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/members/resource-grants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        if (cancelled) return;
        if (!res.ok) {
          setPhase("error");
          return;
        }
        setPhase("done");
        router.refresh();
      } catch {
        if (!cancelled) setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsClaim, slug, router]);

  if (!needsClaim) return null;

  if (phase === "error") {
    return (
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Could not unlock this resource. Try refreshing the page or contact support.
      </div>
    );
  }

  if (phase === "claiming" || phase === "done") {
    return (
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <svg className="h-4 w-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24" aria-hidden>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Unlocking your download…
      </div>
    );
  }

  return null;
}
