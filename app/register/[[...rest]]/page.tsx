import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ShieldCheck, Calendar, Clock } from "lucide-react";
import { WORKSHOP } from "@/lib/workshop";
import { parseSafeRedirectUrl } from "@/lib/auth-redirect";
import RegisterSignUpClient from "../RegisterSignUpClient";

export const metadata: Metadata = {
  title: "Register | AI in Recruiting and Talent Acquisition",
  description: "Create your free account to reserve your seat for the AI in Recruiting and Talent Acquisition workshop.",
  robots: {
    index: false,
    follow: false,
  },
};

function parseAttrCookie(raw: string | undefined): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed = (() => {
      try {
        return JSON.parse(raw) as unknown;
      } catch {
        return JSON.parse(decodeURIComponent(raw)) as unknown;
      }
    })();
    if (!parsed || typeof parsed !== "object") return null;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && v.trim()) out[k] = v.trim();
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; redirect_url?: string }>;
}) {
  const params = await searchParams;
  const product = params.product ?? null;
  const validatedRedirectPath = parseSafeRedirectUrl(params.redirect_url);
  const cookieStore = await cookies();
  const attrFromCookie = parseAttrCookie(cookieStore.get("_attr")?.value);
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://aiwithmichal.com";

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-start px-6 pt-6 pb-14 md:pt-8 bg-slate-50 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md min-w-0">
        <div className="text-center mb-6">
          <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
            Step 1 of 2
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Create Your Free Account
          </h1>
          <p className="mt-2 text-slate-500">
            One more step to secure your seat — takes under a minute.
          </p>
        </div>

        <div className="mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Calendar size={14} className="text-blue-500 shrink-0" />
            <span>
              <strong>AI in Recruiting Workshop</strong> · {WORKSHOP.displayDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={14} className="text-slate-400 shrink-0" />
            <span>{WORKSHOP.displayTime} · Live 90-minute online session</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Full refund if you don&apos;t like the workshop</span>
          </div>
        </div>

        <div className="register-clerk-slot grid w-full min-w-0 [grid-template-columns:minmax(0,1fr)] justify-items-stretch">
          <RegisterSignUpClient
            appBaseUrl={appBaseUrl}
            validatedRedirectPath={validatedRedirectPath}
            product={product}
            attrFromCookie={attrFromCookie}
          />
        </div>
      </div>
    </div>
  );
}
