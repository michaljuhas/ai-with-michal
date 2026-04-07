import { Suspense } from "react";
import ContactInner from "./ContactInner";

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-6">
          <p className="text-center text-slate-500 text-sm">Loading…</p>
        </main>
      }
    >
      <ContactInner />
    </Suspense>
  );
}
