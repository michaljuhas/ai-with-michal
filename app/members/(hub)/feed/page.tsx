import { auth } from "@clerk/nextjs/server";
import FeedSection from "@/components/members/FeedSection";
import { isAdminUser } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function MemberFeedPage() {
  const { userId } = await auth();
  const isAdmin = isAdminUser(userId);

  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Feed
        </h1>
        <p className="mt-1.5 text-base leading-relaxed text-slate-500">
          Announcements and threads for the whole member community.
        </p>
      </div>

      <FeedSection isAdmin={isAdmin} />
    </>
  );
}
