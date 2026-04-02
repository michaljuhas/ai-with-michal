"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isRegistrationOpen } from "@/lib/workshop";
import { CURRENT_WORKSHOP_SLUG } from "@/lib/workshops";
import posthog from "posthog-js";

interface RegisterButtonProps {
  label?: string;
  href?: string;
  className?: string;
  disabledClassName?: string;
  open?: boolean;
  workshopSlug?: string;
}

export default function RegisterButton({
  label = "Join the workshop",
  href,
  className = "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20 whitespace-nowrap",
  disabledClassName = "inline-flex items-center gap-2 bg-slate-300 text-slate-500 font-semibold px-8 py-4 rounded-xl text-base cursor-not-allowed whitespace-nowrap",
  open: openProp,
  workshopSlug,
}: RegisterButtonProps) {
  const resolvedHref = href ?? `/workshops/${workshopSlug ?? CURRENT_WORKSHOP_SLUG}/tickets`;
  const open = openProp !== undefined ? openProp : isRegistrationOpen();

  if (!open) {
    return (
      <span className={disabledClassName}>
        Registration Closed
      </span>
    );
  }

  return (
    <Link
      href={resolvedHref}
      className={className}
      onClick={() => posthog.capture("register_button_clicked", { label })}
    >
      {label}
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
