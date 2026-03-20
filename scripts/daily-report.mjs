#!/usr/bin/env node
/**
 * Daily morning report — collects all performance data, runs AI analysis via Claude CLI,
 * saves to reports/YYYY-MM-DD.md, and emails via SendGrid.
 *
 * Usage:   node --env-file=.env scripts/daily-report.mjs
 * Schedule: ~/Library/LaunchAgents/com.aiwithmichal.daily-report.plist (7:15am daily)
 *           See scripts/install-launchagent.sh to set up.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from './todoist/client.mjs';
import { addTask } from './todoist/tasks.mjs';

const execFileAsync = promisify(execFile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN;
const TODOIST_PROJECT_ID = process.env.TODOIST_PROJECT_ID || '6gCJVXq7MX73MxFv';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'michal@michaljuhas.com';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'hello@aiwithmichal.com';
const FROM_NAME = 'AI with Michal – Reporting';
const TODAY = new Date().toISOString().slice(0, 10);

function log(msg) {
  process.stdout.write(`[daily-report] ${msg}\n`);
}

async function runScript(scriptName) {
  log(`Running ${scriptName}...`);
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [join(ROOT, 'scripts', scriptName)],
      { cwd: ROOT, env: process.env, timeout: 60_000, encoding: 'utf8' }
    );
    return stdout;
  } catch (err) {
    const extra = [(err.stdout || ''), (err.stderr || '')].filter(Boolean).join('\n');
    log(`Warning: ${scriptName} failed — ${err.message}`);
    return `[${scriptName} error: ${err.message}]\n${extra}`;
  }
}

function readGoals() {
  try {
    return readFileSync(join(ROOT, 'GOALS.md'), 'utf8');
  } catch {
    return '(GOALS.md not found)';
  }
}

function buildPrompt({ goals, status, analytics, stripe, meta }) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return `You are an AI assistant producing a daily marketing performance report for a live workshop.

Today is ${date}.

## Workshop Goals

${goals}

## Live Performance Data

### Workshop Status (Registrations + Revenue)
\`\`\`
${status.trim()}
\`\`\`

### PostHog Funnel Analytics
\`\`\`
${analytics.trim()}
\`\`\`

### Stripe Revenue Breakdown
\`\`\`
${stripe.trim()}
\`\`\`

### Meta Ads Performance
\`\`\`
${meta.trim()}
\`\`\`

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

async function analyzeWithClaude(prompt) {
  if (!ANTHROPIC_API_KEY) {
    log('ANTHROPIC_API_KEY not set — skipping AI analysis');
    return null;
  }

  log('Calling Anthropic API for analysis (this may take 1–2 minutes)...');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    log(`Anthropic API error (${res.status}): ${err}`);
    return null;
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

function buildFallbackReport({ status, analytics, stripe, meta }) {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  return `# Daily Report — ${date}

> ⚠️ AI analysis unavailable (Claude CLI not found on PATH). Raw data below.

## Workshop Status
\`\`\`
${status.trim()}
\`\`\`

## PostHog Funnel
\`\`\`
${analytics.trim()}
\`\`\`

## Stripe Revenue
\`\`\`
${stripe.trim()}
\`\`\`

## Meta Ads
\`\`\`
${meta.trim()}
\`\`\`
`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(str) {
  return escHtml(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-family:monospace">$1</code>');
}

function renderTable(tableLines) {
  // Drop separator rows (|---|---|)
  const rows = tableLines.filter((l) => !/^\|[\s|:-]+\|$/.test(l));
  if (rows.length === 0) return '';

  const parseRow = (line) =>
    line.split('|').slice(1, -1).map((cell) => cell.trim());

  const [headerLine, ...bodyLines] = rows;
  const headers = parseRow(headerLine);

  let t = '<table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px">';
  t += '<thead><tr>';
  for (const h of headers) {
    t += `<th style="border:1px solid #ddd;padding:8px 12px;background:#f5f5f5;text-align:left;font-weight:600">${renderInline(h)}</th>`;
  }
  t += '</tr></thead><tbody>';
  for (const line of bodyLines) {
    const cells = parseRow(line);
    t += '<tr>';
    for (let j = 0; j < headers.length; j++) {
      t += `<td style="border:1px solid #ddd;padding:8px 12px;vertical-align:top">${renderInline(cells[j] ?? '')}</td>`;
    }
    t += '</tr>';
  }
  t += '</tbody></table>';
  return t;
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      i++;
      let code = '';
      while (i < lines.length && !lines[i].startsWith('```')) {
        code += lines[i] + '\n';
        i++;
      }
      i++; // skip closing ```
      html += `<pre style="background:#f6f6f6;padding:12px;border-radius:4px;font-size:13px;font-family:monospace;overflow-x:auto;white-space:pre-wrap">${escHtml(code.trimEnd())}</pre>\n`;
      continue;
    }

    // Headings
    const h1 = line.match(/^# (.+)$/);
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h1) { html += `<h1 style="border-bottom:2px solid #eee;padding-bottom:8px;margin-top:24px">${renderInline(h1[1])}</h1>\n`; i++; continue; }
    if (h2) { html += `<h2 style="color:#333;margin-top:28px;margin-bottom:8px">${renderInline(h2[1])}</h2>\n`; i++; continue; }
    if (h3) { html += `<h3 style="color:#555;margin-top:20px">${renderInline(h3[1])}</h3>\n`; i++; continue; }

    // Table — collect all consecutive pipe-starting lines
    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      html += renderTable(tableLines) + '\n';
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      html += `<blockquote style="border-left:3px solid #ddd;padding:4px 12px;color:#666;margin:8px 0">${renderInline(line.slice(2))}</blockquote>\n`;
      i++;
      continue;
    }

    // List — collect consecutive list items
    if (line.match(/^- /)) {
      let items = '';
      while (i < lines.length && lines[i].match(/^- /)) {
        const text = lines[i].slice(2);
        const taskDone = text.match(/^\[x\] (.+)/i);
        const taskOpen = text.match(/^\[ \] (.+)/);
        if (taskDone) {
          items += `<li style="margin:4px 0">☑ <s>${renderInline(taskDone[1])}</s></li>`;
        } else if (taskOpen) {
          items += `<li style="margin:4px 0">☐ ${renderInline(taskOpen[1])}</li>`;
        } else {
          items += `<li style="margin:4px 0">${renderInline(text)}</li>`;
        }
        i++;
      }
      html += `<ul style="padding-left:20px;margin:8px 0">${items}</ul>\n`;
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-block lines
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('|') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('```')
    ) {
      paraLines.push(renderInline(lines[i]));
      i++;
    }
    if (paraLines.length) html += `<p style="margin:8px 0">${paraLines.join('<br>')}</p>\n`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#222;line-height:1.6">
${html}
</body>
</html>`;
}

async function sendEmailOnce(subject, markdownContent) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { email: FROM_EMAIL, name: FROM_NAME },
      personalizations: [{ to: [{ email: ADMIN_EMAIL }] }],
      subject,
      content: [
        { type: 'text/plain', value: markdownContent },
        { type: 'text/html', value: markdownToHtml(markdownContent) },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SendGrid error (${res.status}): ${body}`);
  }
}

async function sendEmail(subject, markdownContent) {
  if (!SENDGRID_API_KEY) {
    log('SENDGRID_API_KEY not set — skipping email');
    return;
  }

  log(`Sending email from ${FROM_EMAIL} to ${ADMIN_EMAIL}...`);
  try {
    await sendEmailOnce(subject, markdownContent);
    log('Email sent.');
  } catch (err) {
    log(`Send failed (${err.message}) — retrying in 10s...`);
    await new Promise((r) => setTimeout(r, 10_000));
    await sendEmailOnce(subject, markdownContent);
    log('Email sent (retry).');
  }
}

function extractTasks(report) {
  const lines = report.split('\n');
  const tasks = [];
  let inTasksSection = false;
  for (const line of lines) {
    if (/^## Tasks/.test(line)) { inTasksSection = true; continue; }
    if (inTasksSection && /^## /.test(line)) break;
    if (inTasksSection) {
      const m = line.match(/^- \[ \] (.+)/);
      if (m) tasks.push(m[1].trim());
    }
  }
  return tasks;
}

async function createTodoistTasks(report) {
  if (!TODOIST_API_TOKEN) {
    log('TODOIST_API_TOKEN not set — skipping Todoist task creation');
    return;
  }

  const tasks = extractTasks(report);
  if (tasks.length === 0) {
    log('No open tasks found in report — nothing to add to Todoist');
    return;
  }

  log(`Creating ${tasks.length} task(s) in Todoist...`);
  const client = createClient(TODOIST_API_TOKEN);
  let created = 0;
  for (const content of tasks) {
    try {
      await addTask(client, { content, due_date: TODAY, project_id: TODOIST_PROJECT_ID });
      created++;
    } catch (err) {
      const detail = err.httpStatus ? ` (HTTP ${err.httpStatus}, code=${err.errorCode})` : '';
      log(`Warning: failed to create Todoist task "${content}" — ${err.message}${detail}`);
    }
  }
  log(`Todoist: ${created}/${tasks.length} task(s) created.`);
}

async function main() {
  log(`Starting daily report for ${TODAY}`);

  // Collect data from all sources in parallel
  const [status, analytics, stripe, meta] = await Promise.all([
    runScript('status.mjs'),
    runScript('analytics.mjs'),
    runScript('stripe-report.mjs'),
    runScript('meta-ads-stats.mjs'),
  ]);

  const goals = readGoals();

  // AI analysis via Claude CLI
  const prompt = buildPrompt({ goals, status, analytics, stripe, meta });
  let report = await analyzeWithClaude(prompt);

  if (!report) {
    log('Using raw-data fallback report.');
    report = buildFallbackReport({ status, analytics, stripe, meta });
  }

  // Save report to reports/YYYY-MM-DD.md
  const reportsDir = join(ROOT, 'reports');
  mkdirSync(reportsDir, { recursive: true });
  const reportPath = join(reportsDir, `${TODAY}.md`);
  writeFileSync(reportPath, report, 'utf8');
  log(`Saved to reports/${TODAY}.md`);

  // Create Todoist tasks from the ## Tasks section
  await createTodoistTasks(report);

  // Email the report
  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
  const timeLabel = now.toLocaleString('sv', { timeZone: 'Europe/Prague' }).slice(0, 16);
  await sendEmail(`Daily Report — ${dateLabel} ${timeLabel}`, report);

  log('Done.');
}

main().catch((err) => {
  console.error('[daily-report] Fatal error:', err.message);
  process.exit(1);
});
