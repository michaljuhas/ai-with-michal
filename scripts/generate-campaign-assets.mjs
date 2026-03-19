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

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
// Image generation — gemini-3.1-flash-image-preview (generateContent)
// ---------------------------------------------------------------------------

const IMAGE_PROMPTS = {
  conceptA: {
    square: `Square 1:1 format. Photorealistic digital art for a Facebook ad.
A confident HR professional at a sleek modern desk looks at a holographic display
showing an AI-powered talent graph — glowing nodes connected by light-blue lines
representing candidates from diverse sources. Warm office background, soft studio
lighting, blue-purple gradient accent colours. Clean, premium feel. No text, no logos.`,
    portrait: `Tall portrait 9:16 format. Photorealistic digital art for a Facebook/Instagram story ad.
A confident HR professional at a sleek modern desk looks at a holographic display
showing an AI-powered talent graph — glowing nodes connected by light-blue lines
representing candidates from diverse sources. Warm office background, soft studio
lighting, blue-purple gradient accent colours. Clean, premium feel. No text, no logos.`,
  },
  conceptB: {
    square: `Square 1:1 format. Abstract tech illustration for an Instagram ad.
A luminous network of interconnected human silhouettes floats against a deep navy background.
Golden and cyan connection lines pulse outward from a central AI brain icon.
The overall shape suggests a talent pool being discovered outside traditional platforms.
Minimalist, modern, aspirational. No text, no logos.`,
    portrait: `Tall portrait 9:16 format. Abstract tech illustration for an Instagram story ad.
A luminous network of interconnected human silhouettes floats against a deep navy background.
Golden and cyan connection lines pulse outward from a central AI brain icon.
The overall shape suggests a talent pool being discovered outside traditional platforms.
Minimalist, modern, aspirational. No text, no logos.`,
  },
};

async function generateImage(prompt, aspectRatio) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          // aspectRatio hint in the prompt itself; Gemini image models don't accept
          // an aspectRatio parameter — include it in the text prompt instead.
        },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini image API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));
  if (!imagePart) {
    throw new Error(`No image returned. Response: ${JSON.stringify(data)}`);
  }
  return Buffer.from(imagePart.inlineData.data, 'base64');
}

async function generateImages() {
  log('Generating 4 images via gemini-3.1-flash-image-preview (square × 2, portrait × 2)...');

  // Run all 4 in parallel; aspect ratio is embedded in each prompt
  const [square1, square2, portrait1, portrait2] = await Promise.all([
    generateImage(IMAGE_PROMPTS.conceptA.square),
    generateImage(IMAGE_PROMPTS.conceptB.square),
    generateImage(IMAGE_PROMPTS.conceptA.portrait),
    generateImage(IMAGE_PROMPTS.conceptB.portrait),
  ]);

  return { square1, square2, portrait1, portrait2 };
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
  if (!GEMINI_API_KEY) {
    console.error('[generate-campaign] Error: GEMINI_API_KEY not set in environment.');
    process.exit(1);
  }

  const { focus } = parseArgs();

  const timestamp = getTimestamp();
  const outDir = join(ROOT, 'campaigns', timestamp);
  mkdirSync(outDir, { recursive: true });
  log(`Output folder: campaigns/${timestamp}/`);
  if (focus) log(`Topic focus: "${focus}"`);

  // Run copy and image generation in parallel
  const [copy, images] = await Promise.all([
    generateCopy(focus),
    generateImages(),
  ]);

  // ---- Copy ----------------------------------------------------------------
  writeFileSync(join(outDir, 'copy.json'), JSON.stringify(copy, null, 2), 'utf8');
  log('Saved copy.json');

  writeFileSync(join(outDir, 'copy.md'), buildMarkdown(copy, timestamp, focus), 'utf8');
  log('Saved copy.md');

  // ---- Images --------------------------------------------------------------
  writeFileSync(join(outDir, 'square-1.png'), images.square1);
  log('Saved square-1.png (1:1, concept A)');

  writeFileSync(join(outDir, 'square-2.png'), images.square2);
  log('Saved square-2.png (1:1, concept B)');

  writeFileSync(join(outDir, 'portrait-1.png'), images.portrait1);
  log('Saved portrait-1.png (9:16, concept A)');

  writeFileSync(join(outDir, 'portrait-2.png'), images.portrait2);
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
