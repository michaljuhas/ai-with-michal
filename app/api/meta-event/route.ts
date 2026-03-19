import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { event_name, event_source_url } = body as {
    event_name: string;
    event_source_url: string;
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
    user_data: {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: clientIp,
      fbc: body.fbc ?? undefined,
      fbp: body.fbp ?? undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
