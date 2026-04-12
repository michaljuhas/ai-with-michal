import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const anonymisedEmail = `deleted-${userId}@deleted.invalid`;

  try {
    // 1. Anonymise the registration row — keep analytics fields, wipe PII
    await supabase
      .from("registrations")
      .update({
        email: anonymisedEmail,
        linkedin_url: null,
      })
      .eq("clerk_user_id", userId);

    // 2. Anonymise any workgroup posts authored by this user
    await supabase
      .from("workgroup_posts")
      .update({
        author_email: "deleted@deleted.invalid",
        author_name: "Deleted Member",
      })
      .eq("clerk_user_id", userId);

    // 3. Anonymise any workgroup replies authored by this user
    await supabase
      .from("workgroup_replies")
      .update({
        author_email: "deleted@deleted.invalid",
        author_name: "Deleted Member",
      })
      .eq("clerk_user_id", userId);

    // 4. Anonymise member feed posts and replies authored by this user
    await supabase
      .from("member_feed_posts")
      .update({
        author_email: "deleted@deleted.invalid",
        author_name: "Deleted Member",
      })
      .eq("clerk_user_id", userId);

    await supabase
      .from("member_feed_replies")
      .update({
        author_email: "deleted@deleted.invalid",
        author_name: "Deleted Member",
      })
      .eq("clerk_user_id", userId);

    await supabase.from("member_resource_grants").delete().eq("clerk_user_id", userId);

    // 6. Delete the Clerk user — this invalidates all sessions and removes auth access.
    //    Orders keep the clerk_user_id for historical revenue tracking (no PII stored there).
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/account/delete]", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
