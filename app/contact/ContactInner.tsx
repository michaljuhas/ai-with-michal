"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import B2BLeadForm from "@/components/b2b/B2BLeadForm";
import { CONTACT_FORM_SERVICE_LABELS, getWorkTogetherServiceById } from "@/lib/work-together-services";

export default function ContactInner() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const matched = serviceId ? getWorkTogetherServiceById(serviceId) : undefined;
  const preselectedTitle = matched?.title;

  return (
    <main className="min-h-screen bg-slate-50 pt-20 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center mb-10"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Work together
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">Get in touch</h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Pricing for our offers is on the site. Share what you&apos;re looking for and we&apos;ll align
            on fit and next steps — then you can book a call.
          </p>
        </motion.div>

        <B2BLeadForm
          interestType="contact"
          availableServices={CONTACT_FORM_SERVICE_LABELS}
          preselectedService={preselectedTitle}
          thankYouPath="/contact/thank-you"
          heading="Tell us what you need"
          subheading="Select the services you care about (you can pick several). I’ll follow up within one business day."
          submitButtonLabel="Submit"
        />
      </div>
    </main>
  );
}
