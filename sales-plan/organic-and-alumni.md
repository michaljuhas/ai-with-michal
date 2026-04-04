# LinkedIn (organic) & alumni offers

## LinkedIn — free posts

- **Cadence:** about **2–3 posts per week** while tickets are on sale; when **multiple workshops** are live, rotate so each gets visibility (do not only push the nearest date).
- **Angles:** specific outcome, time zone / “live online”, social proof, one clear CTA with the **correct** ticket URL.
- **Links:** always point to `https://aiwithmichal.com/workshops/<slug>/tickets?ref=linkedin` for the workshop you are promoting.
- **Creative:** reuse hooks from latest `campaigns/*/copy.md` where helpful; keep tone consistent with Meta but avoid duplicating the same post twice the same day.

## Alumni — 50% off upcoming workshops

- **Mechanism:** Stripe **coupon** or **promotion code** (50% off). Checkout already allows promotion codes.
- **Audience:** anyone who **paid** for a **previous** workshop (e.g. Apr 2 series or earlier). Do **not** post alumni codes on public ads or LinkedIn.
- **Delivery:** personal email or DM with the code, the **exact** ticket URL for the target event, and expiry rules you set in Stripe.
- **Operations:** create or duplicate a coupon per event if you want clean reporting; track redemptions in Stripe dashboard.

## Tracking

- Append `?ref=<source>` to any shared link (PostHog picks up `ref`).
- Compare organic lift with `status.mjs` / `stripe-report.mjs` **per `workshop_slug`** after pushes.
