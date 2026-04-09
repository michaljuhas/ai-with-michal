import Link from "next/link";
import {
  CANONICAL_SITE_ORIGIN,
  LEGAL_ENTITY_ADDRESS_CITY,
  LEGAL_ENTITY_ADDRESS_STREET,
  LEGAL_ENTITY_NAME,
  LEGAL_LAST_UPDATED,
  LEGAL_SITE_NAME,
  PUBLIC_CONTACT_EMAIL,
  getLegalContactMailto,
} from "@/lib/legal-entity";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-600">Legal</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LEGAL_LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-slate-700 text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">1. Who we are</h2>
            <p>
              This Privacy Policy explains how{" "}
              <strong>{LEGAL_ENTITY_NAME}</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
              processes personal data in connection with the <strong>{LEGAL_SITE_NAME}</strong> website
              and related services (workshops, mentoring, training content, and communications),
              available at{" "}
              <a
                href={CANONICAL_SITE_ORIGIN}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {CANONICAL_SITE_ORIGIN.replace(/^https?:\/\//, "")}
              </a>
              .
            </p>
            <p>
              For the purposes of the EU General Data Protection Regulation (GDPR), we are the{" "}
              <strong>data controller</strong> for personal data described in this policy (unless we
              state otherwise for a specific processing activity).
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              <a
                href={getLegalContactMailto()}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {PUBLIC_CONTACT_EMAIL}
              </a>
              <br />
              <strong>Address:</strong> {LEGAL_ENTITY_ADDRESS_STREET}, {LEGAL_ENTITY_ADDRESS_CITY}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">2. What data we collect</h2>
            <p>Depending on how you use our services, we may process:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account and identity data</strong> — for example name, email address, and
                profile details when you register or sign in. Authentication and user accounts are
                provided by <strong>Clerk</strong> (and may include session cookies as described in our{" "}
                <Link href="/cookies" className="text-blue-600 hover:underline underline-offset-2">
                  Cookie Policy
                </Link>
                ).
              </li>
              <li>
                <strong>Transactional and customer data</strong> — details about orders, workshop or
                mentoring purchases, payment status, and related records. Payments are processed by{" "}
                <strong>Stripe</strong>; we receive payment-related information from Stripe but do not
                store your full card number on our own servers.
              </li>
              <li>
                <strong>Data we maintain in our systems</strong> — for example registration,
                attendance, access to member areas, and service delivery records, typically stored in{" "}
                <strong>Supabase</strong> (hosted database) and linked to your account or email.
              </li>
              <li>
                <strong>Communications</strong> — messages you send us (for example via contact
                forms or email), and emails we send such as confirmations and reminders, often
                delivered through <strong>SendGrid</strong> or comparable providers.
              </li>
              <li>
                <strong>Usage and analytics data</strong> — information about how the site is used
                (pages viewed, events, approximate location derived from IP where applicable), via{" "}
                <strong>PostHog</strong> and similar analytics tools.
              </li>
              <li>
                <strong>Advertising and measurement data</strong> — where we or our partners use tags
                or pixels (for example <strong>Meta</strong> and <strong>LinkedIn</strong>), cookies
                or similar identifiers may be used to measure campaigns and conversions. If{" "}
                <strong>Google Tag Manager</strong> is enabled on the site, it may load additional
                scripts according to our configuration.
              </li>
              <li>
                <strong>Referral and campaign parameters</strong> — for example a first-party{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">ref</code> value or UTM
                parameters, stored in cookies or browser storage to attribute visits (see our{" "}
                <Link href="/cookies" className="text-blue-600 hover:underline underline-offset-2">
                  Cookie Policy
                </Link>
                ).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">3. Purposes and legal bases</h2>
            <p>We process personal data for purposes including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Providing our services</strong> — creating and managing accounts, delivering
                workshops and mentoring, granting access to member content, and customer support{" "}
                (<strong>performance of a contract</strong> and steps prior to entering a contract).
              </li>
              <li>
                <strong>Processing payments</strong> — facilitating checkout and refunds through
                Stripe (<strong>performance of a contract</strong>; <strong>legitimate interests</strong>{" "}
                in secure payment processing and fraud prevention).
              </li>
              <li>
                <strong>Communicating with you</strong> — service emails, reminders, and responses to
                inquiries (<strong>performance of a contract</strong> or{" "}
                <strong>legitimate interests</strong> in running our business).
              </li>
              <li>
                <strong>Analytics and product improvement</strong> — understanding how the site and
                offers are used (<strong>legitimate interests</strong>, and where required by law,{" "}
                <strong>consent</strong> for non-essential cookies — see our{" "}
                <Link href="/cookies" className="text-blue-600 hover:underline underline-offset-2">
                  Cookie Policy
                </Link>
                ).
              </li>
              <li>
                <strong>Marketing and advertising measurement</strong> — measuring ad performance
                and retargeting where applicable (<strong>consent</strong> where required, or{" "}
                <strong>legitimate interests</strong> where permitted by law).
              </li>
              <li>
                <strong>Compliance and security</strong> — meeting legal obligations, enforcing our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline underline-offset-2">
                  Terms of Use
                </Link>
                , and protecting users and systems (<strong>legal obligation</strong> or{" "}
                <strong>legitimate interests</strong>).
              </li>
            </ul>
            <p>
              Where we rely on <strong>legitimate interests</strong>, we balance those interests
              against your rights. You may object to certain processing as described below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">4. Sharing and subprocessors</h2>
            <p>
              We share personal data with trusted service providers who process it on our behalf
              under appropriate agreements, including categories such as:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authentication — Clerk</li>
              <li>Payments — Stripe</li>
              <li>Database / infrastructure — Supabase</li>
              <li>Email delivery — SendGrid (or comparable)</li>
              <li>Analytics — PostHog</li>
              <li>Advertising / tags — Meta, LinkedIn, and optionally Google Tag Manager</li>
            </ul>
            <p>
              These providers may process data in the European Economic Area and/or other countries.
              Where personal data is transferred outside the EEA, we use appropriate safeguards (such
              as Standard Contractual Clauses approved by the European Commission) or other lawful
              transfer mechanisms as described in the relevant provider&apos;s documentation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">5. Retention</h2>
            <p>
              We keep personal data only as long as necessary for the purposes above, including
              legal, accounting, and tax requirements. For example, we may retain order and invoice
              records for the period required by law, and marketing data until you object or withdraw
              consent where applicable. Analytics logs may be retained for shorter periods according to
              tool settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">6. Your rights</h2>
            <p>Under applicable law (including the GDPR where it applies), you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure (&quot;right to be forgotten&quot;) in certain cases</li>
              <li>Restrict processing in certain cases</li>
              <li>Data portability, where applicable</li>
              <li>Object to processing based on legitimate interests or for direct marketing</li>
              <li>Withdraw consent at any time, where processing is based on consent</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>
              In Slovakia, the supervisory authority is the Office for Personal Data Protection of the
              Slovak Republic (Úrad na ochranu osobných údajov Slovenskej republiky — ÚOOÚ).
            </p>
            <p>
              <strong>Account deletion:</strong> Signed-in users can delete their account from the
              profile section of the site. Deletion removes or disconnects your account according to
              our technical and legal retention needs.
            </p>
            <p>
              <strong>Other requests:</strong> Contact us at{" "}
              <a
                href={getLegalContactMailto()}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {PUBLIC_CONTACT_EMAIL}
              </a>
              . We will respond within the time limits set by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">7. Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect personal data
              against unauthorized access, loss, or misuse. No method of transmission over the
              internet is completely secure; we strive to follow industry practices appropriate to our
              services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">8. Children</h2>
            <p>
              Our services are aimed at adults and professionals. We do not knowingly collect
              personal data from children under 16. If you believe we have collected such data, please
              contact us and we will take steps to delete it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">9. Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the revised version
              on this page and adjust the &quot;Last updated&quot; date. Material changes may be
              communicated by email or a notice on the site where appropriate.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">10. Related documents</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link href="/cookies" className="text-blue-600 hover:underline underline-offset-2">
                  Cookie Policy
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
