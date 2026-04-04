import Link from "next/link";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import type { Order, Registration } from "@/lib/supabase";
import RegistrationsTable from "./RegistrationsTable";
import WorkshopSelector from "./WorkshopSelector";
import CopyEmailButton from "./CopyEmailButton";
import { Suspense } from "react";
import { isAdminUser } from "@/lib/config";

const SPOTS_TARGET = 20;

/** Parse a date from a workshop slug like "2026-04-02-ai-in-recruiting" */
function slugToDate(slug: string): Date | null {
  const match = slug.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  return new Date(match[1]);
}

/** Human-readable label from slug, e.g. "Apr 2, 2026 – AI In Recruiting" */
function slugToLabel(slug: string): string {
  const date = slugToDate(slug);
  const datePart = date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : slug;
  const namePart = slug
    .replace(/^\d{4}-\d{2}-\d{2}-?/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return namePart ? `${datePart} – ${namePart}` : datePart;
}

/** Pick the closest workshop: nearest upcoming first, then most recent past */
function closestSlug(slugs: string[]): string {
  const now = new Date();
  const withDates = slugs
    .map((slug) => ({ slug, date: slugToDate(slug) }))
    .filter((x) => x.date !== null) as { slug: string; date: Date }[];

  const upcoming = withDates.filter((x) => x.date >= now).sort((a, b) => a.date.getTime() - b.date.getTime());
  if (upcoming.length > 0) return upcoming[0].slug;

  const past = withDates.sort((a, b) => b.date.getTime() - a.date.getTime());
  return past[0]?.slug ?? slugs[0];
}

function paidNetEur(o: Order): number {
  const n = o.amount_net_eur;
  if (n != null && Number.isFinite(n)) return n;
  return o.amount_eur;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ workshop?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  if (!isAdminUser(userId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Access denied.</p>
      </div>
    );
  }

  const supabase = createServiceClient();

  const [{ data: orders }, { data: registrations }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("registrations").select("*").order("created_at", { ascending: false }),
  ]);

  const allOrders = (orders as Order[] | null) ?? [];
  const allRegs = (registrations as Registration[] | null) ?? [];

  // Build workshop list from distinct slugs in orders
  const slugSet = new Set(allOrders.map((o) => o.workshop_slug).filter(Boolean) as string[]);
  const workshopSlugs = Array.from(slugSet).sort((a, b) => {
    const da = slugToDate(a);
    const db = slugToDate(b);
    if (!da || !db) return 0;
    return db.getTime() - da.getTime(); // newest first in dropdown
  });
  const workshops = workshopSlugs.map((slug) => ({ slug, label: slugToLabel(slug) }));

  // Resolve selected workshop from search params
  const params = await searchParams;
  const defaultSlug = workshopSlugs.length > 0 ? closestSlug(workshopSlugs) : "";
  const selectedSlug = (params.workshop && workshopSlugs.includes(params.workshop))
    ? params.workshop
    : defaultSlug;

  // Filter orders for the selected workshop
  const workshopOrders = selectedSlug
    ? allOrders.filter((o) => o.workshop_slug === selectedSlug)
    : allOrders;
  const paidOrders = workshopOrders.filter((o) => o.status === "paid");

  // Fetch Clerk user profiles for Full Name display
  const clerkUserIds = [...new Set(paidOrders.map((o) => o.clerk_user_id))];
  const nameByUserId: Record<string, string> = {};
  if (clerkUserIds.length > 0) {
    try {
      const clerk = await clerkClient();
      const clerkUsers = await clerk.users.getUserList({ userId: clerkUserIds, limit: 200 });
      for (const u of clerkUsers.data) {
        const full = [u.firstName, u.lastName].filter(Boolean).join(" ");
        nameByUserId[u.id] = full || u.emailAddresses[0]?.emailAddress || u.id;
      }
    } catch {
      // Fall back to email if Clerk lookup fails
    }
  }

  const emailByUserId: Record<string, string> = {};
  for (const r of allRegs) emailByUserId[r.clerk_user_id] = r.email;

  const revenueGross = paidOrders.reduce((sum, o) => sum + (o.amount_eur || 0), 0);
  const revenueNet = paidOrders.reduce((sum, o) => sum + paidNetEur(o), 0);
  const revenueSub =
    revenueGross !== revenueNet
      ? `${paidOrders.length} orders · €${revenueGross} incl. tax`
      : `${paidOrders.length} paid orders`;
  const basicCount = paidOrders.filter((o) => o.tier === "basic").length;
  const proCount = paidOrders.filter((o) => o.tier === "pro").length;
  const spotsLeft = SPOTS_TARGET - paidOrders.length;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <Link href="/admin/report" className="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2">
            Daily Report →
          </Link>
        </div>

        {/* Workshop selector */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-slate-500 text-sm">Workshop:</span>
          {workshops.length > 0 ? (
            <Suspense>
              <WorkshopSelector workshops={workshops} selectedSlug={selectedSlug} />
            </Suspense>
          ) : (
            <span className="text-slate-400 text-sm italic">No workshops found</span>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard label="Revenue (ex-VAT)" value={`€${revenueNet}`} sub={revenueSub} />
          <KpiCard
            label="Spots Filled"
            value={`${paidOrders.length}/${SPOTS_TARGET}`}
            sub={spotsLeft > 0 ? `${spotsLeft} remaining` : "Target reached!"}
            accent={paidOrders.length >= SPOTS_TARGET}
          />
          <KpiCard
            label="Basic / Pro"
            value={`${basicCount} / ${proCount}`}
            sub={proCount > 0 ? `${Math.round((proCount / paidOrders.length) * 100)}% pro` : "—"}
          />
          <KpiCard label="Signups" value={String(allRegs.length)} sub={`${paidOrders.length} converted`} />
        </div>

        {/* Paid Orders table */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Paid Orders ({paidOrders.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Full Name</th>
                  <th className="px-6 py-3 text-left">Country</th>
                  <th className="px-6 py-3 text-left">Tier</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Product</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      <span className="inline-flex items-center gap-0.5">
                        {nameByUserId[o.clerk_user_id] || emailByUserId[o.clerk_user_id] || "—"}
                        {emailByUserId[o.clerk_user_id] && (
                          <CopyEmailButton email={emailByUserId[o.clerk_user_id]} />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                      {o.billing_country_code ?? "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${o.tier === "pro" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                        {o.tier}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      €{o.amount_eur}
                      {o.amount_net_eur != null && o.amount_net_eur !== o.amount_eur ? (
                        <span className="text-slate-400 text-xs block">€{o.amount_net_eur} ex-VAT</span>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {o.workshop_slug ? slugToLabel(o.workshop_slug) : "—"}
                    </td>
                  </tr>
                ))}
                {paidOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No paid orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Registrations table */}
        <RegistrationsTable registrations={allRegs} orders={allOrders} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${accent ? "border-emerald-300 bg-emerald-50" : "border-slate-200"}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? "text-emerald-700" : "text-slate-900"}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
