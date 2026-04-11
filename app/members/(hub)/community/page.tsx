import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";
import CommunityDirectory from "@/components/members/CommunityDirectory";
import type { CommunityMember } from "@/components/members/CommunityDirectory";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const { userId } = await auth();
  const supabase = createServiceClient();

  const { data: registrations } = await supabase
    .from("registrations")
    .select("clerk_user_id, country, ai_level, function, linkedin_url")
    .order("created_at", { ascending: false });

  const rows = (registrations ?? []) as Pick<
    Registration,
    "clerk_user_id" | "country" | "ai_level" | "function" | "linkedin_url"
  >[];

  const client = await clerkClient();
  const clerkUserIds = rows.map((r) => r.clerk_user_id).filter(Boolean);

  const nameMap: Record<string, { name: string; imageUrl: string | null }> = {};
  if (clerkUserIds.length > 0) {
    try {
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
      // Gracefully degrade
    }
  }

  const currentUserRow = rows.find((r) => r.clerk_user_id === userId);
  const profileIncomplete =
    !currentUserRow ||
    (!currentUserRow.country && !currentUserRow.ai_level && !currentUserRow.function && !currentUserRow.linkedin_url);

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
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Members
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-500">
          Meet the people learning and building alongside you.
        </p>
      </div>

      {profileIncomplete && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3.5">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p className="text-sm text-blue-700">
            Complete your profile to appear here and help like-minded professionals find you.{" "}
            <Link href="/profile" className="font-medium underline underline-offset-2 hover:text-blue-900 transition-colors">
              Update profile →
            </Link>
          </p>
        </div>
      )}

      <CommunityDirectory members={members} />
    </>
  );
}
