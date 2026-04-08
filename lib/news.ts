export type NewsArticle = {
  slug: string;
  title: string;
  subheadline: string;
  author: string;
  date: Date;
  thumbnail: string;
  excerpt: string;
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "claude-skills-for-recruiters",
    title: "New Claude Skills For Recruiters",
    subheadline:
      "I released and open-sourced a Claude skill on GitHub that makes recruiters dramatically more productive; from analyzing job requirements to writing personalized outreach.",
    author: "Michal Juhas",
    date: new Date("2026-04-08"),
    thumbnail: "/news/candidate-sourcer-skill-thumbnail.png",
    excerpt:
      "Six specialized AI skills for recruiters: job requirement analysis, candidate ICP builder, job seller, sourcing strategy generator, candidate screener, and outreach writer.",
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}
