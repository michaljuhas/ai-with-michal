import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, BookOpen, Clock, MessageSquare } from "lucide-react";
import { getCourseBySlug, getPublishedCourses } from "@/lib/courses";
import { CANONICAL_SITE_ORIGIN } from "@/lib/config";
import MichalProfileLearnMoreLink from "@/components/MichalProfileLearnMoreLink";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !course.published) return { title: "Training | AI with Michal" };

  const url = `${CANONICAL_SITE_ORIGIN}/training/${slug}`;
  return {
    title: `${course.title} | Training | AI with Michal`,
    description: course.description,
    alternates: { canonical: url },
    robots: { index: false, follow: false },
    openGraph: {
      title: course.title,
      description: course.description,
      url,
      siteName: "AI with Michal",
      type: "website",
      images: [{ url: "/workshop-og.jpeg", width: 2048, height: 1152, alt: course.title }],
    },
  };
}

export default async function CourseSalesPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || !course.published) notFound();

  const ticketsUrl = `/training/${slug}/tickets`;

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
            Training
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-blue-200 leading-relaxed mb-8 max-w-2xl mx-auto">
            {course.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-300 mb-10">
            {course.sessionsIncluded && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {course.sessionsIncluded}× {course.sessionDurationMinutes}-min 1-on-1 calls
              </span>
            )}
            {course.sections && (
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} />
                {course.sections.length}-week program
              </span>
            )}
            {course.hasWorkgroup && (
              <span className="flex items-center gap-1.5">
                <MessageSquare size={15} />
                Private workgroup
              </span>
            )}
          </div>
          <Link
            href={ticketsUrl}
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            Enroll now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-16 space-y-16">
        {/* The uncomfortable truth / hook */}
        <section className="space-y-5">
          <p className="text-xl font-semibold text-slate-900">It&apos;s 2026.</p>
          <p className="text-slate-600 leading-relaxed">
            Everyone is talking about AI sourcing tools, automation, prompt engineering.
            &ldquo;AI will replace recruiters.&rdquo;
          </p>
          <p className="text-slate-600 leading-relaxed">
            And yet — recruiters are still failing sourcing interviews.
          </p>
          <p className="text-slate-600 leading-relaxed">
            I see it all the time. They submit an assignment. They feel confident.{" "}
            <em>&ldquo;This is strong.&rdquo;</em>{' '} Then they get rejected. <b>And they
            don&apos;t know why.</b>
          </p>
        </section>

        {/* The uncomfortable truth */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
          <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">
            The uncomfortable truth
          </p>
          <p className="text-lg font-semibold">AI didn&apos;t fix sourcing. It exposed who actually understands it.</p>
          <p className="text-slate-300 leading-relaxed">
            Because if you don&apos;t understand first principles:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
              AI gives you <strong className="text-white">better-looking bad results</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
              Your searches are still flawed
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
              Your candidate selection is still weak
            </li>
          </ul>
          <p className="text-slate-400 text-sm pt-2">
            Hiring teams see through it instantly.
          </p>
        </section>

        {/* What's happening right now */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              What&apos;s happening right now
            </h2>
            <p className="text-slate-500 mt-2">
              There are now two types of recruiters and most people miss which one they are.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-slate-100 rounded-2xl p-6 space-y-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Tool-driven recruiters
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">—</span>Rely on AI outputs
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">—</span>Copy prompts, generate lists
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">—</span>Look productive
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">—</span>Don&apos;t understand what they&apos;re doing
                </li>
              </ul>
              <p className="text-sm text-slate-500 italic">They plateau fast.</p>
            </div>
            <div className="bg-blue-600 text-white rounded-2xl p-6 space-y-4">
              <p className="text-sm font-bold text-blue-200 uppercase tracking-wider">
                Principle-driven (top 1%)
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-blue-300">→</span>Understand how sourcing actually works
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-blue-300">→</span>Use AI as leverage, not a crutch
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-blue-300">→</span>Think in systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-blue-300">→</span>Get better roles, pass interviews easily
                </li>
              </ul>
              <p className="text-sm text-blue-200 italic font-medium">
                These people are killing it right now.
              </p>
            </div>
          </div>
        </section>

        {/* Why this matters now */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Why this matters now</h2>
          <p className="text-slate-600 leading-relaxed">
            AI is not the advantage anymore. <strong>Understanding is.</strong>
          </p>
          <p className="text-slate-600 leading-relaxed">
            Anyone can generate a Boolean string, a list of candidates, a sourcing message.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Very few can <strong>judge quality</strong>, identify real talent, or adapt
            when the search fails. That&apos;s what companies actually pay for, and in 2026,
            that gap is getting bigger, fast.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mt-2">
            <p className="text-slate-700 text-sm leading-relaxed">
              <strong className="text-blue-700">This training moves you into the second group.</strong>{" "}
              If you get it right: you combine first principles with AI, you become extremely
              hard to replace, and you access better opportunities — because companies are
              actively looking for recruiters who can actually think.
            </p>
          </div>
        </section>

        {/* First Principles */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              The First-Level Principles of Modern Sourcing
            </h2>
            <p className="text-slate-500 mt-2 leading-relaxed">
              What top 1% recruiters understand (and most don&apos;t). These are the
              mental models the training is built on. Each principle is simple. Most
              recruiters violate all of them.
            </p>
          </div>
          <div className="space-y-2">
            {[
              {
                title: "The Set Theory Principle",
                sub: "Sourcing is not keywords. It&apos;s sets.",
                body: (
                  <>
                    <p>Most recruiters type keywords and hope. Top recruiters define sets of candidates and combine them deliberately.</p>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li><strong>AND</strong> = intersection</li>
                      <li><strong>OR</strong> = expansion</li>
                      <li><strong>NOT</strong> = exclusion</li>
                    </ul>
                    <p className="mt-3 font-medium text-slate-800">If you don&apos;t think in sets, your searches are random.</p>
                  </>
                ),
              },
              {
                title: "The Signal vs Noise Principle",
                sub: "Keywords don&apos;t matter. Evidence does.",
                body: (
                  <>
                    <p>Most recruiters match keywords. Top recruiters look for proof of real capability.</p>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li><span className="text-red-500 font-medium">&ldquo;Python&rdquo;</span> = noise</li>
                      <li><span className="text-green-600 font-medium">&ldquo;Built a real-time system processing X events&rdquo;</span> = signal</li>
                    </ul>
                    <p className="mt-3 font-medium text-slate-800">If you can&apos;t separate signal from noise, you pick the wrong people.</p>
                  </>
                ),
              },
              {
                title: "The Proxy Principle",
                sub: "You never search directly for the thing.",
                body: (
                  <>
                    <p>You don&apos;t search for &ldquo;great engineer&rdquo;. You search for environments that produce great engineers — companies, tech stacks, domains.</p>
                    <p className="mt-3 font-medium text-slate-800">If you search directly, you miss the best candidates.</p>
                  </>
                ),
              },
              {
                title: "The Distribution Principle",
                sub: "Talent is not evenly spread.",
                body: (
                  <>
                    <p>Most recruiters search broadly. Top recruiters know where talent clusters — specific companies, specific regions, specific ecosystems.</p>
                    <p className="mt-3 font-medium text-slate-800">Where you search matters more than how you search.</p>
                  </>
                ),
              },
              {
                title: "The Iteration Loop Principle",
                sub: "Sourcing is not a search. It&apos;s a loop.",
                body: (
                  <>
                    <p>Most recruiters run one search and stop. Top recruiters search → analyze → refine → repeat.</p>
                    <p className="mt-3 font-medium text-slate-800">If your search doesn&apos;t evolve, it stays weak.</p>
                  </>
                ),
              },
              {
                title: "The Representation Principle",
                sub: "Profiles are not reality.",
                body: (
                  <>
                    <p>Profiles are incomplete, biased, and optimized for visibility. Top recruiters interpret — they don&apos;t just match.</p>
                    <p className="mt-3 font-medium text-slate-800">Absence of a keyword ≠ absence of skill.</p>
                  </>
                ),
              },
              {
                title: "The Tool Abstraction Principle",
                sub: "Tools don&apos;t matter. Models do.",
                body: (
                  <>
                    <p>Most recruiters depend on tools. Top recruiters understand the system behind them.</p>
                    <p className="mt-3 font-medium text-slate-800">If LinkedIn disappeared tomorrow, could you still source?</p>
                  </>
                ),
              },
              {
                title: "The AI Amplification Principle",
                sub: "AI doesn&apos;t fix bad sourcing — it scales it.",
                body: (
                  <>
                    <p>AI can generate searches and suggest candidates. But it cannot define the right problem or judge real quality.</p>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li><span className="text-red-500 font-medium">Weak thinking + AI</span> = faster mistakes</li>
                      <li><span className="text-green-600 font-medium">Strong thinking + AI</span> = massive leverage</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "The Conversion Principle",
                sub: "Finding candidates is only half the game.",
                body: (
                  <>
                    <p>Most recruiters optimize for number of profiles. Top recruiters optimize for response and engagement.</p>
                    <p className="mt-3 font-medium text-slate-800">A perfect list with no replies is still failure.</p>
                  </>
                ),
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-200 bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer items-start gap-4 px-6 py-5 list-none [&::-webkit-details-marker]:hidden">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p
                      className="text-sm text-slate-500 mt-0.5"
                      dangerouslySetInnerHTML={{ __html: item.sub }}
                    />
                  </div>
                  <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform shrink-0 mt-1">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-sm text-slate-600 leading-relaxed space-y-2 border-t border-slate-100 mt-0 ml-11">
                  <div className="pt-4">{item.body}</div>
                </div>
              </details>
            ))}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-5">
            <p className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2">
              If you skip the first principles, AI won&apos;t save you
            </p>
            <p className="text-slate-700 leading-relaxed text-sm">
              Every AI tool, every prompt library, every automation shortcut... they all
              assume you already understand the fundamentals. If you don&apos;t, learning
              more AI won&apos;t move you into the top tier. It will just make your
              mistakes faster and harder to spot. The recruiters who reach the top 1%
              don&apos;t get there because they use better tools. They get there because
              they know the core principles cold and then use AI on top of that.
            </p>
          </div>
        </section>

        {/* Curriculum */}
        {course.sections && course.sections.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What you&apos;ll learn (and actually practice) with Michal
            </h2>
            <div className="space-y-4">
              {course.sections.map((section, i) => (
                <div
                  key={section.key}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.slug} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                        {lesson.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href={ticketsUrl}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-md"
              >
                Enroll now
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}

        {/* What you get */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What you get</h2>
          <div className="space-y-4">
            {course.ticketOptions[0].includes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
            {course.hasWorkgroup && (
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-slate-700">Private workgroup — upload assignments, get direct feedback, see how others think</p>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Pricing</h2>
          <div className="space-y-5">

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl font-extrabold text-slate-900">€490</span>
                <span className="font-semibold text-slate-700">— Training</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-3">
                The full program. You get the 3-week curriculum, two 30-minute 1-on-1 calls
                with me where we focus on your specific gaps, and access to the private
                workgroup where you can upload your work and get direct feedback.
              </p>
              <p className="text-sm text-slate-500">
                Most people start here. It&apos;s enough to build a solid foundation and
                significantly improve your sourcing thinking.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-2xl font-extrabold text-slate-900">€690</span>
                <span className="font-semibold text-slate-700">— Training + Interview Prep</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-3">
                Everything in Training, plus one extra thing: you get a real sourcing
                assignment from a high-tech company — the kind that gets sent to candidates
                in actual hiring processes. You complete it, submit it, and I give you honest
                1-on-1 feedback on exactly what you did well, what you missed, and whether
                you would have passed.
              </p>
              <p className="text-sm text-slate-500">
                If you&apos;re actively preparing for interviews or want to know exactly
                where you stand, this is the one to get.
              </p>
            </div>

          </div>
        </section>

        {/* Who it's for */}
        <section className="grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Who this is for</h2>
            <ul className="space-y-2">
              {[
                "Recruiters failing sourcing interviews",
                "Recruiters overwhelmed by AI tools but not improving",
                "Recruiters who want to reach top-tier performance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Who this is NOT for</h2>
            <ul className="space-y-2">
              {[
                "People looking for shortcuts",
                "People who want prompts instead of thinking",
                "People avoiding honest feedback",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-500 line-through">
                  <span className="mt-0.5 text-slate-300">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why trust Michal */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/Michal-Juhas-headshot-square-v1.jpg"
              alt="Michal Juhas"
              width={56}
              height={56}
              className="rounded-full object-cover ring-2 ring-slate-100 shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Why trust me</h2>
              <p className="text-sm text-slate-500">Michal Juhas</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            Most people teaching sourcing today learned it <em>after</em> AI tools appeared.
            I didn&apos;t. I built my sourcing skills before ChatGPT — when if your thinking
            was wrong, you simply failed.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">→</span>
              <span>Trained thousands of recruiters through webinars and courses at the{" "}
              <a href="https://techrecruitmentacademy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Tech Recruitment Academy</a></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">→</span>
              Reviewed hundreds of sourcing assignments — real hiring decisions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">→</span>
              Recently interviewed recruiters for a trading company with an extremely high bar
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold shrink-0">→</span>
              <span><a href="https://michaljuhas.com/training#past" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">100+ sourcing webinars organized</a>{" "}before ChatGPT existed</span>
            </li>
          </ul>
          <MichalProfileLearnMoreLink className="mt-6" />
        </section>

        {/* Honest warning */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-sm font-bold text-amber-700 uppercase tracking-wide mb-2">
            ⚠️ Brutal honesty upfront
          </p>
          <p className="text-slate-700 leading-relaxed">
            This is not a &ldquo;learn ChatGPT prompts&rdquo; course. By the end of this
            training, you will either understand sourcing at a deep level — or you will
            clearly see why you&apos;ve been struggling. No hiding behind AI. No hiding
            behind tools.
          </p>
        </section>

        {/* CTA / Pricing */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to move into the top 1%?
          </h2>
          <p className="text-slate-500 mb-8">
            Two packages available — Basic and Pro with Interview Prep.
          </p>
          <Link
            href={ticketsUrl}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-4 rounded-xl transition-colors shadow-md"
          >
            Enroll now
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
