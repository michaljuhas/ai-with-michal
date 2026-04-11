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
      className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-200 ${className}`}
    >
      Learn more
    </a>
  );
}
