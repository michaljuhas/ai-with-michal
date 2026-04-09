import { CANONICAL_SITE_ORIGIN, PUBLIC_CONTACT_EMAIL } from "./config";

/** Customer-facing product / site name used in legal copy. */
export const LEGAL_SITE_NAME = "AI with Michal" as const;

/** Registered company (data controller for GDPR purposes). */
export const LEGAL_ENTITY_NAME = "Juhas Digital Services s.r.o." as const;

export const LEGAL_ENTITY_ADDRESS_STREET = "Sukennicka 1" as const;
export const LEGAL_ENTITY_ADDRESS_CITY = "Bratislava 82109, Slovakia" as const;

/** ISO date string shown on legal pages (“Last updated”). */
export const LEGAL_LAST_UPDATED = "2026-04-08" as const;

export function getLegalContactMailto(): string {
  return `mailto:${PUBLIC_CONTACT_EMAIL}`;
}

export { CANONICAL_SITE_ORIGIN, PUBLIC_CONTACT_EMAIL };
