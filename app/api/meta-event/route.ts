import { NextRequest, NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/meta-capi";
import { getClientIp } from "@/lib/client-ip";
import {
  isAllowedMetaClientEventName,
  isAllowedMetaEventSourceUrl,
} from "@/lib/meta-event-server";

const MAX_BODY_BYTES = 12_000;

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event_name = body.event_name;
  const event_source_url = body.event_source_url;
  const event_id =
    typeof body.event_id === "string" ? body.event_id : undefined;

  if (
    !isAllowedMetaClientEventName(event_name) ||
    typeof event_source_url !== "string" ||
    !event_source_url
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  if (!isAllowedMetaEventSourceUrl(event_source_url)) {
    return NextResponse.json({ error: "Invalid event_source_url" }, { status: 400 });
  }

  await sendMetaEvent({
    event_name,
    event_source_url,
    event_id,
    user_data: {
      client_user_agent: req.headers.get("user-agent") ?? undefined,
      client_ip_address: getClientIp(req),
      fbc: typeof body.fbc === "string" ? body.fbc : undefined,
      fbp: typeof body.fbp === "string" ? body.fbp : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
