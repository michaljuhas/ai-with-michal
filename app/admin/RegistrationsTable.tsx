"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Registration, Order } from "@/lib/supabase";

type Props = {
  registrations: Registration[];
  orders: Order[];
};

const SOURCE_BADGE: Record<string, string> = {
  Paid: "bg-violet-100 text-violet-700",
  Referral: "bg-amber-100 text-amber-700",
  Organic: "bg-emerald-100 text-emerald-700",
};

function SourceBadge({ type }: { type: string | null | undefined }) {
  if (!type) return <span className="text-slate-300 text-xs">—</span>;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${SOURCE_BADGE[type] ?? "bg-slate-100 text-slate-600"}`}>
      {type}
    </span>
  );
}

function AttributionDetail({ reg }: { reg: Registration }) {
  const rows = [
    { label: "Source", value: reg.utm_source },
    { label: "Medium", value: reg.utm_medium },
    { label: "Campaign", value: reg.utm_campaign },
    { label: "Content", value: reg.utm_content },
    { label: "Term", value: reg.utm_term },
    { label: "Ref", value: reg.ref },
  ];
  const hasAny = rows.some((r) => r.value);

  if (!hasAny) {
    return (
      <td colSpan={6} className="px-6 pb-4 pt-0">
        <p className="text-xs text-slate-400 italic">No attribution data captured.</p>
      </td>
    );
  }

  return (
    <td colSpan={6} className="px-6 pb-4 pt-0">
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
            <p className="text-sm text-slate-700 font-medium truncate">{value || <span className="text-slate-300 font-normal">—</span>}</p>
          </div>
        ))}
        {reg.source_detail && (
          <div className="col-span-full border-t border-slate-200 mt-1 pt-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Derived detail</span>
            <p className="text-sm text-slate-700 font-medium">{reg.source_detail}</p>
          </div>
        )}
      </div>
    </td>
  );
}

export default function RegistrationsTable({ registrations, orders }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const paidSet = new Set(
    orders.filter((o) => o.status === "paid").map((o) => o.clerk_user_id)
  );

  function toggle(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">All Registrations ({registrations.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Source</th>
              <th className="px-6 py-3 text-left">Paid</th>
              <th className="px-6 py-3 text-left">Interested in product</th>
              <th className="px-6 py-3 text-left w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.map((r) => {
              const paid = paidSet.has(r.clerk_user_id);
              const isOpen = expanded === r.id;
              const hasAttribution = !!(r.source_type || r.utm_source || r.ref);

              return (
                <Fragment key={r.id}>
                  <tr
                    className={`hover:bg-slate-50 cursor-pointer select-none ${isOpen ? "bg-slate-50" : ""}`}
                    onClick={() => toggle(r.id)}
                  >
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{r.email}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <SourceBadge type={r.source_type} />
                        {r.source_detail && (
                          <span className="text-xs text-slate-400 truncate max-w-[120px]">{r.source_detail}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {paid ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Paid</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500">Registered</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-xs">
                      {r.interested_in_product || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-3 text-slate-300">
                      {hasAttribution && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-slate-500" : ""}`}
                        />
                      )}
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="bg-slate-50">
                      <AttributionDetail reg={r} />
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No registrations yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
