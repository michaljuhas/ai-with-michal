import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ReportClient from "./ReportClient";
import { isAdminUser } from "@/lib/config";

export default async function AdminReportPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  if (!isAdminUser(userId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Access denied.</p>
      </div>
    );
  }

  return <ReportClient />;
}
