import type { Metadata } from "next";
import { parseSafeRedirectUrl } from "@/lib/auth-redirect";
import LoginClerk from "../LoginClerk";

export const metadata: Metadata = {
  title: "Log In | AI in Recruiting and Talent Acquisition",
  description: "Sign in to continue to your AI in Recruiting and Talent Acquisition workshop registration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const validatedRedirectPath = parseSafeRedirectUrl(params.redirect_url);
  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://aiwithmichal.com";

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-start px-6 pt-6 pb-14 md:pt-8 bg-slate-50 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md min-w-0">
        <div className="text-center mb-8">
          <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
            Step 1 of 3
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-500">
            Sign in to continue to your workshop ticket selection.
          </p>
        </div>

        <div className="register-clerk-slot grid w-full min-w-0 [grid-template-columns:minmax(0,1fr)] justify-items-stretch">
          <LoginClerk appBaseUrl={appBaseUrl} validatedRedirectPath={validatedRedirectPath} />
        </div>
      </div>
    </div>
  );
}
