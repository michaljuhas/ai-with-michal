"use client";

import { useState, useRef } from "react";
import { ArrowRight, CheckCircle2, Loader2, CalendarDays } from "lucide-react";
import { SITE } from "@/lib/config";
import { getStoredTrackingParams } from "@/lib/tracking-params";
import posthog from "posthog-js";

interface B2BLeadFormProps {
  interestType: "workshop" | "integration";
  availableServices: string[];
  preselectedService?: string;
}

export default function B2BLeadForm({
  interestType,
  availableServices,
  preselectedService,
}: B2BLeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedService ? [preselectedService] : []
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Track whether the user has started filling in the form (fire once)
  const hasStarted = useRef(false);
  // Captured at first focus — referrer and page at time of form engagement
  const capturedReferrer = useRef<string | null>(null);
  const capturedLandingPage = useRef<string | null>(null);

  function handleFirstFocus() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    capturedReferrer.current = document.referrer || null;
    capturedLandingPage.current = window.location.pathname + window.location.search;
    posthog.capture("b2b_form_started", { interest_type: interestType });
  }

  function toggleService(service: string) {
    setSelectedServices((prev) => {
      const removing = prev.includes(service);
      const next = removing ? prev.filter((s) => s !== service) : [...prev, service];
      posthog.capture("b2b_service_toggled", {
        interest_type: interestType,
        service,
        action: removing ? "deselected" : "selected",
        total_selected: next.length,
      });
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const submitProps = {
      interest_type: interestType,
      services: selectedServices,
      services_count: selectedServices.length,
      has_company: company.trim().length > 0,
      has_role: role.trim().length > 0,
      has_message: message.trim().length > 0,
    };

    posthog.capture("b2b_form_submit_attempted", submitProps);

    try {
      const tracking = getStoredTrackingParams();
      const res = await fetch("/api/b2b-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          role: role || undefined,
          interest_type: interestType,
          services: selectedServices.length > 0 ? selectedServices : undefined,
          message: message || undefined,
          tracking: tracking ?? undefined,
          referrer: capturedReferrer.current ?? undefined,
          landing_page: capturedLandingPage.current ?? undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      posthog.capture("b2b_lead_submitted", submitProps);
      setSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      posthog.capture("b2b_form_error", {
        interest_type: interestType,
        error: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle2 className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Thanks! I&apos;ll be in touch soon.
        </h3>
        <p className="text-slate-600 leading-relaxed mb-8 max-w-md mx-auto">
          I&apos;ve received your request and will follow up within 1 business day.
          If you&apos;d like to skip the wait, book a 30-min intro call directly.
        </p>
        <a
          href={SITE.bookingLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20"
          onClick={() =>
            posthog.capture("b2b_booking_link_clicked", {
              interest_type: interestType,
              services: selectedServices,
            })
          }
        >
          <CalendarDays size={18} />
          Book a 30-min intro call
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Request more info &amp; pricing</h3>
      <p className="text-slate-500 mb-8">
        Tell me a bit about your team and I&apos;ll get back to you with a tailored proposal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="b2b-name">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              id="b2b-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={handleFirstFocus}
              placeholder="Jane Smith"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="b2b-email">
              Work email <span className="text-red-500">*</span>
            </label>
            <input
              id="b2b-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFirstFocus}
              placeholder="jane@company.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Company + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="b2b-company">
              Company
            </label>
            <input
              id="b2b-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onFocus={handleFirstFocus}
              placeholder="Acme Corp"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="b2b-role">
              Your role
            </label>
            <input
              id="b2b-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onFocus={handleFirstFocus}
              placeholder="Head of Talent"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Services checkboxes */}
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-3">
            I&apos;m interested in{" "}
            <span className="text-slate-400 font-normal">(select all that apply)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableServices.map((service) => {
              const checked = selectedServices.includes(service);
              return (
                <label
                  key={service}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 text-sm ${
                    checked
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 shrink-0 accent-blue-600"
                    checked={checked}
                    onChange={() => toggleService(service)}
                    onFocus={handleFirstFocus}
                  />
                  <span className="leading-snug">{service}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Optional message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="b2b-message">
            Anything else you&apos;d like me to know?{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="b2b-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFirstFocus}
            placeholder="Team size, timeline, specific challenges..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base group shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Request more info
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
