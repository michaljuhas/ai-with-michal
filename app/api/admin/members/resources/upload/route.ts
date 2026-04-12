import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/config";
import { MEMBER_RESOURCES_BUCKET } from "@/lib/member-resources";
import type { NextRequest } from "next/server";

const ALLOWED_TYPES = ["application/pdf"];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId || !isAdminUser(userId)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: "File must be under 50 MB" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const uuid = crypto.randomUUID();
  const path = `files/${uuid}.pdf`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(MEMBER_RESOURCES_BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("[admin member resource upload]", uploadError);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }

  return Response.json({ storage_path: path }, { status: 201 });
}
