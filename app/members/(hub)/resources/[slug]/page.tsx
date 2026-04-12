import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { MemberResource } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasResourceGrant, memberCanViewResource } from "@/lib/member-resources";
import { loomShareToEmbedUrl } from "@/lib/loom-embed";
import ResourceClaimClient from "@/components/members/ResourceClaimClient";
import LoomEmbed from "@/components/members/LoomEmbed";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export default async function MemberResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const clean = slug?.trim();
  if (!clean) notFound();

  const { userId } = await auth();
  const supabase = createServiceClient();
  const admin = isAdminUser(userId);

  const { data: resource, error } = await supabase
    .from("member_resources")
    .select("*")
    .eq("slug", clean)
    .maybeSingle();

  if (error || !resource) notFound();
  const r = resource as MemberResource;

  if (!admin && r.is_archived) notFound();

  const hasGrant = userId ? await userHasResourceGrant(supabase, userId, r.id) : false;
  const needsClaim = !!userId && !admin && r.visibility === "unlisted" && !hasGrant && !r.is_archived;
  const canView = admin || (!r.is_archived && memberCanViewResource(r, hasGrant));

  const embedUrl =
    canView && r.content_kind === "loom" && r.loom_url ? loomShareToEmbedUrl(r.loom_url) : null;

  const denied = !canView && !needsClaim;

  return (
    <>
      <div className="mb-6">
        <Link
          href="/members/resources"
          className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← My Resources
        </Link>
      </div>

      <ResourceClaimClient slug={clean} needsClaim={needsClaim} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{r.title}</h1>
        <p className="mt-2 text-lg text-slate-600">{r.tagline}</p>
      </header>

      {denied && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">You don&apos;t have access to this resource.</p>
          <p className="mt-2 text-sm text-slate-500">
            If you came from a lead page, make sure you&apos;re signed in with the same account.
          </p>
          <Link
            href="/members/resources"
            className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            Back to My Resources
          </Link>
        </div>
      )}

      {canView && (
        <div className="max-w-3xl space-y-8">
          {r.description && (
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
              {r.description}
            </div>
          )}

          {r.content_kind === "loom" && embedUrl && <LoomEmbed embedUrl={embedUrl} title={r.title} />}

          {r.content_kind === "loom" && !embedUrl && (
            <p className="text-sm text-red-600">This video link could not be loaded. Please contact support.</p>
          )}

          {r.content_kind === "file" && (
            <a
              href={`/api/members/resources/${encodeURIComponent(r.slug)}/download`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Download PDF
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          )}
        </div>
      )}
    </>
  );
}
