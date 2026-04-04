export const SITE = {
  bookingLink: "https://calendar.app.google/J29ersE4HuZCsobA6",
} as const;

// Production admin + dev/localhost admin
export const ADMIN_USER_IDS = [
  "user_3BAd2lxThMRnjSjR2lBRTcLcXFp",
  "user_3B8UAjpcZykCuuNiih4vQKO8PcJ",
] as const;

export function isAdminUser(userId: string | null | undefined): boolean {
  return !!userId && (ADMIN_USER_IDS as readonly string[]).includes(userId);
}
