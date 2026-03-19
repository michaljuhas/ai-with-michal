<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 16.2 App Router project. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) with exception capture and a reverse proxy through `/ingest` to route events via the EU PostHog infrastructure. A server-side `posthog-node` client in `lib/posthog-server.ts` handles API route tracking. Users are identified using their Clerk user ID — client-side on the tickets page, and correlated server-side via the same Clerk ID in both API routes.

| Event | Description | File |
|---|---|---|
| `register_button_clicked` | User clicked a Register / Reserve Your Seat CTA (any location on the page) | `components/RegisterButton.tsx` |
| `ticket_tier_viewed` | User landed on the tickets page and saw available ticket options (top of funnel) | `app/tickets/page.tsx` |
| `checkout_initiated` | User clicked a purchase button; includes `tier`, `price`, `name` properties | `app/tickets/page.tsx` |
| `checkout_error` | Checkout API call failed or returned no URL; includes `tier`, `reason` properties | `app/tickets/page.tsx` |
| `checkout_session_created` | Server-side: Stripe checkout session created; includes `tier`, `stripe_session_id`, `email` | `app/api/checkout/route.ts` |
| `payment_completed` | Server-side: Stripe webhook confirmed payment and order written to DB; includes `tier`, `amount_eur`, `stripe_session_id` | `app/api/webhooks/stripe/route.ts` |
| `calendar_added` | User added the workshop to their calendar; includes `provider` (google / outlook / ics) | `app/thank-you/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/143983/dashboard/576744
- **Purchase Conversion Funnel** (ticket view → checkout initiated → session created → payment completed): https://eu.posthog.com/project/143983/insights/IpYhtzEY
- **Key Events Trend** (register clicks, ticket views, payments over time): https://eu.posthog.com/project/143983/insights/tUSLKPAx
- **Checkout Errors vs Initiated** (spot checkout reliability issues): https://eu.posthog.com/project/143983/insights/xgoFXwMR
- **Calendar Adds by Provider** (Google vs Outlook vs ICS breakdown): https://eu.posthog.com/project/143983/insights/NfMGrsO6

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
