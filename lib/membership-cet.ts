/** Customer-facing date in Europe/Prague with CET label (AGENTS.md convention). */
export function formatDateCET(isoUtc: string): string {
  const d = new Date(isoUtc);
  return (
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Prague",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d) + " CET"
  );
}
