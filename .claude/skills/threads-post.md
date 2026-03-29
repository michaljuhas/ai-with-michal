---
name: threads-post
description: Use when the user wants to create, draft, or publish Threads posts. Covers build-in-public content strategy, post generation, daily posting workflow, and engagement optimization. Trigger on "post to Threads", "Threads content", "build in public", "draft a thread", "publish on Threads".
---

# Threads Build-in-Public Posting Strategy

Goal: grow @michal.juhas.life to 50,000 followers by September 2026 through consistent, high-engagement build-in-public content.

## Brand Voice

- **Direct, honest, no fluff.** Short punchy sentences. Lead with numbers or a bold claim.
- **Practitioner tone** — "here's what I did" not "here's what you should do"
- **Transparency** — share wins AND losses with real numbers (revenue, users, conversion rates, ad spend)
- **Recruiting + AI niche** — always tie back to building products, AI in recruiting, or entrepreneurship
- **No emojis in hooks.** Max 1-2 emojis per post, only at the end or for emphasis. Never in the opening line.
- **No hashtags in the post body.** Use one topic tag at the end (see Topic Tags below).

## Content Pillars (rotate daily)

| # | Pillar | What to post | Example hook |
|---|--------|-------------|--------------|
| 1 | **Numbers & metrics** | Revenue, conversion rates, ad spend, registrations, traffic | "€2,847 revenue from 38 tickets. Here's the breakdown." |
| 2 | **Behind the build** | What you shipped today, technical decisions, tool choices | "Spent 3 hours replacing my manual sourcing workflow with Claude Code." |
| 3 | **Lessons & failures** | What went wrong, what you'd do differently, honest takes | "My Meta Ads campaign burned €200 with 0 conversions. What I learned." |
| 4 | **Hot takes & opinions** | Contrarian views on AI, recruiting, building products | "Most recruiters using AI are just doing the same manual work with extra steps." |
| 5 | **Before/after & demos** | Show transformation, workflow demos, product evolution | "This sourcing workflow used to take 4 hours. Now it takes 12 minutes." |
| 6 | **Audience questions** | Ask for input, run polls, start debates | "What's the one recruiting task you'd automate first?" |
| 7 | **Personal & relatable** | Family, motivation, founder life, behind-the-scenes | "My 12-year-old ships SaaS products faster than most adults I know." |

## Daily Posting Schedule

Post **2-3 times per day**, spaced at least 4 hours apart.

| Slot | Time (CET) | Type | Why |
|------|-----------|------|-----|
| Morning | 8:00-9:00 | Numbers / Hot take | Peak engagement window (weekday mornings) |
| Midday | 12:00-13:00 | Behind the build / Lesson | Lunch browsing window |
| Evening | 19:00-20:00 | Question / Personal | Evening engagement window |

**Best days:** Tuesday-Thursday (highest reach). Lighter on weekends.

## Post Formats That Work

### 1. The Metric Drop (highest engagement)
```
[Specific number or result]

[2-3 sentences of context — what happened, what you did]

[1 sentence takeaway or lesson]

[Optional: question to spark replies]
```

### 2. The Contrast Post
```
[How most people do X] vs [How I do X]

[Specific example with numbers]

[Why the difference matters]
```

### 3. The Honest Update
```
[What happened — good or bad]

[The numbers behind it]

[What I'm changing / what I learned]
```

### 4. The Hot Take
```
[Bold, specific opinion in 1 sentence]

[2-3 sentences backing it up with experience or data]

[End with a question or "Change my mind."]
```

### 5. The Before/After
```
Before: [old way with specific pain point]
After: [new way with specific result]

[How I got there in 1-2 sentences]
```

## Topic Tags (use ONE per post, at the end)

Rotate based on content:
- `AI` — for AI tool/workflow posts
- `Recruiting` — for talent sourcing and HR content
- `Building in Public` — for metrics, updates, transparency posts
- `Startups` — for entrepreneurship and business content
- `Automation` — for workflow and efficiency content
- `Entrepreneurship` — for personal business journey posts

## Engagement Rules

