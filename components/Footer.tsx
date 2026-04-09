import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";
import { PUBLIC_WORKSHOPS } from "@/lib/workshops";

const now = new Date();
const nearestWorkshops = PUBLIC_WORKSHOPS.filter((w) => w.date >= now)
  .sort((a, b) => a.date.getTime() - b.date.getTime())
  .slice(0, 3);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="inline-block">
              <span className="text-slate-900 font-bold text-lg tracking-tight">
                AI{" "}
                <span className="text-blue-600">with</span>{" "}
                Michal
              </span>
            </Link>
            <p className="mt-1.5 text-slate-400 text-sm">
              © {new Date().getFullYear()} Juhas Digital Services s.r.o.
            </p>
            <a
              href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
              className="mt-1.5 inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm transition-colors"
            >
              <Mail size={15} className="shrink-0" aria-hidden />
              {PUBLIC_CONTACT_EMAIL}
            </a>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshops nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              <Link href="/workshops" className="hover:text-blue-600 transition-colors">
                Workshops
              </Link>
            </p>
            <ul className="space-y-2">
              {nearestWorkshops.map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/workshops/${w.slug}`}
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {w.displayDateShort} · {w.title.replace(" (90-min online workshop)", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mentoring nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Mentoring
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/individual-ai-mentoring"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Individual mentoring
                </Link>
              </li>
              <li>
                <Link
                  href="/group-ai-mentoring"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Group mentoring
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-mentoring/join"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Sign up / pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Teams nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              For Teams
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/work-together"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Work Together
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              Resources
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Free Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <a
                  href="https://michaljuhas.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Blog
                  <ExternalLink
                    size={14}
                    className="shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors"
                    aria-hidden
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
