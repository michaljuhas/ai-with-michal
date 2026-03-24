#!/usr/bin/env node
/**
 * Generate campaign creative assets — headlines, primary texts, and images.
 * Saves everything to campaigns/YYYY-MM-DD-HH-mm/
 *
 * Assets generated:
 *   copy.json / copy.md  — 5 headlines + 5 primary text variations
 *   square-1.png         — 1:1 image, concept A
 *   square-2.png         — 1:1 image, concept B
 *   portrait-1.png       — 9:16 image, concept A
 *   portrait-2.png       — 9:16 image, concept B
 *
 * Usage:
 *   node --env-file=.env scripts/generate-campaign-assets.mjs
 *   node --env-file=.env scripts/generate-campaign-assets.mjs --focus "AI automation for recruiting"
 *   node --env-file=.env scripts/generate-campaign-assets.mjs --focus "replacing manual sourcing with AI workflows"
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Nano Banana CLI (uses GEMINI_API_KEY from env)
const NB_CLI = join(homedir(), 'tools/nano-banana-2/src/cli.ts');
const BUN = join(homedir(), '.bun/bin/bun');

// Reference images of Michal Juhas — passed to every image generation call
// so the model knows exactly what he looks like.
const MICHAL_REFS = [
  join(ROOT, 'knowledge-base/public-speaking-samples/Michal-profile.jpg'),
  join(ROOT, 'knowledge-base/public-speaking-samples/michal-speaking-01.jpg'),
  join(ROOT, 'knowledge-base/public-speaking-samples/michal-speaking-04.jpg'),
  join(ROOT, 'knowledge-base/public-speaking-samples/michal-speaking-10.jpg'),
];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const focusIdx = args.indexOf('--focus');
  const focus = focusIdx !== -1 ? args[focusIdx + 1] : null;

  if (focusIdx !== -1 && !focus) {
    console.error('[generate-campaign] Error: --focus requires a value, e.g. --focus "AI automation"');
    process.exit(1);
  }

  return { focus };
}

function log(msg) {
  process.stdout.write(`[generate-campaign] ${msg}\n`);
}

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
  ].join('-');
}

// ---------------------------------------------------------------------------
// Copy generation — Claude
// ---------------------------------------------------------------------------

async function generateCopy(focus) {
  const focusLabel = focus ?? 'AI-powered talent sourcing outside LinkedIn';
  log(`Generating copy via Claude — focus: "${focusLabel}"`);

  const focusInstruction = focus
    ? `Topic focus for this batch: ${focus}. Angle ALL headlines and primary texts around this theme. De-emphasise any other angles.`
    : 'Use the key promise as your main angle.';

  const prompt = `You are an expert Facebook and Instagram ad copywriter specialising in B2B SaaS and online education.

Create compelling ad copy for this live online workshop:

Workshop: Build AI-Powered Talent Pools Outside LinkedIn
Date: April 2, 2026 · 3:00 PM – 4:30 PM UTC
Price: €79 Basic / €129 Pro (includes AI Toolkit)
Target audience: Recruiters, HR managers, talent acquisition leads, HR tech enthusiasts
Key promise: Learn to find and organise top talent with AI tools — without depending on LinkedIn

Topic guidelines: ${focusInstruction}

Respond with ONLY a JSON object matching this exact schema (no markdown fences, no extra text):

{
  "headlines": [
    "<Headline 1 — max 40 chars>",
    "<Headline 2 — max 40 chars>",
    "<Headline 3 — max 40 chars>",
    "<Headline 4 — max 40 chars>",
    "<Headline 5 — max 40 chars>"
  ],
  "primary_texts": [
    "<Variation 1 — 2–3 sentences. Hook + benefit + CTA.>",
    "<Variation 2>",
    "<Variation 3>",
    "<Variation 4>",
    "<Variation 5>"
  ]
}

Rules:
- Headlines: punchy, benefit-driven, max 40 characters each. Vary angles: urgency, curiosity, outcome, problem, social proof.
- Primary texts: conversational tone, one clear hook per variation, end with a call to action (e.g. "Grab your spot →").
- Do NOT repeat the same angle twice across variations.
- Return valid JSON only.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const raw = data.content?.[0]?.text?.trim() ?? '';

  // Strip accidental markdown fences
  const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(json);
}

// ---------------------------------------------------------------------------
// Image generation — Nano Banana Pro (Gemini image) with Michal reference images
// ---------------------------------------------------------------------------

// Prompts describe the scene and composition only — physical likeness comes
// from the MICHAL_REFS reference images passed via -r flags.
const IMAGE_PROMPTS = {
  conceptA: {
    square: `Photorealistic Facebook ad image, 1:1 square.
The man from the reference photos stands confidently at the front of a sleek modern conference room, presenting to a group of engaged professionals seated around a table. He wears a smart navy blazer. A large screen behind him shows AI-powered recruiting dashboards and talent-pool graphs. Warm professional lighting, clean blue-and-white aesthetic. No text or logos.`,
    portrait: `Photorealistic Facebook/Instagram story ad image, 9:16 portrait.
The man from the reference photos stands at the front of a modern conference room, microphone in hand, presenting to an attentive audience (backs of heads visible in foreground). A large screen behind him shows AI recruiting dashboards. Warm professional lighting, clean blue-and-white palette. No text or logos.`,
  },
  conceptB: {
    square: `Photorealistic Instagram ad image, 1:1 square.
The man from the reference photos stands at the front of a bright workshop space with floor-to-ceiling windows, smiling and presenting to a diverse group of HR professionals seated in rows. The screen behind him shows a colourful AI talent-network graph. Natural light, clean white-and-blue aesthetic. No text or logos.`,
    portrait: `Photorealistic Instagram story ad image, 9:16 portrait.
The man from the reference photos stands at the front of a bright modern workshop room, microphone in hand, passionately presenting to recruiters and HR managers seated in front of him. Screen in background shows colourful AI talent-pool data. Floor-to-ceiling windows, natural light, clean aesthetic. No text or logos.`,
  },
};

function generateImageWithNB(prompt, aspectRatio, outName, outDir) {
  const refArgs = MICHAL_REFS.flatMap((r) => ['-r', r]);
  const args = [
    NB_CLI,
    prompt,
    '-a', aspectRatio,
    '-m', 'pro',
    '-o', outName,
    '-d', outDir,
    ...refArgs,
  ];
  log(`  nano-banana: ${outName} (${aspectRatio}) …`);
  execFileSync(BUN, args, { stdio: 'inherit', env: process.env });
  const outPath = join(outDir, `${outName}.png`);
  if (!existsSync(outPath)) {
    throw new Error(`Expected output not found after generation: ${outPath}`);
  }
}

function generateImages(outDir) {
  log('Generating 4 images via Nano Banana Pro with Michal reference images (square × 2, portrait × 2)...');
  generateImageWithNB(IMAGE_PROMPTS.conceptA.square,   '1:1',  'square-1',   outDir);
  generateImageWithNB(IMAGE_PROMPTS.conceptB.square,   '1:1',  'square-2',   outDir);
  generateImageWithNB(IMAGE_PROMPTS.conceptA.portrait, '9:16', 'portrait-1', outDir);
  generateImageWithNB(IMAGE_PROMPTS.conceptB.portrait, '9:16', 'portrait-2', outDir);
}

// ---------------------------------------------------------------------------
// Save helpers
// ---------------------------------------------------------------------------

function buildMarkdown(copy, timestamp, focus) {
  const lines = [
    `# Campaign Copy — ${timestamp}`,
    '',
    focus ? `> **Topic focus:** ${focus}` : '',
    focus ? '' : '',
    '## Headlines (5 variations)',
    '',
    ...copy.headlines.map((h, i) => `${i + 1}. ${h}`),
    '',
    '## Primary Texts (5 variations)',
    '',
    ...copy.primary_texts.flatMap((t, i) => [`### Variation ${i + 1}`, '', t, '']),
  ].filter((l) => l !== null);
  return lines.join('\n');
}

function buildReadme(timestamp) {
  return `# Campaign Assets — ${timestamp}

Generated by \`scripts/generate-campaign-assets.mjs\`.

## Files

| File | Description |
|------|-------------|
| \`copy.json\` | Machine-readable headlines and primary texts |
| \`copy.md\` | Human-readable copy review |
| \`square-1.png\` | 1:1 image — concept A (people/desk) |
| \`square-2.png\` | 1:1 image — concept B (abstract network) |
| \`portrait-1.png\` | 9:16 image — concept A (people/desk) |
| \`portrait-2.png\` | 9:16 image — concept B (abstract network) |

## Usage

1. Review \`copy.md\` — pick the headline + primary text combination that fits your target audience.
2. Choose one square image and one portrait image.
3. Upload to Meta Ads Manager when creating a new ad set.

Portrait images are generated at 9:16 and can be cropped to 4:5 (1080×1350) inside Meta Ads Manager.
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('[generate-campaign] Error: ANTHROPIC_API_KEY not set in environment.');
    process.exit(1);
  }

  const { focus } = parseArgs();

  const timestamp = getTimestamp();
  const outDir = join(ROOT, 'campaigns', timestamp);
  mkdirSync(outDir, { recursive: true });
  log(`Output folder: campaigns/${timestamp}/`);
  if (focus) log(`Topic focus: "${focus}"`);

  // Copy generation (async, Claude API)
  const copy = await generateCopy(focus);

  // ---- Copy ----------------------------------------------------------------
  writeFileSync(join(outDir, 'copy.json'), JSON.stringify(copy, null, 2), 'utf8');
  log('Saved copy.json');

  writeFileSync(join(outDir, 'copy.md'), buildMarkdown(copy, timestamp, focus), 'utf8');
  log('Saved copy.md');

  // ---- Images — Nano Banana writes files directly to outDir ----------------
  generateImages(outDir);
  log('Saved square-1.png (1:1, concept A)');
  log('Saved square-2.png (1:1, concept B)');
  log('Saved portrait-1.png (9:16, concept A)');
  log('Saved portrait-2.png (9:16, concept B)');

  // ---- README --------------------------------------------------------------
  writeFileSync(join(outDir, 'README.md'), buildReadme(timestamp), 'utf8');
  log('Saved README.md');

  log('');
  log(`Done! Review your assets in: campaigns/${timestamp}/`);
}

main().catch((err) => {
  console.error(`[generate-campaign] Fatal: ${err.message}`);
  process.exit(1);
});
