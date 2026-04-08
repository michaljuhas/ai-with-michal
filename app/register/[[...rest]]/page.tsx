import { SignUp } from "@clerk/nextjs";
import { ShieldCheck, Calendar, Clock } from "lucide-react";
import { WORKSHOP } from "@/lib/workshop";

export const metadata = {
  title: "Register | AI in Recruiting and Talent Acquisition",
  description: "Create your free account to reserve your seat for the AI in Recruiting and Talent Acquisition workshop.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; redirect_url?: string }>;
}) {
  const params = await searchParams;
  const product = params.product ?? null;
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-start px-6 pt-6 pb-14 md:pt-8 bg-slate-50 overflow-x-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      {/* Block + mx-auto avoids flex item min-width quirks; grid below forces Clerk to respect column width */}
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

        {/* Workshop reminder */}
        <div className="mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Calendar size={14} className="text-blue-500 shrink-0" />
            <span><strong>AI in Recruiting Workshop</strong> · {WORKSHOP.displayDate}</span>
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
          <SignUp
            {...(product ? { unsafeMetadata: { interested_in_product: product } } : {})}
            appearance={{
              elements: {
                rootBox:
                  "!w-full !max-w-full min-w-0 shrink-0 flex flex-col items-stretch",
                card:
                  "!w-full !max-w-full min-w-0 bg-white border border-slate-200 shadow-md rounded-2xl",
              headerTitle: "text-slate-900",
              headerSubtitle: "text-slate-500",
              formFieldLabel: "text-slate-700",
              formFieldInput:
                "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
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
          fallbackRedirectUrl="/tickets"
          />
        </div>
      </div>
    </div>
  );
}
