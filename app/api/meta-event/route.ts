import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event_name, event_source_url, event_id } = body as {
    event_name: string;
    event_source_url: string;
    event_id?: string;
  };

  if (!event_name || !event_source_url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    undefined;

  await sendMetaEvent({
    event_name,
    event_source_url,
    event_id,
    user_data: {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: clientIp,
      fbc: body.fbc ?? undefined,
      fbp: body.fbp ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
