#!/usr/bin/env node
/**
 * LinkedIn DM semi-automation for PDF lead gen
 *
 * Processes 1st connections first (can DM directly), then 2nd/unknown.
 *
 * Workflow per person:
 *   1. Opens their LinkedIn profile in Chrome
 *   2. Press ENTER → opens DM composer, message copied to clipboard
 *   3. Paste message, attach PDF, send
 *   4. Press ENTER → opens post, comment reply copied to clipboard
 *   5. Paste reply, press ENTER → marks done, moves to next
 *
 * Usage:
 *   node scripts/linkedin-dm.mjs                  # 1st connections only (default)
 *   node scripts/linkedin-dm.mjs --all            # all connections incl. 2nd/unknown
 *   node scripts/linkedin-dm.mjs --skip 10        # resume, skip first N pending
 *   node scripts/linkedin-dm.mjs --dry-run        # preview without opening browser
 */

import { execSync } from 'child_process';
import { createReadStream, writeFileSync, readFileSync } from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────
const COMMENTERS_FILE = path.join(ROOT, 'campaigns/2026-03-28-linkedin-sourcing/commenters.json');
const POST_URL = 'https://www.linkedin.com/feed/update/urn:li:activity:7442887485619175424/';
const PDF_URL  = 'https://aiwithmichal.com/sourcing-tools-guide.pdf';
const WORKSHOP_URL = 'https://aiwithmichal.com/tickets';

// ── DM message variations ─────────────────────────────────────────────────────
const DM_MESSAGES = [
  (name) => `Hey ${name.split(' ')[0]}! Here's the sourcing tools guide you asked for 👉 ${PDF_URL}\n\nWould you also like to join the live workshop on Apr 2, Thursday? We'll go hands-on with all of these tools → ${WORKSHOP_URL}`,
  (name) => `Hi ${name.split(' ')[0]}, sending over the PDF as promised 🙌 ${PDF_URL}\n\nBtw — I'm running a live workshop this Thu Apr 2 covering all of this in depth. Would you be interested? ${WORKSHOP_URL}`,
  (name) => `Hey ${name.split(' ')[0]}! Here's the guide 👇\n${PDF_URL}\n\nAlso — would you want to join a live session on Apr 2 (Thu) where we go through all these tools hands-on? ${WORKSHOP_URL}`,
  (name) => `Hi ${name.split(' ')[0]} 👋 PDF is on its way → ${PDF_URL}\n\nWould you also like to join the live workshop on Apr 2? We cover all of this + more in a hands-on format → ${WORKSHOP_URL}`,
  (name) => `Hey ${name.split(' ')[0]}, here's the sourcing tools guide! ${PDF_URL}\n\nAnd if you want to go deeper — I'm hosting a live workshop this Thursday Apr 2. Interested? ${WORKSHOP_URL}`,
  (name) => `Hi ${name.split(' ')[0]}! Sending you the PDF 🎯 ${PDF_URL}\n\nWould you like to join a live workshop on Apr 2 (Thu) where I walk through all of these + show live demos? ${WORKSHOP_URL}`,
  (name) => `Hey ${name.split(' ')[0]}, here you go 👉 ${PDF_URL}\n\nAlso hosting a hands-on workshop this Thu Apr 2 on all of these tools. Want in? ${WORKSHOP_URL}`,
];

