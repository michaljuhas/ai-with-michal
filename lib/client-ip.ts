import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  const fromXff = xff?.split(",")[0]?.trim();
  return fromXff || req.headers.get("x-real-ip") || undefined;
}