1. **Optimize for replies, not likes.** The Threads algorithm weights replies highest. End posts with questions or debate starters.
2. **Reply to every comment** within 1 hour of posting. Extend the conversation — never just "thanks!"
3. **Spend 10 min/day replying** to other creators' posts in recruiting/AI/startup niches. Sharp, value-adding replies — not "great post!"
4. **First 60 minutes matter most.** The algorithm evaluates engagement velocity. Post when your audience is active.
5. **Never use engagement bait** ("comment YES", "like if you agree"). Ask genuine questions instead.

## How to Generate and Publish

### Step 1 — Gather fresh data

Before drafting, pull real numbers:

```bash
# Current workshop metrics
node --env-file=.env scripts/status.mjs

# Revenue and Stripe data
node --env-file=.env scripts/stripe-report.mjs

# Traffic and conversion funnel
node --env-file=.env scripts/analytics.mjs

# Recent ad performance
node --env-file=.env scripts/meta-ads/index.mjs campaigns list --status ACTIVE --pretty
```

### Step 2 — Draft the post

Write 2-3 post options using the content pillars and formats above. Each post should:
- Open with a hook (number, bold claim, or surprising fact) — no filler
- Be 1-5 sentences for text posts (concise wins on Threads)
- Include at least one specific number or data point
- End with a reply trigger (question, debate starter, or "here's what I'd change")
- Include one topic tag at the end
- Match Michal's voice: direct, honest, practitioner-first

Present the drafts to the user for selection/editing before publishing.

### Step 3 — Publish

```bash
# Text post (one-step)
node --env-file=.env scripts/threads/index.mjs posts container \
  --media-type TEXT \
  --text "Your post text here" \
  --topic-tag "Building in Public" \
  --auto-publish-text

# Image post (two-step)
node --env-file=.env scripts/threads/index.mjs posts container \
  --media-type IMAGE \
  --image-url "https://publicly-accessible-url.com/image.jpg" \
  --text "Caption here" \
  --topic-tag "AI"
# Wait 30 seconds, then:
node --env-file=.env scripts/threads/index.mjs posts publish --creation-id <id>
```

### Step 4 — Verify and track

```bash
# Check it posted correctly
node --env-file=.env scripts/threads/index.mjs posts list --limit 1 --pretty

# Check insights after a few hours
node --env-file=.env scripts/threads/index.mjs insights post <media-id> --metric views,likes,replies,reposts,quotes,shares --pretty
```

## Weekly Review Checklist

Every Monday, review the previous week:

```bash
# Account-level insights (last 7 days)
node --env-file=.env scripts/threads/index.mjs insights account \
  --metric views,likes,replies,reposts,quotes,followers_count --pretty

# List recent posts to check individually
node --env-file=.env scripts/threads/index.mjs posts list --limit 20 --pretty
```

Track: total views, replies per post, follower growth, best-performing post format.

## Content Ideas Bank

Pull from these recurring sources:

| Source | Content type |
|--------|-------------|
| `scripts/status.mjs` output | Registration milestones, conversion rates, spots remaining |
| `scripts/stripe-report.mjs` output | Revenue milestones, average order value, coupon usage |
| `scripts/analytics.mjs` output | Funnel drop-offs, traffic sources, page performance |
| Meta Ads dashboard | Ad spend vs results, CPL, winning creatives |
| Workshop prep | What you're building for attendees, curriculum updates |
| Customer feedback | DMs, emails, testimonials (anonymized) |
| AI tools you test | New tools, workflow improvements, honest reviews |
| Recruiting industry news | LinkedIn changes, new AI tools, market shifts |
| Personal journey | Founder decisions, family, motivation, behind-the-scenes |

## Growth Milestones

| Followers | Target date | Strategy focus |
|-----------|------------|----------------|
| 500 | Apr 15, 2026 | Consistent posting + heavy engagement on others' posts |
| 2,000 | May 15, 2026 | Double down on top-performing formats, start cross-promoting from IG |
| 10,000 | Jul 1, 2026 | Video content, collaborations, viral-format experiments |
| 25,000 | Aug 15, 2026 | Community building, recurring series, thought leadership |
| 50,000 | Sep 30, 2026 | Scale what works, paid promotion of top posts |
