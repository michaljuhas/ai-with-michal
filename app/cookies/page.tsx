import Link from "next/link";
import {
  LEGAL_ENTITY_NAME,
  LEGAL_LAST_UPDATED,
  LEGAL_SITE_NAME,
  PUBLIC_CONTACT_EMAIL,
  getLegalContactMailto,
} from "@/lib/legal-entity";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-600">Legal</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Cookie Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LEGAL_LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-slate-700 text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">1. Introduction</h2>
            <p>
              This Cookie Policy explains how <strong>{LEGAL_ENTITY_NAME}</strong> (&quot;we&quot;,
              &quot;us&quot;) uses <strong>cookies</strong>, <strong>similar storage</strong> (such
              as <strong>localStorage</strong>), and related technologies when you visit{" "}
              <strong>{LEGAL_SITE_NAME}</strong> websites and services.
            </p>
            <p>
              For how we process personal data more broadly, see our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline underline-offset-2">
                Privacy Policy
              </Link>
              . Questions:{" "}
              <a
                href={getLegalContactMailto()}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {PUBLIC_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">2. What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a site. They are
              widely used to make sites work, remember preferences, measure audiences, and support
              advertising. We also use <strong>browser storage</strong> (for example localStorage) for
              similar purposes where noted below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">3. Categories we use</h2>
            <p>
              We group technologies into: <strong>strictly necessary</strong> (required for core
              functions such as sign-in and security), <strong>analytics</strong> (understanding
              usage), <strong>advertising / measurement</strong> (measuring and improving campaigns),
              and <strong>functional / first-party</strong> (remembering preferences and attribution).
            </p>
          </section>

          <section className="space-y-4 overflow-x-auto">
            <h2 className="text-lg font-semibold text-slate-900">4. Summary table</h2>
            <p className="text-sm text-slate-600">
              Exact cookie names and lifetimes can vary by browser, product updates, and your choices.
              This table describes typical technologies we use.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-900 font-semibold">
                  <tr>
                    <th className="px-4 py-3 align-top">Category</th>
                    <th className="px-4 py-3 align-top">Provider / tool</th>
                    <th className="px-4 py-3 align-top">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Strictly necessary</td>
                    <td className="px-4 py-3 align-top">Clerk (authentication)</td>
                    <td className="px-4 py-3 align-top">
                      Session and security cookies so you can sign in, stay signed in safely, and
                      access member areas. These are essential for account features.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Functional / first-party</td>
                    <td className="px-4 py-3 align-top">Our site</td>
                    <td className="px-4 py-3 align-top">
                      First-party cookies such as a <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">ref</code>{" "}
                      attribution value for marketing sources, and related server-side reads on
                      checkout or registration flows.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Functional / first-party</td>
                    <td className="px-4 py-3 align-top">Our site (browser storage)</td>
                    <td className="px-4 py-3 align-top">
                      <strong>localStorage</strong> may store first-touch campaign parameters (for
                      example UTM and referral data) so we can attribute registrations to the correct
                      source after you sign in. This is not a cookie but behaves similarly from a
                      privacy perspective.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Analytics</td>
                    <td className="px-4 py-3 align-top">PostHog</td>
                    <td className="px-4 py-3 align-top">
                      Understanding how the site is used (pages, events, and related diagnostics).
                      PostHog may set cookies or use other storage to recognise returning visitors and
                      persist session information.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Advertising / measurement</td>
                    <td className="px-4 py-3 align-top">Meta (Facebook)</td>
                    <td className="px-4 py-3 align-top">
                      Cookies such as <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">_fbp</code> and{" "}
                      <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">_fbc</code> where applicable, to
                      measure advertising performance and conversions.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Advertising / measurement</td>
                    <td className="px-4 py-3 align-top">LinkedIn</td>
                    <td className="px-4 py-3 align-top">
                      LinkedIn Insight Tag and related cookies or pixels to measure campaign
                      effectiveness and audiences on LinkedIn.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 align-top whitespace-nowrap">Tag management (optional)</td>
                    <td className="px-4 py-3 align-top">Google Tag Manager</td>
                    <td className="px-4 py-3 align-top">
                      When enabled, GTM loads and manages scripts (which may set additional cookies)
                      according to our configuration. Not all visitors may see GTM if it is not deployed
                      in a given environment.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">5. Third-party links and embeds</h2>
            <p>
              Our pages may link to third-party sites (for example payment pages hosted by Stripe, or
              social networks). Those services have their own cookie practices; please read their
              policies when you interact with them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">6. How to control cookies</h2>
            <p>You can control or delete cookies through your browser settings. For example:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline underline-offset-2"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline underline-offset-2"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline underline-offset-2"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline underline-offset-2"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p>
              Blocking or deleting <strong>strictly necessary</strong> cookies may prevent sign-in,
              checkout, or other core features from working correctly. You can often clear{" "}
              <strong>localStorage</strong> in the same browser settings area as cookies (sometimes
              under &quot;Site data&quot; or &quot;Storage&quot;).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">7. Updates</h2>
            <p>
              We may update this Cookie Policy when our practices or the tools we use change. Check
              the &quot;Last updated&quot; date at the top of this page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">8. Related documents</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link href="/privacy" className="text-blue-600 hover:underline underline-offset-2">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-600 hover:underline underline-offset-2">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
