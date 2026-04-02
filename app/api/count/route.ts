import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Cached for 60s — public endpoint, no auth needed
export const revalidate = 60;

export async function GET(req: NextRequest) {
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
