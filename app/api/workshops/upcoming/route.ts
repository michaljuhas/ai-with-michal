import { NextResponse } from "next/server";
import { CANONICAL_SITE_ORIGIN } from "@/lib/config";
import { getUpcomingPublicWorkshops, getWorkshopBySlug } from "@/lib/workshops";

export const revalidate = 300;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
} as const;

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  const baseUrl = CANONICAL_SITE_ORIGIN;
  const thumbnailUrl = `${baseUrl}/workshop-og.jpeg`;

  const workshops = getUpcomingPublicWorkshops().map((w) => {
    const def = getWorkshopBySlug(w.slug);
    return {
      slug: w.slug,
      name: def?.title ?? w.title,
      hostName: "Michal Juhas",
      form: "Online",
      thumbnailUrl,
      date: w.displayDate,
      time: w.displayTime,
      url: `${baseUrl}/workshops/${w.slug}`,
    };
  });

  return NextResponse.json({ workshops }, { headers: CORS_HEADERS });
}
