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

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold tracking-widest uppercase text-blue-600">Legal</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LEGAL_LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-slate-700 text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">1. Agreement</h2>
            <p>
              These Terms of Use (&quot;Terms&quot;) govern your access to and use of the website and
              services offered by <strong>{LEGAL_ENTITY_NAME}</strong> under the brand{" "}
              <strong>{LEGAL_SITE_NAME}</strong> (collectively, the &quot;Services&quot;), including
              the site at{" "}
              <a
                href={CANONICAL_SITE_ORIGIN}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {CANONICAL_SITE_ORIGIN.replace(/^https?:\/\//, "")}
              </a>
              , live online workshops, mentoring, training materials, and related content.
            </p>
            <p>
              By accessing or using the Services, you agree to these Terms. If you do not agree, do
              not use the Services.
            </p>
            <p>
              <strong>Company details:</strong> {LEGAL_ENTITY_NAME}, {LEGAL_ENTITY_ADDRESS_STREET},{" "}
              {LEGAL_ENTITY_ADDRESS_CITY}. <strong>Contact:</strong>{" "}
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
            <h2 className="text-lg font-semibold text-slate-900">2. Eligibility and accounts</h2>
            <p>
              You must be at least 18 years old (or the age of majority in your jurisdiction) to
              purchase paid Services or create an account. You are responsible for providing accurate
              information and keeping your login credentials confidential. You may delete your account
              from the profile section of the site where this feature is available.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">3. Services and changes</h2>
            <p>
              We provide workshops, mentoring, and related educational content. Schedules, formats,
              and deliverables are described on the relevant pages at the time of purchase. We may
              update the site, reschedule sessions for operational reasons, or substitute presenters
              where necessary; we will use reasonable efforts to notify you of material changes
              affecting something you have already paid for.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">4. Fees and payment</h2>
            <p>
              Prices are shown on the site or checkout flow in the currency indicated. Payments are
              processed by our payment provider, <strong>Stripe</strong>. You authorize us and Stripe
              to charge your selected payment method for applicable fees.
            </p>
            <p>
              We do not receive or store your full payment card number on our own servers; card data
              is handled by Stripe according to its terms and security practices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">5. Refunds</h2>
            <p>
              For <strong>live workshops</strong>: if you <strong>attend</strong> a workshop session
              and are not satisfied with the experience, you may request a refund by emailing{" "}
              <a
                href={getLegalContactMailto()}
                className="text-blue-600 hover:underline underline-offset-2"
              >
                {PUBLIC_CONTACT_EMAIL}
              </a>{" "}
              within <strong>14 days</strong> after the scheduled end time of that workshop. Please
              include the email address used for your order and your order or receipt details. We will
              review good-faith requests and process approved refunds to the original payment method
              where possible; processing times may depend on your bank or card issuer.
            </p>
            <p>
              Other products or services (for example mentoring packages or digital goods) may have
              different rules as stated at purchase; where those rules conflict with this section for
              a specific offer, the offer-specific terms prevail.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">6. Intellectual property</h2>
            <p>
              The Services, including branding, materials, recordings (where provided), slides, and
              documentation, are owned by us or our licensors and are protected by intellectual
              property laws. We grant you a limited, non-exclusive, non-transferable licence to access
              and use materials made available to you for your personal or internal business learning
              in connection with the Services you purchased.
            </p>
            <p>
              You may not copy, redistribute, resell, record (beyond what we expressly provide),
              reverse engineer, or create derivative works from our materials except as allowed by
              law or with our prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">7. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Services in any unlawful way or in violation of these Terms</li>
              <li>Attempt to gain unauthorized access to our systems, other users&apos; accounts, or data</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Use the Services to transmit malware, spam, or harassing content</li>
              <li>Scrape or automate access to the site in a way that overloads or harms our infrastructure</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">8. Disclaimers</h2>
            <p>
              The Services are provided for <strong>education and informational purposes</strong>.
              We do not provide legal, tax, or professional advice tailored to your situation.
              Results depend on your implementation; we make no guarantee of specific outcomes.
            </p>
            <p>
              To the fullest extent permitted by law, the Services are provided &quot;as is&quot; and
              &quot;as available&quot; without warranties of any kind, express or implied, including
              merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by applicable law, <strong>{LEGAL_ENTITY_NAME}</strong>{" "}
              and its directors, employees, and contractors shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or for loss of profits, data,
              or goodwill, arising from your use of the Services.
            </p>
            <p>
              Our total liability for claims arising out of or related to the Services shall not exceed
              the amount you paid us for the specific Service giving rise to the claim in the twelve
              (12) months before the claim (or, if higher, the minimum amount required by mandatory
              consumer law applicable to you).
            </p>
            <p>
              Nothing in these Terms limits liability that cannot be limited under applicable law,
              including liability for death or personal injury caused by negligence where such a
              limitation is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">10. Indemnity</h2>
            <p>
              You agree to indemnify and hold harmless {LEGAL_ENTITY_NAME} from claims, damages, and
              expenses (including reasonable legal fees) arising from your misuse of the Services or
              violation of these Terms, to the extent permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">11. Termination</h2>
            <p>
              We may suspend or terminate access to the Services if you materially breach these Terms
              or if required for legal or security reasons. Provisions that by their nature should
              survive (including intellectual property, disclaimers, and limitation of liability) will
              survive termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">12. Governing law and disputes</h2>
            <p>
              These Terms are governed by the laws of the <strong>Slovak Republic</strong>, without
              regard to conflict-of-law rules. The courts of the Slovak Republic shall have exclusive
              jurisdiction over disputes arising from these Terms, subject to any mandatory rights you
              may have as a consumer to bring proceedings in your country of residence.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">13. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. We will post the revised version on this
              page and update the &quot;Last updated&quot; date. Continued use of the Services after
              changes become effective constitutes acceptance of the revised Terms, except where
              stricter notice is required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">14. Privacy</h2>
            <p>
              Our collection and use of personal data is described in our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/cookies" className="text-blue-600 hover:underline underline-offset-2">
                Cookie Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
