import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { handleLinkPreviewRequest } from "@/lib/link-preview-handler";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handleLinkPreviewRequest(request);
}
