import { clerkClient } from "@clerk/nextjs/server";

/** Batch-fetch Clerk profile image URLs for a list of user ids. */
export async function fetchClerkUserImageMap(
  userIds: string[]
): Promise<Map<string, string | null>> {
  const imageMap = new Map<string, string | null>();
  const unique = [...new Set(userIds)].filter(Boolean);
  if (unique.length === 0) return imageMap;

  try {
    const client = await clerkClient();
    const { data: clerkUsers } = await client.users.getUserList({
      userId: unique,
      limit: 200,
    });
    for (const u of clerkUsers) {
      imageMap.set(u.id, u.imageUrl ?? null);
    }
  } catch {
    // Gracefully degrade — avatars just won't show
  }

  return imageMap;
}
