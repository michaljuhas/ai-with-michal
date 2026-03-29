import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

type ProfileUpdate = {
  ai_level?: string | null;
  function?: string | null;
  country?: string | null;
  linkedin_url?: string | null;
};

const VALID_AI_LEVELS = ["offline", "chatting", "systemizing", "automating", "ai_native"] as const;
const VALID_FUNCTIONS = ["recruiting_ta_hr", "gtm", "business_ops", "builder_founder"] as const;

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("registrations")
    .select("ai_level, function, country, linkedin_url")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProfileUpdate = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.ai_level !== undefined && body.ai_level !== null) {
    if (!VALID_AI_LEVELS.includes(body.ai_level as (typeof VALID_AI_LEVELS)[number])) {
      return NextResponse.json({ error: "Invalid ai_level" }, { status: 400 });
    }
  }

  if (body.function !== undefined && body.function !== null) {
    if (!VALID_FUNCTIONS.includes(body.function as (typeof VALID_FUNCTIONS)[number])) {
      return NextResponse.json({ error: "Invalid function" }, { status: 400 });
    }
  }

  const profileFields: ProfileUpdate = {};
  if ("ai_level" in body) profileFields.ai_level = body.ai_level ?? null;
  if ("function" in body) profileFields.function = body.function ?? null;
  if ("country" in body) profileFields.country = body.country ?? null;
  if ("linkedin_url" in body) profileFields.linkedin_url = body.linkedin_url ?? null;

  // Fetch email from Clerk so we can upsert (create the row if it doesn't exist yet)
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    return NextResponse.json({ error: "User email not found" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("registrations")
    .upsert(
      { clerk_user_id: userId, email, ...profileFields },
      { onConflict: "clerk_user_id" }
    );

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
