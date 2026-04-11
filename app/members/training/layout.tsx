import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TrainingSidebar from "@/components/training/TrainingSidebar";
import { trainingSections } from "@/lib/training";

export default async function TrainingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Members Area
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Training
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Use this space to build the foundation before the live workshop, then
            come back for the join details and recording.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <TrainingSidebar sections={trainingSections} />
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
