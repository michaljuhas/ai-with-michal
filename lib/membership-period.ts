export type PreviousMembershipRow = {
  period_starts_at: string;
  period_ends_at: string;
};

/**
 * Compute membership window for upsert into `annual_memberships`.
 * - First purchase: [paymentTime, paymentTime + 1y)
 * - Renewal while still active (previous end >= payment): keep original start, end = previousEnd + 1y
 * - After lapse: fresh year from paymentTime
 */
export function computeMembershipWindow(params: {
  paymentTime: Date;
  previous: PreviousMembershipRow | null;
}): { period_starts_at: Date; period_ends_at: Date } {
  const { paymentTime, previous } = params;
  const paymentMs = paymentTime.getTime();

  if (!previous) {
    const start = new Date(paymentMs);
    const end = addOneUtcYear(start);
    return { period_starts_at: start, period_ends_at: end };
  }

  const prevEndMs = new Date(previous.period_ends_at).getTime();

  if (prevEndMs >= paymentMs) {
    const prevEnd = new Date(previous.period_ends_at);
    const newEnd = addOneUtcYear(prevEnd);
    return {
      period_starts_at: new Date(previous.period_starts_at),
      period_ends_at: newEnd,
    };
  }

  const start = new Date(paymentMs);
  const end = addOneUtcYear(start);
  return { period_starts_at: start, period_ends_at: end };
}

function addOneUtcYear(d: Date): Date {
  const out = new Date(d.getTime());
  out.setUTCFullYear(out.getUTCFullYear() + 1);
  return out;
}
