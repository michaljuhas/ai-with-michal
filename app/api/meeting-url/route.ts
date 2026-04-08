import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasPaidWorkshopOrder } from "@/lib/workshop-access";
import { getWorkshopBySlug } from "@/lib/workshops";
import { getStripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workshopSlug = req.nextUrl.searchParams.get("workshopSlug")?.trim();
  if (!workshopSlug) {
    return NextResponse.json(
      { error: "workshopSlug query parameter is required" },
      { status: 400 }
    );
  }

  if (!getWorkshopBySlug(workshopSlug)) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
  }

  const stripeSessionId = req.nextUrl.searchParams.get("session_id")?.trim();

  let allowed = isAdminUser(userId);

  if (!allowed && stripeSessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(stripeSessionId);
      const meta = session.metadata ?? {};
      const paid =
        session.payment_status === "paid" &&
        meta.clerk_user_id === userId &&
        meta.workshop_slug === workshopSlug;
      if (paid) allowed = true;
    } catch {
      /* invalid session id */
    }
  }

  if (!allowed) {
    const supabase = createServiceClient();
    const paid = await userHasPaidWorkshopOrder(supabase, userId, workshopSlug);
    if (!paid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const url = process.env.WORKSHOP_MEETING_URL ?? null;
  return NextResponse.json({ url });
}
