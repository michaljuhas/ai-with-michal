import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function MembersResourcesListPage() {
  const { userId } = await auth();
  const supabase = createServiceClient();
  const admin = isAdminUser(userId);

  const { data: all } = await supabase
    .from("member_resources")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  const rows = (all as MemberResource[] | null) ?? [];

  let visible: MemberResource[] = [];
  if (admin) {
    visible = rows.filter((r) => !r.is_archived);
  } else if (userId) {
    const { data: grants } = await supabase
      .from("member_resource_grants")
      .select("resource_id")
      .eq("clerk_user_id", userId);
    const grantSet = new Set((grants ?? []).map((g: { resource_id: string }) => g.resource_id));

    visible = rows.filter(
      (r) =>
        !r.is_archived &&
        (r.visibility === "public" || (r.visibility === "unlisted" && grantSet.has(r.id)))
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          My Resources
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-500">
          Lead magnets and bonus material — PDFs and videos available to members.
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">No resources yet</p>
          <p className="mt-2 text-sm text-slate-400">
            When new downloads or videos are published, they will show up here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 max-w-4xl">
          {visible.map((r) => (
            <li key={r.id}>
              <Link
                href={`/members/resources/${r.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {r.content_kind === "loom" ? "Video" : "PDF"}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{r.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{r.tagline}</p>
                {r.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{r.description}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Open
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
