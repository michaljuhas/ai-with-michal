import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { type TrackingParams, deriveAttribution } from "@/lib/tracking-params";

/**
 * PATCH /api/registrations/attribution
 *
 * Called client-side (from /tickets) after the user is authenticated.
 * Writes UTM + referral attribution to the registrations row — only if
 * source_type is not already set (idempotent, first-touch wins).
 *
 * Body: TrackingParams (utm_source, utm_medium, utm_campaign, utm_content,
 *                       utm_term, ref) — all optional.
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TrackingParams = {};
  try {
    body = await req.json();
  } catch {
    // Empty or malformed body — still valid, will store nulls
  }

  const { source_type, source_detail } = deriveAttribution(body);

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("registrations")
    .update({
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_content: body.utm_content ?? null,
      utm_term: body.utm_term ?? null,
      ref: body.ref ?? null,
      source_type,
      source_detail,
    })
    .eq("clerk_user_id", userId)
    .is("source_type", null); // Only update if not already attributed

  if (error) {
    console.error("Attribution update error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
