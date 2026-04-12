import {
  getPrivateWorkshopBySlug,
  PRIVATE_WORKSHOP_SLUGS,
  type PrivateWorkshopRecord,
} from "@/lib/private-workshops";
import {
  CONSULTING_HANDS_ON_SLUGS,
  getConsultingHandsOnBySlug,
  type ConsultingHandsOnRecord,
} from "@/lib/consulting-hands-on";

export type ConsultingResolvedSprint = { kind: "sprint"; workshop: PrivateWorkshopRecord };
export type ConsultingResolvedHandsOn = { kind: "hands-on"; page: ConsultingHandsOnRecord };
export type ConsultingResolvedPage = ConsultingResolvedSprint | ConsultingResolvedHandsOn;

export function resolveConsultingPage(slug: string): ConsultingResolvedPage | undefined {
  const workshop = getPrivateWorkshopBySlug(slug);
  if (workshop) return { kind: "sprint", workshop };
  const page = getConsultingHandsOnBySlug(slug);
  if (page) return { kind: "hands-on", page };
  return undefined;
}

/** All `/consulting/[slug]` static paths (sprints + hands-on). */
export function getAllConsultingSlugParams(): { slug: string }[] {
  return [...PRIVATE_WORKSHOP_SLUGS, ...CONSULTING_HANDS_ON_SLUGS].map((slug) => ({ slug }));
}

export const ALL_CONSULTING_DETAIL_SLUGS: string[] = [
  ...PRIVATE_WORKSHOP_SLUGS,
  ...CONSULTING_HANDS_ON_SLUGS,
];
