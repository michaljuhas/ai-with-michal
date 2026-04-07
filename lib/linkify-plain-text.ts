/**
 * Split plain text into alternating text and https? URLs (for safe linkification in UI).
 */
export type PlainTextPart =
  | { kind: "text"; value: string }
  | { kind: "url"; href: string };

const URL_SPLIT_RE = /(https?:\/\/[^\s<]+)/gi;

export function parsePlainTextUrls(text: string): PlainTextPart[] {
  const segments = text.split(URL_SPLIT_RE);
  const out: PlainTextPart[] = [];
  for (const segment of segments) {
    if (segment === "") continue;
    if (/^https?:\/\//i.test(segment)) {
      out.push({ kind: "url", href: segment });
    } else {
      out.push({ kind: "text", value: segment });
    }
  }
  return out;
}
