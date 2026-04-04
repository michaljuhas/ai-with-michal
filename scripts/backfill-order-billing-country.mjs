#!/usr/bin/env node
/**
 * Backfill orders.billing_country_code from Stripe Checkout Sessions.
 * Usage: node --env-file=.env scripts/backfill-order-billing-country.mjs [--dry-run] [--delay-ms=100]
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function normalizeBillingCountryCode(raw) {
  if (!raw || typeof raw !== "string") return null;
  const c = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : null;
}

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  let delayMs = 0;
  for (const a of process.argv) {
    const m = a.match(/^--delay-ms=(\d+)$/);
    if (m) delayMs = parseInt(m[1], 10);
  }
  return { dryRun, delayMs };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { dryRun, delayMs } = parseArgs();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!stripeKey) {
    console.error("Missing STRIPE_SECRET_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const stripe = new Stripe(stripeKey);

  const { data: rows, error: qErr } = await supabase
    .from("orders")
    .select("id, stripe_session_id")
    .eq("status", "paid")
    .is("billing_country_code", null)
    .not("stripe_session_id", "is", null);

  if (qErr) {
    console.error("Supabase query error:", qErr);
    process.exit(1);
  }

  const list = rows ?? [];
  console.log(`Found ${list.length} paid order(s) without billing_country_code.\n`);
  if (dryRun) console.log("(dry-run: no updates will be written)\n");

  let updated = 0;
  let skippedNoCountry = 0;
  let errors = 0;

  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    const sid = row.stripe_session_id;
    try {
      const session = await stripe.checkout.sessions.retrieve(sid);
      const code = normalizeBillingCountryCode(
        session.customer_details?.address?.country
      );
      if (!code) {
        skippedNoCountry += 1;
        console.log(`[skip] ${row.id} session=${sid} — no ISO country on session`);
      } else if (dryRun) {
        console.log(`[dry-run] ${row.id} → ${code}`);
        updated += 1;
      } else {
        const { error: uErr } = await supabase
          .from("orders")
          .update({ billing_country_code: code })
          .eq("id", row.id);
        if (uErr) {
          errors += 1;
          console.error(`[error] ${row.id}:`, uErr.message);
        } else {
          updated += 1;
          console.log(`[ok] ${row.id} → ${code}`);
        }
      }
    } catch (e) {
      errors += 1;
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[error] ${row.id} session=${sid}:`, msg);
    }
    if (delayMs > 0 && i < list.length - 1) await sleep(delayMs);
  }

  console.log("\n---");
  console.log(
    dryRun
      ? `Would update: ${updated} (dry-run); skipped (no country): ${skippedNoCountry}; errors: ${errors}`
      : `Updated: ${updated}; skipped (no country): ${skippedNoCountry}; errors: ${errors}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
