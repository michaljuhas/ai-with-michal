import JoinAfterWorkshopBullets from "@/components/training/JoinAfterWorkshopBullets";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";

/**
 * Renders the bottom sections of the Join lesson in one tree so MDX does not
 * wrap block JSX in implicit <p> (invalid HTML: p > ul, p > p).
 */
export default function JoinLessonFooter() {
  return (
    <div className="join-lesson-footer">
      <h2>After the workshop</h2>
      <JoinAfterWorkshopBullets />
      <h2>If you cannot attend live</h2>
      <div className="my-5 text-[15px] leading-7 text-slate-700">
        Let us know via email at{" "}
        <a
          href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
          className="inline font-medium text-blue-600 underline underline-offset-4"
        >
          {PUBLIC_CONTACT_EMAIL}
        </a>{" "}
        that you could not join live and we&apos;ll register you for the next
        workshop (same topic) with no additional charge.
      </div>
    </div>
  );
}
