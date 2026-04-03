import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";
import PersonalInfoForm from "./PersonalInfoForm";
import AIPreferencesForm from "./AIPreferencesForm";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

export const metadata = { title: "Profile – AI with Michal" };

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("registrations")
    .select("ai_level, function, country, linkedin_url")
    .eq("clerk_user_id", userId)
    .maybeSingle<Pick<Registration, "ai_level" | "function" | "country" | "linkedin_url">>();

  return (
    <main className="min-h-screen bg-slate-50 pt-16 pb-16">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal details and AI preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left column: personal info + danger zone */}
          <div className="space-y-4">
            <PersonalInfoForm linkedinUrl={data?.linkedin_url ?? null} />
            <div className="flex justify-start px-1">
              <DeleteAccountButton />
            </div>
          </div>

          {/* Right column: AI preferences */}
          <AIPreferencesForm
            aiLevel={data?.ai_level ?? null}
            userFunction={data?.function ?? null}
            country={data?.country ?? null}
          />
        </div>
      </div>
    </main>
  );
}
