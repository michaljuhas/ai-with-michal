import { parsePlainTextUrls } from "@/lib/linkify-plain-text";

type LinkifiedPlainTextProps = {
  text: string;
  linkClassName?: string;
};

export default function LinkifiedPlainText({
  text,
  linkClassName = "text-blue-600 underline-offset-2 hover:underline break-words",
}: LinkifiedPlainTextProps) {
  const parts = parsePlainTextUrls(text);
  return (
    <>
      {parts.map((part, i) =>
        part.kind === "url" ? (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {part.href}
          </a>
        ) : (
          <span key={i}>{part.value}</span>
        )
      )}
    </>
  );
}
