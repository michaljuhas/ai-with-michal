import { auth } from "@clerk/nextjs/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const maxDuration = 120;

const execFileAsync = promisify(execFile);

const ADMIN_USER_ID = "user_3BAd2lxThMRnjSjR2lBRTcLcXFp";
const CAMPAIGN_START = "2026-03-20";
const ROOT = process.cwd();

async function runScript(scriptName: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [join(ROOT, "scripts", scriptName)],
      { cwd: ROOT, env: process.env, timeout: 60_000, encoding: "utf8" }
    );
    return stdout;
  } catch (err: unknown) {
    const e = err as { message?: string; stdout?: string; stderr?: string };
    const extra = [e.stdout ?? "", e.stderr ?? ""].filter(Boolean).join("\n");
    return `[${scriptName} error: ${e.message}]\n${extra}`;
  }
}

function readFile(filename: string): string {
  try {
    return readFileSync(join(ROOT, filename), "utf8");
  } catch {
    return `(${filename} not found)`;
  }
}

function readRecentActivity(): string {
  try {
    const raw = readFileSync(join(ROOT, "ACTIVITY.md"), "utf8");
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const sections = raw.split(/^## /m).slice(1);
    const recent = sections.filter((s) => {
      const dateStr = s.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
      return dateStr && new Date(dateStr) >= cutoff;
    });
    return recent.length > 0
      ? recent.map((s) => `## ${s.trim()}`).join("\n\n")
      : "(no activity in the last 14 days)";
  } catch {
    return "(ACTIVITY.md not found)";
  }
}

function buildPrompt(data: {
  goals: string;
  status: string;
  analytics: string;
  stripe: string;
  meta: string;
  activity: string;
}): string {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `You are an AI assistant producing a daily marketing performance report for a live workshop.

Today is ${date}. Campaign started on ${CAMPAIGN_START}. All analytics data is filtered from ${CAMPAIGN_START} onwards — earlier data (development/testing) is excluded.

## Workshop Goals

${data.goals}

## Live Performance Data

### Workshop Status (Registrations + Revenue)
\`\`\`
${data.status.trim()}
\`\`\`

### PostHog Funnel Analytics
\`\`\`
${data.analytics.trim()}
\`\`\`

### Stripe Revenue Breakdown
\`\`\`
${data.stripe.trim()}
\`\`\`

### Meta Ads Performance
\`\`\`
${data.meta.trim()}
\`\`\`

### Recent Activity (last 14 days)
${data.activity}

## Your task

Write a concise daily report in Markdown using only the numbers from the data above. Do not invent data.

Use this exact structure:

# Daily Report — ${date}

## Executive Summary
2–3 bullet points on the most important metrics right now.

## Revenue & Funnel
Assess revenue progress vs. €3,000 minimum / €5,000 stretch target. Note Pro vs. Basic mix (target 50% Pro). Flag conversion rate vs. 3% target.

## Meta Ads Analysis
Assess each campaign individually. Apply these decision rules:
- Active + CTR < 0.5%: recommend PAUSE (creative needs refresh)
- Active + CTR > 3%: recommend SCALE (increase daily budget)
- Active + spend > 0 but zero leads/purchases: recommend PAUSE or fix conversion tracking
- Active + healthy metrics: MAINTAIN
- No active campaigns: suggest creating one

## Recommendations
3–5 specific, prioritised recommendations with concrete next actions.

## Tasks
List every action requiring manual intervention as Markdown checkboxes. Be specific: name the campaign, state the exact budget amount, etc.
- [ ] ...

If no manual action is needed today, write exactly: "No manual action required today."
`;
}

async function analyzeWithClaude(prompt: string): Promise<string | null> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return (data.content?.[0]?.text as string)?.trim() ?? null;
}

function buildFallbackReport(data: {
  status: string;
  analytics: string;
  stripe: string;
  meta: string;
}): string {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `# Daily Report — ${date}

> ⚠️ AI analysis unavailable. Raw data below.

## Workshop Status
\`\`\`
${data.status.trim()}
\`\`\`

## PostHog Funnel
\`\`\`
${data.analytics.trim()}
\`\`\`

## Stripe Revenue
\`\`\`
${data.stripe.trim()}
\`\`\`

## Meta Ads
\`\`\`
${data.meta.trim()}
\`\`\`
`;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId || userId !== ADMIN_USER_ID) {
    return new Response("Forbidden", { status: 403 });
  }

  const [status, analytics, stripe, meta] = await Promise.all([
    runScript("status.mjs"),
    runScript("analytics.mjs"),
    runScript("stripe-report.mjs"),
    runScript("meta-ads-stats.mjs"),
  ]);

  const goals = readFile("GOALS.md");
  const activity = readRecentActivity();

  const prompt = buildPrompt({ goals, status, analytics, stripe, meta, activity });
  let report = await analyzeWithClaude(prompt);

  if (!report) {
    report = buildFallbackReport({ status, analytics, stripe, meta });
  }

  return Response.json({ report });
}
