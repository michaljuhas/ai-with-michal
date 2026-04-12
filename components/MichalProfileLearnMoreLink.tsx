import { SITE } from "@/lib/config";

type Props = {
  className?: string;
};

export default function MichalProfileLearnMoreLink({ className = "" }: Props) {
  return (
    <a
      href={SITE.michalPersonalSiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 ${className}`}
    >
      Learn more
    </a>
  );
}
