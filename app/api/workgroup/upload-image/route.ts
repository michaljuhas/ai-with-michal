import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { userHasProWorkshopOrder } from "@/lib/workshop-access";
import { getWorkshopBySlug } from "@/lib/workshops";
import type { NextRequest } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const BUCKET = "ai-with-michal-public";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const workshopSlugRaw = formData.get("workshop_slug");
  const workshopSlug =
    typeof workshopSlugRaw === "string" ? workshopSlugRaw.trim() : "";
  if (!workshopSlug) {
    return Response.json({ error: "workshop_slug is required" }, { status: 400 });
  }

  const workshop = getWorkshopBySlug(workshopSlug);
  if (!workshop) {
    return Response.json({ error: "Workshop not found" }, { status: 404 });
  }

  const supabase = createServiceClient();
  if (!isAdminUser(userId)) {
    const allowed = await userHasProWorkshopOrder(supabase, userId, workshopSlug);
    if (!allowed) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: "Only JPG and PNG images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json(
      { error: "File must be under 5 MB" },
      { status: 400 }
    );
  }

  const ext = file.type === "image/png" ? "png" : "jpg";
  const uuid = crypto.randomUUID();
  const path = `workgroup-posts/${userId}/${uuid}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[workgroup upload]", uploadError);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return Response.json({ url: publicUrlData.publicUrl }, { status: 201 });
}
