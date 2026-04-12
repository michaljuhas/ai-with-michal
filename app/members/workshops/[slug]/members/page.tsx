import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { getWorkshopBySlug } from "@/lib/workshops";
import type { Registration } from "@/lib/supabase";
import CommunityDirectory from "@/components/members/CommunityDirectory";
import type { CommunityMember } from "@/components/members/CommunityDirectory";
import { ADMIN_USER_IDS, isAdminUser } from "@/lib/config";
import { listClerkUserIdsWithActiveAnnualMembership } from "@/lib/membership-access";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function WorkshopMembersPage({ params }: Props) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) notFound();

  const supabase = createServiceClient();

  // 1. All paid orders for this workshop → collect unique clerk_user_ids
  const { data: orders } = await supabase
    .from("orders")
    .select("clerk_user_id")
    .eq("workshop_slug", slug)
    .eq("status", "paid");

  const orderAttendeeIds = [
    ...new Set((orders ?? []).map((o: { clerk_user_id: string }) => o.clerk_user_id).filter(Boolean)),
  ];
  const annualMemberIds = await listClerkUserIdsWithActiveAnnualMembership(supabase);
  const attendeeIds = [...new Set([...orderAttendeeIds, ...annualMemberIds])];

  // Always include all admin IDs (host) — fetch their Clerk profile separately
  const allClerkIds = [...new Set([...ADMIN_USER_IDS, ...attendeeIds])];

  // 2. Fetch registration profile data for attendees
  const { data: registrations } = await supabase
    .from("registrations")
    .select("clerk_user_id, country, ai_level, function, linkedin_url")
    .in("clerk_user_id", attendeeIds.length > 0 ? attendeeIds : ["__none__"]);

  const profileMap = new Map<string, Pick<Registration, "country" | "ai_level" | "function" | "linkedin_url">>();
  for (const row of (registrations ?? []) as Pick<Registration, "clerk_user_id" | "country" | "ai_level" | "function" | "linkedin_url">[]) {
    profileMap.set(row.clerk_user_id, row);
  }

  // 3. Batch-fetch Clerk users for name + avatar (attendees + admin)
  const client = await clerkClient();
  const nameMap: Record<string, { name: string; imageUrl: string | null }> = {};
  try {
    const { data: clerkUsers } = await client.users.getUserList({
      userId: allClerkIds,
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
    // Degrade gracefully — show initials fallback
  }

  // 4. Build host card first, then attendees (skip deleted/missing Clerk accounts)
  const hostAdminId = ADMIN_USER_IDS.find((id) => nameMap[id]);
  const hostCard: CommunityMember | null = hostAdminId
    ? {
        clerkUserId: hostAdminId,
        name: nameMap[hostAdminId].name,
        imageUrl: nameMap[hostAdminId].imageUrl,
        country: "Slovakia",
        aiLevel: "ai_native",
        jobFunction: "recruiting_ta_hr",
        linkedinUrl: "https://www.linkedin.com/in/michaljuhas/",
        isHost: true,
      }
    : null;

  const attendeeCards: CommunityMember[] = attendeeIds
    .filter((id) => nameMap[id] && !isAdminUser(id))
    .map((id) => {
      const profile = profileMap.get(id);
      return {
        clerkUserId: id,
        name: nameMap[id].name,
        imageUrl: nameMap[id].imageUrl,
        country: profile?.country ?? null,
        aiLevel: (profile?.ai_level as CommunityMember["aiLevel"]) ?? null,
        jobFunction: (profile?.function as CommunityMember["jobFunction"]) ?? null,
        linkedinUrl: profile?.linkedin_url ?? null,
      };
    });

  const members: CommunityMember[] = [...(hostCard ? [hostCard] : []), ...attendeeCards];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Overview</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Members</h2>
        <p className="mt-1 text-sm text-slate-500">
          Everyone who joined {workshop.title}.
        </p>
      </div>
      <CommunityDirectory members={members} showFilters={false} />
    </div>
  );
}
