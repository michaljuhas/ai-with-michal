---
name: stripe-cli
description: Use when the user wants to interact with the Stripe API from the CLI — list customers, create payment intents, manage subscriptions, products, prices, invoices, refunds, events, or webhook endpoints using the local stripe-cli wrapper.
---

# stripe-cli

A lightweight CLI wrapper for the Stripe API built in this project at `/Users/michaljuhas/Projects/ai-with-michal/stripe-cli/`.

## Setup

```bash
# Install dependencies (first time only)
cd stripe-cli && npm install

# Build TypeScript
cd stripe-cli && npm run build

# Run tests
cd stripe-cli && npm test
```

Set your API key:
```bash
export STRIPE_API_KEY=sk_test_...
```

Or add to `~/.stripe-cli-wrapper/config.toml`:
```toml
[stripe]
api_key = "sk_test_..."
```

## Running the CLI

```bash
node stripe-cli/dist/cli.js [global-options] <resource> <operation> [flags]
```

**Global options:**

| Flag | Description | Default |
|------|-------------|---------|
| `--api-key <key>` | Override STRIPE_API_KEY | env/config |
| `--live` | Use live mode | false (test) |
| `--format <format>` | `json` or `table` | `json` |

---

## Customers

```bash
# Create
node stripe-cli/dist/cli.js customers create --email user@example.com --name "Jane Doe"

# Retrieve
node stripe-cli/dist/cli.js customers retrieve cus_xxx

# Update
node stripe-cli/dist/cli.js customers update cus_xxx --name "Jane Smith"

# Delete
node stripe-cli/dist/cli.js customers delete cus_xxx

# List
node stripe-cli/dist/cli.js customers list --limit 10
node stripe-cli/dist/cli.js customers list --limit 10 --starting-after cus_yyy

# Search
node stripe-cli/dist/cli.js customers search --query "email:'user@example.com'"
```

## Payment Intents

```bash
# Create (amount in cents)
node stripe-cli/dist/cli.js payment-intents create --amount 2000 --currency usd --customer cus_xxx

# Retrieve
node stripe-cli/dist/cli.js payment-intents retrieve pi_xxx

# Update
node stripe-cli/dist/cli.js payment-intents update pi_xxx --data '{"description":"Updated"}'

# List
node stripe-cli/dist/cli.js payment-intents list --limit 5

# Confirm
node stripe-cli/dist/cli.js payment-intents confirm pi_xxx

# Capture
node stripe-cli/dist/cli.js payment-intents capture pi_xxx

# Cancel
node stripe-cli/dist/cli.js payment-intents cancel pi_xxx

# Search
node stripe-cli/dist/cli.js payment-intents search --query "status:'succeeded'"
```

## Charges (read + capture only — no create)

```bash
node stripe-cli/dist/cli.js charges retrieve ch_xxx
node stripe-cli/dist/cli.js charges list --limit 10
node stripe-cli/dist/cli.js charges capture ch_xxx
node stripe-cli/dist/cli.js charges search --query "amount>1000"
```

Note: Charges cannot be created directly. Use `payment-intents` instead.

## Subscriptions

```bash
# Create (use --data for items array)
node stripe-cli/dist/cli.js subscriptions create --customer cus_xxx --data '{"items":[{"price":"price_xxx"}]}'

# Retrieve / List / Cancel
node stripe-cli/dist/cli.js subscriptions retrieve sub_xxx
node stripe-cli/dist/cli.js subscriptions list --customer cus_xxx
node stripe-cli/dist/cli.js subscriptions cancel sub_xxx

# Update
node stripe-cli/dist/cli.js subscriptions update sub_xxx --data '{"cancel_at_period_end":true}'

# Resume
node stripe-cli/dist/cli.js subscriptions resume sub_xxx --billing-cycle-anchor now

# Search
node stripe-cli/dist/cli.js subscriptions search --query "status:'active'"
```

## Products

```bash
node stripe-cli/dist/cli.js products create --name "Pro Plan" --description "Professional tier"
node stripe-cli/dist/cli.js products retrieve prod_xxx
node stripe-cli/dist/cli.js products update prod_xxx --name "Pro Plan v2"
node stripe-cli/dist/cli.js products delete prod_xxx
node stripe-cli/dist/cli.js products list --active true
node stripe-cli/dist/cli.js products search --query "name~'Pro'"
```

