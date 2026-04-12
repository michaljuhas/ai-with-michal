"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { MemberFeedPreviewPost } from "@/lib/member-feed-preview";

function firstName(name: string | null): string | null {
  if (!name?.trim()) return null;
  return name.trim().split(/\s+/)[0] ?? null;
}

export default function MemberFeedShowcase() {
  const [posts, setPosts] = useState<MemberFeedPreviewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/member-feed-preview");
        if (!res.ok) {
          if (!cancelled) setPosts([]);
          return;
        }
        const data = (await res.json()) as { posts?: MemberFeedPreviewPost[] };
        if (!cancelled) {
          setPosts(Array.isArray(data.posts) ? data.posts : []);
        }
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setActive(0);
  }, [posts]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el || posts.length === 0) return;
    const clamped = Math.max(0, Math.min(index, posts.length - 1));
    const slide = el.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActive(clamped);
  }, [posts.length]);

  const go = useCallback(
    (delta: number) => {
      scrollToIndex(active + delta);
    },
    [active, scrollToIndex]
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || posts.length === 0) return;

    const onScroll = () => {
      let bestIdx = 0;
      let minDiff = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i] as HTMLElement;
        const diff = Math.abs(el.scrollLeft - child.offsetLeft);
        if (diff < minDiff) {
          minDiff = diff;
          bestIdx = i;
        }
      }
      setActive(Math.max(0, Math.min(bestIdx, posts.length - 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [posts.length]);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
            Member hub
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Where recruiters learn AI in the wild
          </h2>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            Real workflows, peer momentum, and updates that keep you ahead — the member community
            is built for TA and recruiting leaders who want AI to stick, not stall.
          </p>
        </motion.div>

        {loading ? (
          <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm animate-pulse">
            <div className="h-48 rounded-xl bg-slate-100 mb-6" />
            <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-5/6" />
          </div>
        ) : null}

        {!loading && posts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative"
          >
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {posts.map((post) => {
                const byline = firstName(post.author_name);
                return (
                  <article
                    key={post.id}
                    className="snap-center shrink-0 w-[min(92vw,28rem)] md:w-[min(85vw,32rem)] rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/50 overflow-hidden flex flex-col"
                  >
                    {post.image_url ? (
                      <div className="relative aspect-[16/10] bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image_url}
                          alt={post.headline}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-3 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400" />
                    )}
                    <div className="p-6 md:p-7 flex flex-col flex-1">
                      {byline ? (
                        <p className="text-xs font-medium text-slate-400 mb-2">From {byline}</p>
                      ) : null}
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-3">
                        {post.headline}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 flex-1">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-5 mt-2">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={active <= 0}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none transition-colors"
                  aria-label="Previous post"
                >
                  <ChevronLeft size={22} aria-hidden />
                </button>
                <div className="flex gap-2">
                  {posts.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === active ? "w-8 bg-blue-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to post ${i + 1}`}
                      aria-current={i === active ? "true" : undefined}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(1)}
                  disabled={active >= posts.length - 1}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-35 disabled:pointer-events-none transition-colors"
                  aria-label="Next post"
                >
                  <ChevronRight size={22} aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="text-center mt-12"
        >
          <Link
            href="/register?ref=homepage-member-feed"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm shadow-blue-600/20"
          >
            Become a member
            <ArrowRight size={18} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