// ── Comment reply variations ──────────────────────────────────────────────────
const REPLY_VARIATIONS = [
  'Sent! Check ur DMs 📩',
  'DM sent! 🙌',
  'Just sent it over — check ur inbox 📬',
  'Sent to ur DMs 👌',
  'Check ur DMs! 📥',
  'Sent! 🚀',
  "DM'd u! 📩",
  'Sent it over — check ur msgs 👇',
  'In ur DMs! ✅',
  "Just DM'd u 📬",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN  = args.includes('--dry-run');
const ALL      = args.includes('--all');
const skipIdx  = parseInt(args[args.indexOf('--skip') + 1] || '0', 10) || 0;

function copyToClipboard(text) {
  execSync(`echo ${JSON.stringify(text)} | pbcopy`);
}

function openUrl(url) {
  execSync(`open "${url}"`);
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function saveProgress(commenters) {
  writeFileSync(COMMENTERS_FILE, JSON.stringify(commenters, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const commenters = JSON.parse(readFileSync(COMMENTERS_FILE, 'utf8'));
  // Sort: 1st connections first, then 2nd, then unknown
  const connOrder = { '1st': 0, '2nd': 1, 'unknown': 2 };
  const indexed = commenters.map((c, i) => ({ ...c, _idx: i }));
  const pending = indexed
    .filter(c => c.status === 'pending')
    .filter(c => ALL || c.connection === '1st')
    .sort((a, b) => (connOrder[a.connection] ?? 2) - (connOrder[b.connection] ?? 2))
    .slice(skipIdx);

  const total1st = indexed.filter(c => c.status === 'pending' && c.connection === '1st').length;
  const total2nd = indexed.filter(c => c.status === 'pending' && c.connection === '2nd').length;
  const totalUnk = indexed.filter(c => c.status === 'pending' && !c.connection).length;

  console.log(`\n🎯 LinkedIn DM Semi-Automation`);
  console.log(`   Post: ${POST_URL}`);
  console.log(`   PDF:  ${PDF_URL}`);
  console.log(`   Pending: ${total1st} × 1st  |  ${total2nd} × 2nd  |  ${totalUnk} × unknown`);
  console.log(`   Queue:   ${pending.length} people${ALL ? ' (all)' : ' (1st only — use --all to include 2nd)'}${DRY_RUN ? '  [DRY RUN]' : ''}\n`);
  console.log(`─────────────────────────────────────────────`);
  console.log(`Controls:`);
  console.log(`  ENTER       → proceed to next step`);
  console.log(`  s + ENTER   → skip this person`);
  console.log(`  n + ENTER   → not connected, skip`);
  console.log(`  q + ENTER   → quit and save progress`);
  console.log(`─────────────────────────────────────────────\n`);

  let done = 0;
  let skipped = 0;

  for (const person of pending) {
    const firstName = person.name.split(' ')[0];
    const dmMsg = rand(DM_MESSAGES)(person.name);
    const replyMsg = rand(REPLY_VARIATIONS);

    const connLabel = person.connection ? `${person.connection} connection` : 'unknown connection';
    console.log(`\n[${done + skipped + 1}/${pending.length}] ${person.name}  (${connLabel})`);
    console.log(`   Profile: ${person.url}`);

    if (!DRY_RUN) openUrl(person.url);

    console.log(`\n   ▶ Verify on their profile: is "${person.name}" still a ${connLabel}?`);
    const step1 = await prompt(`   → ENTER=confirmed  n=not connected  s=skip  q=quit  `);

    if (step1 === 'q') {
      console.log('\n💾 Saving progress and quitting...');
      break;
    }
    if (step1 === 's' || step1 === 'n') {
      commenters[person._idx].status = step1 === 'n' ? 'not-connected' : 'skipped';
      saveProgress(commenters);
      skipped++;
      console.log(`   ⏭  Skipped.`);
      continue;
    }

    // Step 2: open DM composer
    if (!DRY_RUN) {
      openUrl(`https://www.linkedin.com/messaging/thread/new/`);
      copyToClipboard(dmMsg);
    }
    console.log(`\n   📋 DM message copied to clipboard!`);
    console.log(`   ▶ In the DM composer: type "${firstName}", select them, paste message, attach PDF from:`);
    console.log(`      /Users/michaljuhas/Projects/ai-with-michal/public/sourcing-tools-guide.pdf`);
    console.log(`   Message preview:\n   ┌─────────────────────────────────────`);
    dmMsg.split('\n').forEach(l => console.log(`   │ ${l}`));
    console.log(`   └─────────────────────────────────────`);

    const step2 = await prompt(`   → Sent DM? ENTER=yes  s=skip  q=quit  `);

    if (step2 === 'q') {
      console.log('\n💾 Saving progress and quitting...');
      break;
    }
    if (step2 === 's') {
      commenters[person._idx].status = 'skipped';
      saveProgress(commenters);
      skipped++;
      continue;
    }

    // Step 3: reply to comment
    if (!DRY_RUN) {
      openUrl(POST_URL);
      copyToClipboard(replyMsg);
    }
    console.log(`\n   📋 Comment reply copied to clipboard!`);
    console.log(`   ▶ Find ${person.name}'s comment on the post and reply with (already in clipboard):`);
    console.log(`   "${replyMsg}"`);

    const step3 = await prompt(`   → Replied to comment? ENTER=yes  s=skip  q=quit  `);

    if (step3 === 'q') {
      console.log('\n💾 Saving progress and quitting...');
      commenters[person._idx].status = 'dm-sent'; // DM was sent at least
      saveProgress(commenters);
      break;
    }

    // Mark done
    commenters[person._idx].status = step3 === 's' ? 'dm-sent' : 'done';
    saveProgress(commenters);
    done++;
    console.log(`   ✅ Done! (${done} completed today)`);
  }

  // Summary
  const allDone = commenters.filter(c => c.status === 'done').length;
  const allPending = commenters.filter(c => c.status === 'pending').length;
  console.log(`\n─────────────────────────────────────────────`);
  console.log(`Session: ${done} sent, ${skipped} skipped`);
  console.log(`Overall: ${allDone} done, ${allPending} still pending`);
  console.log(`─────────────────────────────────────────────\n`);
}

main().catch(console.error);
