import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ReportClient from "./ReportClient";

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";

export default async function AdminReportPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  if (userId !== ADMIN_USER_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Access denied.</p>
      </div>
    );
  }

  return <ReportClient />;
}
