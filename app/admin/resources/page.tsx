import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import AdminResourcesClient from "./AdminResourcesClient";

export default async function AdminResourcesPage() {
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
  const { data } = await supabase
    .from("member_resources")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  const resources = (data as MemberResource[] | null) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-blue-600">
              ← Admin home
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Member resources</h1>
            <p className="mt-1 text-sm text-slate-500">
              Lead magnets (PDF + Loom). Lead pages: redirect sign-up to{" "}
              <code className="text-xs bg-slate-100 px-1 rounded">/members/resources/[slug]</code>.
            </p>
          </div>
        </div>

        <AdminResourcesClient initialResources={resources} />
      </div>
    </div>
  );
}
