"use client";

import { SignIn } from "@clerk/nextjs";
import { absoluteUrlForRedirect } from "@/lib/auth-redirect";

type LoginClerkProps = {
  appBaseUrl: string;
  validatedRedirectPath: string | null;
};

export default function LoginClerk({ appBaseUrl, validatedRedirectPath }: LoginClerkProps) {
  const forceRedirectUrl = validatedRedirectPath
    ? absoluteUrlForRedirect(appBaseUrl, validatedRedirectPath)
    : undefined;

  const signUpSearch = new URLSearchParams();
  if (validatedRedirectPath) {
    signUpSearch.set("redirect_url", validatedRedirectPath);
  }
  const signUpUrl = signUpSearch.toString() ? `/register?${signUpSearch.toString()}` : "/register";

  return (
    <SignIn
      signUpUrl={signUpUrl}
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
