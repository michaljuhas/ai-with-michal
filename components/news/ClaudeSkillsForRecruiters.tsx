import Link from "next/link";
import Image from "next/image";

const skills = [
  {
    title: "Job Requirement Analysis",
    description:
      "Analyzing hiring managers' requirements is hard, especially if a recruiter doesn't know much about the specific domain. This skill walks you through a structured 18-dimension analysis of a role before you start sourcing.",
  },
  {
    title: "Candidate ICP Builder",
    description:
      "Turns a job description into a weighted scoring rubric — must-have, important, and nice-to-have — so you know exactly what a great candidate looks like before you start reviewing profiles.",
  },
  {
    title: "Job Seller",
    description:
      "Identifies what's exciting about a role, rewrites boring job ads into compelling ones, and generates outreach hooks that actually get responses.",
  },
  {
    title: "Sourcing Strategy Generator",
    description:
      "Creates Boolean search strings, Google X-ray searches, and a full channel checklist, so you know not just where to look, but exactly how to search.",
  },
  {
    title: "Candidate Screener",
    description:
      "Scores candidates against your rubric with evidence, ranks batches, and writes hiring manager briefings. You'll spend less time on admin and more time on conversations.",
  },
  {
    title: "Outreach Writer",
    description:
      "Writes personalized LinkedIn, email, and X messages with A/B variants and follow-up sequences tailored to the candidate and the role.",
  },
];

const triggers = [
  {
    command: "Here's a job description, analyze the requirements",
    skill: "Job Requirement Analysis",
  },
  { command: "Build me a scoring rubric for this role", skill: "ICP Builder" },
  {
    command: "Make this job ad more appealing",
    skill: "Job Seller",
  },
  {
    command: "Where should I find candidates for this role?",
    skill: "Sourcing Strategy Generator",
  },
  {
    command: "Score this candidate against our rubric: [paste profile]",
    skill: "Candidate Screener",
  },
  {
    command: "Write outreach for this candidate",
    skill: "Outreach Writer",
  },
];

export default function ClaudeSkillsForRecruiters() {
  return (
    <div className="space-y-10">
      {/* Intro */}
      <p className="text-lg text-slate-700 leading-relaxed">
        As a part of the workshop that I just finished with a group of recruiters,
        I released and <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500" href="https://github.com/michaljuhas/recruiting-skills">open-sourced a skill on GitHub for Claude</a>. Recruiters
        can use it to be much more productive.
      </p>

      {/* Video walkthrough */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Video walkthrough
        </h2>
        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-black pt-[56.25%]">
          <iframe
            src="https://www.youtube.com/embed/h7LQ8QIOYPs"
            title="Claude Skills for Recruiters - Video Walkthrough"
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          The new skills
        </h2>
        <p className="text-slate-500 mb-6">
          You&apos;ll import six specialized skills to your Claude project, each skill triggered naturally in conversation.
        </p>

        {/* Skills overview image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200">
          <Image
            src="/news/candidate-sourcer-file-structure.jpeg"
            alt="Claude skill file structure for recruiters"
            width={700}
            height={0}
            style={{ width: "100%", height: "auto" }}
            className="block"
            unoptimized
          />
        </div>
        
        <div className="space-y-5 mt-6">
          {skills.map((skill) => (
            <div key={skill.title}>
              <h3 className="font-bold text-slate-900">{skill.title}</h3>
              <p className="text-slate-600 leading-relaxed mt-1">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why is this important */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Why is this important
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Most recruiters use AI the basic way: they chat with ChatGPT or
          Gemini which, according to my AI adoption ladder, is just the first
          level (after No AI use).
        </p>
        <p className="text-slate-600 leading-relaxed mt-4">
          During{" "}
          <Link href="/workshops" className="text-blue-600 hover:text-blue-500">
            my workshops
          </Link>{" "}I teach recruiters how to systemize and automate
          their activities and processes. Using Claude Skills, Gemini Gems, or
          CustomGPTs is one of the ways how to level up.
        </p>

        <div className="rounded-2xl overflow-hidden border border-slate-200 mt-6">
          <Image
            src="/news/2026-04-08-ai-adoption-maturity.jpg"
            alt="AI Adoption Maturity Ladder"
            width={700}
            height={0}
            style={{ width: "100%", height: "auto" }}
            className="block"
            unoptimized
          />
        </div>

        <p className="text-slate-700 font-semibold mt-5">
          These new Claude skills will help you shift from{" "}
          <span className="text-orange-600">CHATTING</span> to{" "}
          <span className="text-orange-600">SYSTEMIZING</span>.
        </p>
      </div>

      {/* How is it trained */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Trained skills
        </h2>
        <p className="text-slate-600 leading-relaxed">
          These skills include the best-practices from my recruiting
          practice and insights from my training programs at the{" "}
          <a
            href="https://techrecruitmentacademy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-500"
          >
            Tech Recruitment Academy
          </a>
          {" "}where over 5,000 recruiters purchased my mind maps and 20,000 HR
          and TA managers joined my online courses.
        </p>
        <p className="text-slate-600 leading-relaxed mt-4">
          You can see some of the mind maps in the GitHub repository in the
          resources section of those skills.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          How to use them
        </h2>
        <p className="text-slate-600 leading-relaxed mb-6">
          Download the skills from GitHub and import them into Claude. 
          A detailed guide is in the repository on how to do this. 
          Once installed, just talk to Claude naturally:
        </p>
        <ol className="space-y-3">
          {triggers.map((t, i) => (
            <li key={t.skill} className="flex items-baseline gap-3">
              <span className="shrink-0 text-sm font-semibold text-slate-400 w-5 text-right">
                {i + 1}.
              </span>
              <span className="text-slate-700 leading-relaxed">
                <code className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded text-sm">
                  &ldquo;{t.command}&rdquo;
                </code>
                <span className="text-slate-500"> — triggers {t.skill}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="text-slate-600 leading-relaxed mt-6">
          This feels like magic, but it&apos;s not. 
          Hope you&apos;ll find it useful, let me know what you think.
          And if you need help using it, join my upcoming workshop:
        </p>
      </div>

      {/* Workshop CTA */}
      <div className="rounded-2xl bg-slate-900 p-8 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-3">
          Live Workshop · Apr 16
        </p>
        <h2 className="text-2xl font-bold text-white mb-3">
          See it live, join the workshop
        </h2>
        <p className="text-slate-400 mb-6 leading-relaxed">
          I&apos;m running a live workshop on <b>April 16th</b>{" "}where we use this skill
          together on real job descriptions. Hands-on practice, live Q&amp;A.
        </p>
        <Link
          href="/workshops/2026-04-16-ai-in-recruiting"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-base"
        >
          Learn more &amp; join
        </Link>
      </div>
    </div>
  );
}
