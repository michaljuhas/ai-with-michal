import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";

// Cached for 60s — admin-only (order totals are sensitive)
export const revalidate = 60;

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdminUser(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const supabase = createServiceClient();
    let query = supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    if (slug) {
      query = query.eq("workshop_slug", slug);
    }

    const { count, error } = await query;

    if (error) throw error;

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
