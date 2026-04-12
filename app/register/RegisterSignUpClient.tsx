"use client";

import { useMemo } from "react";
import { SignUp } from "@clerk/nextjs";
import { absoluteUrlForRedirect, deriveSignupIntentFromRedirectPath } from "@/lib/auth-redirect";
import { getStoredTrackingParams, type TrackingParams } from "@/lib/tracking-params";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
] as const;

function mergeTracking(
  attrFromCookie: Record<string, string> | null,
  fromLocal: TrackingParams | null
): Partial<Record<(typeof UTM_KEYS)[number], string>> {
  const out: Partial<Record<(typeof UTM_KEYS)[number], string>> = {};
  const cookie = attrFromCookie ?? {};
  const ls = fromLocal ?? {};
  for (const key of UTM_KEYS) {
    const v = (ls as Record<string, string | undefined>)[key] ?? cookie[key];
    if (v && typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  return out;
}

type RegisterSignUpClientProps = {
  appBaseUrl: string;
  validatedRedirectPath: string | null;
  product: string | null;
  attrFromCookie: Record<string, string> | null;
};

export default function RegisterSignUpClient({
  appBaseUrl,
  validatedRedirectPath,
  product,
  attrFromCookie,
}: RegisterSignUpClientProps) {
  const forceRedirectUrl = validatedRedirectPath
    ? absoluteUrlForRedirect(appBaseUrl, validatedRedirectPath)
    : undefined;

  const signInSearch = new URLSearchParams();
  if (validatedRedirectPath) {
    signInSearch.set("redirect_url", validatedRedirectPath);
  }
  const signInUrl = signInSearch.toString() ? `/login?${signInSearch.toString()}` : "/login";

  const unsafeMetadata = useMemo(() => {
    const merged = mergeTracking(attrFromCookie, getStoredTrackingParams());
    const meta: Record<string, unknown> = {};
    if (product) meta.interested_in_product = product;
    for (const key of UTM_KEYS) {
      const v = merged[key];
      if (v) meta[key] = v;
    }
    const intent = deriveSignupIntentFromRedirectPath(validatedRedirectPath);
    if (intent) meta.signup_intent = intent;
    return Object.keys(meta).length > 0 ? meta : undefined;
  }, [attrFromCookie, product, validatedRedirectPath]);

  return (
    <SignUp
      signInUrl={signInUrl}
      {...(unsafeMetadata ? { unsafeMetadata } : {})}
      appearance={{
        elements: {
          rootBox: "!w-full !max-w-full min-w-0 shrink-0 flex flex-col items-stretch",
          card: "!w-full !max-w-full min-w-0 bg-white border border-slate-200 shadow-md rounded-2xl",
          headerTitle: "text-slate-900",
          headerSubtitle: "text-slate-500",
          formFieldLabel: "text-slate-700",
          formFieldInput:
            "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
          footerActionLink: "text-blue-600 hover:text-blue-700",
          identityPreviewText: "text-slate-700",
          identityPreviewEditButton: "text-blue-600",
          socialButtonsBlockButton:
            "bg-white border-slate-300 text-slate-700 hover:bg-slate-50",
          socialButtonsBlockButtonText: "text-slate-700 font-medium",
          dividerLine: "bg-slate-200",
          dividerText: "text-slate-400",
        },
      }}
      {...(forceRedirectUrl ? { forceRedirectUrl } : {})}
      fallbackRedirectUrl="/tickets"
    />
  );
}
