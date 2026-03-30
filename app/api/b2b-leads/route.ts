import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { type TrackingParams, deriveAttribution } from "@/lib/tracking-params";
import { notifyAdminNewB2BLead } from "@/lib/email";

type B2BLeadInput = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  interest_type: "workshop" | "integration";
  services?: string[];
  message?: string;
  // Attribution — from localStorage via getStoredTrackingParams()
  tracking?: TrackingParams;
  referrer?: string;
  landing_page?: string;
};

export async function POST(req: NextRequest) {
  let body: B2BLeadInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, interest_type, company, role, services, message, tracking, referrer, landing_page } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "valid email is required" }, { status: 400 });
  }

  if (!interest_type || !["workshop", "integration"].includes(interest_type)) {
    return NextResponse.json({ error: "interest_type must be 'workshop' or 'integration'" }, { status: 400 });
  }

  const { source_type, source_detail } = deriveAttribution(tracking ?? {});

  const supabase = createServiceClient();
  const { error } = await supabase.from("b2b_leads").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || null,
    role: role?.trim() || null,
    interest_type,
    services: services && services.length > 0 ? services : null,
    message: message?.trim() || null,
    // Attribution
    utm_source: tracking?.utm_source ?? null,
    utm_medium: tracking?.utm_medium ?? null,
    utm_campaign: tracking?.utm_campaign ?? null,
    utm_content: tracking?.utm_content ?? null,
    utm_term: tracking?.utm_term ?? null,
    ref: tracking?.ref ?? null,
    source_type,
    source_detail,
    referrer: referrer ?? null,
    landing_page: landing_page ?? null,
  });

  if (error) {
    console.error("b2b_leads insert error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  // Fire-and-forget — email failure must not break the lead submission
  notifyAdminNewB2BLead({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    company: company?.trim() || null,
    role: role?.trim() || null,
    interest_type,
    services: services && services.length > 0 ? services : null,
    message: message?.trim() || null,
    source_type,
    source_detail,
    referrer: referrer ?? null,
    landing_page: landing_page ?? null,
  }).catch((err) => console.error("Admin email error:", err));

  return NextResponse.json({ ok: true });
}
