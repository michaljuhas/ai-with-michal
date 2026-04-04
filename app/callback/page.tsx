import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn OAuth — wrong port",
  robots: { index: false, follow: false },
};

/**
 * LinkedIn CLI OAuth used to default to this path on :3000, which collides with Next.js.
 * Real callback is http://localhost:3910/callback (see scripts/linkedin/config.mjs).
 */
export default function LinkedInCallbackFallbackPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold text-[#0f172a]">
        This page is not the LinkedIn OAuth callback
      </h1>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#64748b]">
        The CLI opens a small server on a separate port so it does not fight{" "}
        <code className="rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[0.85em] text-[#475569]">
          next dev
        </code>{" "}
        on port 3000. If you see this screen, your browser hit the app instead of the
        OAuth helper.
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-[0.9375rem] text-[#334155]">
        <li>
          In the LinkedIn Developer app, add authorized redirect URL{" "}
          <code className="whitespace-nowrap rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[0.85em]">
            http://localhost:3910/callback
          </code>
        </li>
        <li>
          Remove{" "}
          <code className="whitespace-nowrap rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[0.85em]">
            LINKEDIN_REDIRECT_URI
          </code>{" "}
          from <code className="font-mono text-[0.85em]">.env</code> or set it to the URL
          above.
        </li>
        <li>
          Run{" "}
          <code className="whitespace-nowrap rounded bg-[#f1f5f9] px-1.5 py-0.5 font-mono text-[0.85em]">
            node --env-file=.env scripts/linkedin/index.mjs auth
          </code>{" "}
          (or <code className="font-mono text-[0.85em]">auth-ads</code>) again and complete
          login — the success page will be served on port 3910.
        </li>
      </ol>
    </main>
  );
}
