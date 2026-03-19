import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import type { Order, Registration } from "@/lib/supabase";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "michal@michaljuhas.com";
const CAPACITY = parseInt(process.env.WORKSHOP_CAPACITY || "50", 10);

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/register");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (email !== ADMIN_EMAIL) {
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

  const paidOrders = (orders as Order[] | null)?.filter((o) => o.status === "paid") ?? [];
  const allOrders = (orders as Order[] | null) ?? [];
  const allRegs = (registrations as Registration[] | null) ?? [];

  const revenue = paidOrders.reduce((sum, o) => sum + (o.amount_eur || 0), 0);
  const basicCount = paidOrders.filter((o) => o.tier === "basic").length;
  const proCount = paidOrders.filter((o) => o.tier === "pro").length;
  const spotsLeft = CAPACITY - paidOrders.length;

  const emailByUserId: Record<string, string> = {};
  for (const r of allRegs) emailByUserId[r.clerk_user_id] = r.email;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mb-8">Build AI-Powered Talent Pools · April 2, 2026</p>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <KpiCard label="Total Revenue" value={`€${revenue}`} sub={`${paidOrders.length} paid orders`} />
          <KpiCard label="Spots Filled" value={`${paidOrders.length}/${CAPACITY}`} sub={`${spotsLeft} remaining`} accent={spotsLeft <= 10} />
          <KpiCard label="Basic / Pro" value={`${basicCount} / ${proCount}`} sub={proCount > 0 ? `${Math.round((proCount / paidOrders.length) * 100)}% pro` : "—"} />
          <KpiCard label="Signups" value={String(allRegs.length)} sub={`${paidOrders.length} converted`} />
        </div>

        {/* Orders table */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Paid Orders ({paidOrders.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Tier</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-700">{emailByUserId[o.clerk_user_id] || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${o.tier === "pro" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                        {o.tier}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700">€{o.amount_eur}</td>
                    <td className="px-6 py-3 text-slate-500">{new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">{o.stripe_session_id.slice(0, 20)}…</td>
                  </tr>
                ))}
                {paidOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No paid orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Registrations table */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">All Registrations ({allRegs.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Paid</th>
                  <th className="px-6 py-3 text-left">Signed Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRegs.map((r) => {
                  const paid = allOrders.some((o) => o.clerk_user_id === r.clerk_user_id && o.status === "paid");
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-700">{r.email}</td>
                      <td className="px-6 py-3">
                        {paid ? (
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Paid</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-500">Registered</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  );
                })}
                {allRegs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">No registrations yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${accent ? "border-amber-300 bg-amber-50" : "border-slate-200"}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? "text-amber-700" : "text-slate-900"}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
