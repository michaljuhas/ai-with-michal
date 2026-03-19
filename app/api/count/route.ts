import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Cached for 60s — public endpoint, no auth needed
export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "paid");

    if (error) throw error;

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
