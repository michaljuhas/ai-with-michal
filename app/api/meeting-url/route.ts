import { NextResponse } from "next/server";

export function GET() {
  const url = process.env.WORKSHOP_MEETING_URL ?? null;
  return NextResponse.json({ url });
}
