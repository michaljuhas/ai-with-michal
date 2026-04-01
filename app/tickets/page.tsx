import { redirect } from "next/navigation";
import { CURRENT_WORKSHOP_SLUG } from "@/lib/workshops";

export default function TicketsRedirect() {
  redirect(`/workshops/${CURRENT_WORKSHOP_SLUG}/tickets`);
}
