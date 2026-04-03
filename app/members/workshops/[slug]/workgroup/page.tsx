import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { getWorkshopBySlug } from "@/lib/workshops";
import WorkgroupSection from "@/components/workgroup/WorkgroupSection";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

type WorkgroupPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkgroupPage({ params }: WorkgroupPageProps) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  // Only Pro ticket holders (and admin) can access the workgroup
  const { userId } = await auth();
  let hasAccess = false;

  if (userId === ADMIN_USER_ID) {
    hasAccess = true;
  } else if (userId) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("clerk_user_id", userId)
      .eq("workshop_slug", workshop.slug)
      .eq("tier", "pro")
      .eq("status", "paid")
      .maybeSingle();
    hasAccess = !!data;
  }

  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Pro ticket required</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The workgroup discussion is available for Pro ticket holders. Upgrade your ticket to get access.
        </p>
      </div>
    );
  }

  return <WorkgroupSection workshopSlug={slug} />;
}
