"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isRegistrationOpen } from "@/lib/workshop";

interface RegisterButtonProps {
  label?: string;
  className?: string;
  disabledClassName?: string;
}

export default function RegisterButton({
  label = "Reserve Your Seat",
  className = "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20 whitespace-nowrap",
  disabledClassName = "inline-flex items-center gap-2 bg-slate-300 text-slate-500 font-semibold px-8 py-4 rounded-xl text-base cursor-not-allowed whitespace-nowrap",
}: RegisterButtonProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(isRegistrationOpen());
  }, []);

  if (!open) {
    return (
      <span className={disabledClassName}>
        Registration Closed
      </span>
    );
  }

  return (
    <Link href="/register" className={className}>
      {label}
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