## Prices (no delete — use deactivate)

```bash
# Create recurring
node stripe-cli/dist/cli.js prices create --currency usd --unit-amount 2999 --product prod_xxx --recurring-interval month

# Create one-time
node stripe-cli/dist/cli.js prices create --currency usd --unit-amount 4999 --product prod_xxx

# Retrieve / List
node stripe-cli/dist/cli.js prices retrieve price_xxx
node stripe-cli/dist/cli.js prices list --product prod_xxx --active true

# Deactivate (prices cannot be deleted)
node stripe-cli/dist/cli.js prices deactivate price_xxx

# Search
node stripe-cli/dist/cli.js prices search --query "product:'prod_xxx'"
```

## Invoices

```bash
# Create draft
node stripe-cli/dist/cli.js invoices create --customer cus_xxx

# Retrieve / List
node stripe-cli/dist/cli.js invoices retrieve in_xxx
node stripe-cli/dist/cli.js invoices list --customer cus_xxx --status draft

# Update / Delete (drafts only)
node stripe-cli/dist/cli.js invoices update in_xxx --description "Q1 Invoice"
node stripe-cli/dist/cli.js invoices delete in_xxx

# Lifecycle
node stripe-cli/dist/cli.js invoices finalize in_xxx
node stripe-cli/dist/cli.js invoices pay in_xxx
node stripe-cli/dist/cli.js invoices send in_xxx
node stripe-cli/dist/cli.js invoices void in_xxx

# Search
node stripe-cli/dist/cli.js invoices search --query "customer:'cus_xxx'"
```

## Refunds

```bash
# Create (partial or full)
node stripe-cli/dist/cli.js refunds create --charge ch_xxx --amount 1000
node stripe-cli/dist/cli.js refunds create --payment-intent pi_xxx

# Retrieve / List / Cancel
node stripe-cli/dist/cli.js refunds retrieve re_xxx
node stripe-cli/dist/cli.js refunds list --charge ch_xxx
node stripe-cli/dist/cli.js refunds cancel re_xxx
```

## Events (read-only)

```bash
node stripe-cli/dist/cli.js events retrieve evt_xxx
node stripe-cli/dist/cli.js events list --limit 10 --type payment_intent.succeeded
node stripe-cli/dist/cli.js events list --data '{"created":{"gte":1700000000}}'
```

## Webhook Endpoints

```bash
# Create (wildcard or specific events)
node stripe-cli/dist/cli.js webhook-endpoints create --url https://example.com/webhook --events "*"
node stripe-cli/dist/cli.js webhook-endpoints create --url https://example.com/webhook --events "payment_intent.succeeded,payment_intent.payment_failed"

# Retrieve / List / Delete
node stripe-cli/dist/cli.js webhook-endpoints retrieve we_xxx
node stripe-cli/dist/cli.js webhook-endpoints list
node stripe-cli/dist/cli.js webhook-endpoints delete we_xxx

# Update
node stripe-cli/dist/cli.js webhook-endpoints update we_xxx --url https://example.com/new-webhook
```

---

## Programmatic API (Node.js / TypeScript)

```typescript
import { StripeCLI } from './stripe-cli/src/index';

const cli = new StripeCLI({ apiKey: process.env.STRIPE_API_KEY });

// List customers
const result = await cli.customers.list({ limit: 10 });

// Create payment intent
const pi = await cli.paymentIntents.create({ amount: 2000, currency: 'usd' });
await cli.paymentIntents.confirm(pi.id);
```

---

## Output Formats

```bash
# Default: pretty JSON (pipeable to jq)
node stripe-cli/dist/cli.js customers list | jq '.data[].email'

# Table format
node stripe-cli/dist/cli.js customers list --format table
```

## Error Handling

Errors print to stderr:
```
[ERROR] type=invalid_request_error code=customer_not_found message=No such customer. param=id
```

Exit code `1` on error, `0` on success.

## Complex Params

Use `--data <json>` for nested or multi-field params:
```bash
node stripe-cli/dist/cli.js customers create --data '{"metadata":{"tier":"enterprise"},"address":{"city":"NYC"}}'
```

Named flags take precedence over `--data` for overlapping keys.
