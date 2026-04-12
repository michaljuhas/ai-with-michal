import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnnualMembership } from "@/lib/supabase";

/** Course included with active annual membership (sales promise). */
export const ANNUAL_MEMBERSHIP_INCLUDED_COURSE_SLUG = "first-principles-sourcing" as const;

export async function getAnnualMembershipRow(
  supabase: SupabaseClient,
  userId: string
): Promise<AnnualMembership | null> {
  const { data, error } = await supabase
    .from("annual_memberships")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as AnnualMembership;
}

/** Active = now within [period_starts_at, period_ends_at] (inclusive bounds on timestamps). */
export async function userHasActiveAnnualMembership(
  supabase: SupabaseClient,
  userId: string,
  now: Date = new Date()
): Promise<boolean> {
  const row = await getAnnualMembershipRow(supabase, userId);
  if (!row) return false;
  const start = new Date(row.period_starts_at).getTime();
  const end = new Date(row.period_ends_at).getTime();
  const t = now.getTime();
  return t >= start && t <= end;
}

/** Same row as getAnnualMembershipRow; alias for billing copy. */
export async function getAnnualMembershipForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<AnnualMembership | null> {
  return getAnnualMembershipRow(supabase, userId);
}

export async function listClerkUserIdsWithActiveAnnualMembership(
  supabase: SupabaseClient,
  now: Date = new Date()
): Promise<string[]> {
  const iso = now.toISOString();
  const { data, error } = await supabase
    .from("annual_memberships")
    .select("clerk_user_id")
    .lte("period_starts_at", iso)
    .gte("period_ends_at", iso);

  if (error || !data) return [];
  return (data as { clerk_user_id: string }[]).map((r) => r.clerk_user_id);
}
