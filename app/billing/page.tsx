import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStripe, findCustomerByClerkId } from "@/lib/stripe";
import type Stripe from "stripe";
import { Calendar, FileText, Download, ExternalLink, Receipt } from "lucide-react";
import { createServiceClient } from "@/lib/supabase";
import { getAnnualMembershipForUser, userHasActiveAnnualMembership } from "@/lib/membership-access";
import { formatDateCET } from "@/lib/membership-cet";

export const metadata = { title: "Billing – AI with Michal" };

interface Payment {
  id: string;
  created: number;
  amount: number;
  currency: string;
  description: string | null;
  receipt_url: string | null;
  invoice_number: string | null;
  invoice_pdf: string | null;
  hosted_invoice_url: string | null;
  metadata: Record<string, string>;
}

function formatAmount(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

function formatDate(unixSeconds: number) {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function paymentDescription(p: Payment): string {
  if (p.description) return p.description;
  if (p.metadata?.product === "annual_membership") return "Annual membership";
  const tier = p.metadata?.tier;
  const slug = p.metadata?.workshop_slug;
  if (tier === "pro") return "Workshop + Toolkit";
  if (tier === "basic") return "Workshop Ticket";
  if (slug) return slug;
  return "Payment";
}

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  let payments: Payment[] = [];

  const customerId = await findCustomerByClerkId(userId);

  if (customerId) {
    const stripe = getStripe();
    const result = await stripe.charges.list({
      customer: customerId,
      limit: 50,
      expand: ["data.invoice"],
    });

    payments = result.data
      .filter((ch) => ch.status === "succeeded")
      .map((ch) => {
        const inv = ch.invoice as Stripe.Invoice | null;
        return {
          id: ch.id,
          created: ch.created,
          amount: ch.amount,
          currency: ch.currency,
          description: ch.description ?? null,
          receipt_url: ch.receipt_url ?? null,
          invoice_number: inv?.number ?? null,
          invoice_pdf: inv?.invoice_pdf ?? null,
          hosted_invoice_url: inv?.hosted_invoice_url ?? null,
          metadata: (ch.metadata as Record<string, string>) ?? {},
        };
      });
  }

  const supabase = createServiceClient();
  const membershipRow = await getAnnualMembershipForUser(supabase, userId);
  const membershipActive = membershipRow
    ? await userHasActiveAnnualMembership(supabase, userId)
    : false;

  return (
    <main className="min-h-screen bg-slate-50 pt-16 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your payment history, invoices, and annual membership term.
          </p>
        </div>

        {membershipRow ? (
          <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Calendar size={20} aria-hidden />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Annual membership</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Valid from</span>{" "}
                    {formatDateCET(membershipRow.period_starts_at)}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Through</span>{" "}
                    {formatDateCET(membershipRow.period_ends_at)}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  membershipActive
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {membershipActive ? "Active" : "Ended"}
              </span>
            </div>
            {!membershipActive ? (
              <p className="mt-4 text-sm text-slate-500">
                Renew for another year:{" "}
                <Link href="/membership" className="font-semibold text-blue-600 hover:text-blue-800">
                  AI Recruiting Systems membership
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-5 text-sm text-slate-600">
            No annual membership on file.{" "}
            <Link href="/membership" className="font-semibold text-blue-600 hover:text-blue-800">
              Explore membership
            </Link>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                <FileText size={22} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No payments yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Your payment history will appear here after your first purchase.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Documents
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(p.created)}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="block truncate max-w-sm">
                          {paymentDescription(p)}
                        </span>
                        {p.invoice_number && (
                          <span className="mt-0.5 block font-mono text-xs text-slate-400">
                            {p.invoice_number}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900">
                        {formatAmount(p.amount, p.currency)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.invoice_pdf ? (
                            <a
                              href={p.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <Download size={13} />
                              Invoice PDF
                            </a>
                          ) : p.hosted_invoice_url ? (
                            <a
                              href={p.hosted_invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <ExternalLink size={13} />
                              Invoice
                            </a>
                          ) : p.receipt_url ? (
                            <a
                              href={p.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              <Receipt size={13} />
                              Receipt
                            </a>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
