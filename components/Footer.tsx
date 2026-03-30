import Link from "next/link";
import { Mail } from "lucide-react";

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
          </div>

          {/* For Teams nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">
              For Teams
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ai-workshops-for-teams"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  AI Workshops for Teams
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-integrations"
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  AI Integrations
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
            </ul>
          </div>

          {/* Contact */}
          <a
            href="mailto:michal@michaljuhas.com"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm transition-colors"
          >
            <Mail size={15} />
            michal@michaljuhas.com
          </a>
        </div>
      </div>
    </footer>
  );
}
