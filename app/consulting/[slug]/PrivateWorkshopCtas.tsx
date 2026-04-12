"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import posthog from "posthog-js";
import B2BLeadForm from "@/components/b2b/B2BLeadForm";
import { CONTACT_FORM_SERVICE_LABELS, getWorkTogetherServiceById } from "@/lib/work-together-services";

export default function PrivateWorkshopCtas({
  contactServiceId,
  pageSlug,
}: {
  contactServiceId: string;
  pageSlug: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const service = getWorkTogetherServiceById(contactServiceId);
  const title = service?.title || "Consulting sprint";

  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <p className="text-xs font-medium text-slate-500 leading-snug text-center mb-4">
              Step 1: send your details — Step 2: book a call on the next screen.
            </p>
            <button
              onClick={() => {
                setShowForm(true);
                posthog.capture("private_workshop_contact_clicked", {
                  slug: pageSlug,
                  service_id: contactServiceId,
                });
              }}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-blue-600/20"
            >
              Get in touch
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="pt-2"
          >
            <B2BLeadForm
              interestType="contact"
              availableServices={CONTACT_FORM_SERVICE_LABELS}
              preselectedService={title}
              heading="Request more info & pricing"
              subheading={`Tell me a bit about your team and I&apos;ll get back to you with a tailored proposal for ${title}.`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
