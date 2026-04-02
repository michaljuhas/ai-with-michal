import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * PATCH /api/registrations/interested-in
 *
 * Records which product the authenticated user is trying to purchase.
 * Always overwrites — captures latest intent.
 *
 * Body: { product: string }
 *   e.g. "workshop:2026-04-16-sourcing-automation"
 *        "mentoring:group"
 *        "mentoring:vip"
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let product: string | undefined;
  try {
    const body = await req.json();
    product = body.product;
  } catch {
    // ignore
  }

  if (!product || typeof product !== "string") {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("registrations")
    .update({ interested_in_product: product })
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("interested_in_product update error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Mirror to Clerk publicMetadata so it's available server-side on the user object
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: { interested_in_product: product },
    });
  } catch (clerkErr) {
    console.error("Failed to update Clerk publicMetadata:", clerkErr);
    // Non-fatal — Supabase is the source of truth
  }

  return NextResponse.json({ ok: true });
}
