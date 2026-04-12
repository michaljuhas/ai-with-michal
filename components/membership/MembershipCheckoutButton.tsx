"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2, ArrowRight } from "lucide-react";
import posthog from "posthog-js";

type Props = {
  label?: string;
  className?: string;
  cancelUrl?: string;
};

export default function MembershipCheckoutButton({
  label = "Join membership",
  className = "",
  cancelUrl = "/membership",
}: Props) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    if (!user) {
      const redirect = encodeURIComponent(cancelUrl || "/membership");
      window.location.assign(`/register?redirect_url=${redirect}&ref=membership-page`);
      return;
    }

    setLoading(true);
    posthog.capture("membership_checkout_initiated", { pathname: cancelUrl });
    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelUrl }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const disabled = !isLoaded || loading;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
        {label}
        {!loading ? <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden /> : null}
      </button>
      {error ? <p className="text-sm text-red-600 max-w-md text-center">{error}</p> : null}
    </div>
  );
}
