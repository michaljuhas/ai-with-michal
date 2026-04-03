import { clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";
import CommunityDirectory from "@/components/members/CommunityDirectory";
import type { CommunityMember } from "@/components/members/CommunityDirectory";
import MembersNav from "@/components/members/MembersNav";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const supabase = createServiceClient();

  // Fetch all registrations with profile fields
  const { data: registrations } = await supabase
    .from("registrations")
    .select("clerk_user_id, country, ai_level, function, linkedin_url")
    .order("created_at", { ascending: false });

  const rows = (registrations ?? []) as Pick<
    Registration,
    "clerk_user_id" | "country" | "ai_level" | "function" | "linkedin_url"
  >[];

  // Batch-fetch Clerk users for name + avatar
  const client = await clerkClient();
  const clerkUserIds = rows.map((r) => r.clerk_user_id).filter(Boolean);

  let nameMap: Record<string, { name: string; imageUrl: string | null }> = {};
  if (clerkUserIds.length > 0) {
    try {
      // Clerk's getUserList accepts up to 100 userId filters at once
      const { data: clerkUsers } = await client.users.getUserList({
        userId: clerkUserIds,
        limit: 200,
      });

      for (const u of clerkUsers) {
        const name =
          [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
          u.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
          "Member";
        nameMap[u.id] = { name, imageUrl: u.imageUrl ?? null };
      }
    } catch {
      // Gracefully degrade — show initials from email if Clerk fetch fails
    }
  }

  // Merge into CommunityMember shape; skip rows with no Clerk data (deleted accounts)
  const members: CommunityMember[] = rows
    .filter((r) => nameMap[r.clerk_user_id])
    .map((r) => ({
      clerkUserId: r.clerk_user_id,
      name: nameMap[r.clerk_user_id].name,
      imageUrl: nameMap[r.clerk_user_id].imageUrl,
      country: r.country ?? null,
      aiLevel: (r.ai_level as CommunityMember["aiLevel"]) ?? null,
      jobFunction: (r.function as CommunityMember["jobFunction"]) ?? null,
      linkedinUrl: r.linkedin_url ?? null,
    }));

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Members Area
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Community
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-500">
            Meet the people learning and building alongside you.
          </p>
        </div>

        <MembersNav />

        <CommunityDirectory members={members} />
      </div>
    </main>
  );
}
