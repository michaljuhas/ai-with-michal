import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { NEWS_ARTICLES, getArticleBySlug } from "@/lib/news";
import ClaudeSkillsForRecruiters from "@/components/news/ClaudeSkillsForRecruiters";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const articleUrl = `/news/${article.slug}`;
  const publishedTime = article.date.toISOString();

  return {
    title: `${article.title} — AI with Michal`,
    description: article.subheadline,
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: article.title,
      description: article.subheadline,
      url: articleUrl,
      type: "article",
      publishedTime,
      authors: [article.author],
      images: [
        {
          url: article.thumbnail,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subheadline,
      images: [article.thumbnail],
    },
  };
}

const ARTICLE_COMPONENTS: Record<string, React.ComponentType> = {
  "claude-skills-for-recruiters": ClaudeSkillsForRecruiters,
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const ArticleBody = ARTICLE_COMPONENTS[slug];

  return (
    <main className="min-h-screen bg-white">
      {/* Thumbnail */}
      <div className="w-full max-w-[700px] mx-auto px-4 sm:px-6 pt-10">
        <div className="w-full bg-slate-100 rounded-2xl overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={700}
            height={0}
            style={{ width: "100%", height: "auto" }}
            className="block"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Article header */}
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 pt-8 pb-2">
        <div className="inline-block mb-5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-widest uppercase">
          News
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed mb-6">
          {article.subheadline}
        </p>

        {/* Author + date */}
        <div className="flex items-center gap-3 pb-8 border-b border-slate-100">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
            <Image
              src="/Michal-Juhas-headshot-square-v1.jpg"
              alt={article.author}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-0.5">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <User size={13} className="text-slate-400" aria-hidden />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
              <Calendar size={13} aria-hidden />
              {formatDate(article.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 pt-8 pb-20">
        {ArticleBody ? (
          <ArticleBody />
        ) : (
          <p className="text-slate-500">Content coming soon.</p>
        )}
      </div>
    </main>
  );
}
