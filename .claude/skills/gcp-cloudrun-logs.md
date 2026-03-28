---
name: gcp-cloudrun-logs
description: Use when the user wants to analyze GCP Cloud Run logs, investigate errors, identify patterns, or get improvement suggestions based on Cloud Run service logs. Trigger on: "check logs", "Cloud Run errors", "what's failing", "analyze logs", "gcp logs".
---

# GCP Cloud Run Log Analyzer

Fetch, triage, and analyze Cloud Run logs using `gcloud logging read`. After fetching, identify error patterns and propose concrete fixes.

## Prerequisites

```bash
# Verify auth is active
gcloud auth list

# If tokens are expired, re-authenticate
gcloud auth login

# Confirm active project
gcloud config get-value project
# Expected: ai-with-michal
```

## Fetch logs — most common commands

```bash
# All errors from ALL Cloud Run services (last 1h)
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR' \
  --freshness=1h \
  --format=json \
  --limit=100 \
  --project=ai-with-michal

# Errors from a specific service
gcloud logging read \
  'resource.type="cloud_run_revision" resource.labels.service_name="SERVICE_NAME" severity>=ERROR' \
  --freshness=1h \
  --format=json \
  --limit=100 \
  --project=ai-with-michal

# Wider time window (e.g. last 24h)
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR' \
  --freshness=24h \
  --format=json \
  --limit=200 \
  --project=ai-with-michal

# Include WARNINGs too
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=WARNING' \
  --freshness=6h \
  --format=json \
  --limit=200 \
  --project=ai-with-michal

# List all Cloud Run services first (to get service names)
gcloud run services list \
  --platform=managed \
  --project=ai-with-michal \
  --format="table(SERVICE,REGION,URL)"
```

## Parse logs into a readable summary

```bash
# Extract key fields: timestamp, service, severity, message
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR' \
  --freshness=1h \
  --format=json \
  --limit=100 \
  --project=ai-with-michal \
| python3 -c "
import json, sys
entries = json.load(sys.stdin)
for e in entries:
    ts = e.get('timestamp','')[:19]
    svc = e.get('resource',{}).get('labels',{}).get('service_name','?')
    rev = e.get('resource',{}).get('labels',{}).get('revision_name','?')
    sev = e.get('severity','?')
    payload = e.get('textPayload') or e.get('jsonPayload',{})
    if isinstance(payload, dict):
        msg = payload.get('message') or payload.get('msg') or json.dumps(payload)[:200]
    else:
        msg = str(payload)[:200]
    print(f'[{ts}] [{sev}] {svc}/{rev}: {msg}')
"
```

## Triage workflow

When the user asks to analyze Cloud Run logs, follow these steps:

1. **List services** — run `gcloud run services list` to know what's deployed
2. **Fetch recent errors** — default to last 1h; widen to 6h or 24h if sparse
3. **Parse and group** — identify repeated messages, unique errors, and affected services
4. **Count by pattern** — group identical/similar errors to find the most frequent
5. **Propose fixes** — for each distinct error pattern, suggest a concrete action

```bash
# Quick error frequency count
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR' \
  --freshness=6h \
  --format=json \
  --limit=500 \
  --project=ai-with-michal \
| python3 -c "
import json, sys
from collections import Counter
entries = json.load(sys.stdin)
msgs = []
for e in entries:
    payload = e.get('textPayload') or e.get('jsonPayload',{})
    if isinstance(payload, dict):
        msg = payload.get('message') or payload.get('msg') or ''
    else:
        msg = str(payload)
    # Truncate to first 120 chars to group similar messages
    msgs.append(msg[:120].strip())
for msg, count in Counter(msgs).most_common(20):
    print(f'{count:4d}x  {msg}')
"
```

## Gotcha: empty `{}` payloads in error entries

Cloud Run writes two separate log streams:
- `run.googleapis.com/requests` — HTTP request logs (status, latency, IP). These get `severity=ERROR` for 5xx responses but have **no text payload** — the message body is `{}`.
- `run.googleapis.com/stderr` (or stdout) — application logs from `console.error` / `console.log`. These carry the actual error message.

When you see `5x {}` errors, fetch the stderr stream for the same time window to get the real message:

```bash
gcloud logging read \
  'resource.type="cloud_run_revision" logName="projects/ai-with-michal/logs/run.googleapis.com%2Fstderr" timestamp>="2026-03-27T07:40:00Z" timestamp<="2026-03-27T09:30:00Z"' \
  --format=json --limit=200 --project=ai-with-michal \
| python3 -c "
import json,sys
for e in json.load(sys.stdin):
    p = e.get('textPayload','') or str(e.get('jsonPayload',''))
    if p:
        print(e['timestamp'][:19], p[:300])
"
```

## Common error patterns and what to do

| Error pattern | Likely cause | Fix |
|---|---|---|
| `SIGTERM` / `signal: terminated` | Container killed (OOM or scale-down) | Check memory limits; add graceful shutdown handler |
| `memory limit exceeded` | Container OOM | Increase memory in Cloud Run service settings |
| `connection refused` / `ECONNREFUSED` | Downstream service unreachable | Check env vars, VPC connector, target service health |
| `DEADLINE_EXCEEDED` | Request timeout | Increase Cloud Run request timeout; optimize slow operations |
| `PERMISSION_DENIED` | Missing IAM role on service account | Grant the required role to the Cloud Run service account |
| `no such file or directory` | Missing file in container image | Verify Dockerfile COPY paths; rebuild and redeploy |
| `invalid character` in JSON | Malformed JSON input or response | Add input validation; log raw body before parsing |
| `too many connections` | DB connection pool exhausted | Use connection pooling (e.g. Cloud SQL Proxy, PgBouncer) |
| `502 Bad Gateway` | Container crashed or port mismatch | Check `PORT` env var matches what the app listens on |
| `Cannot read properties of undefined` | JS null/undefined access | Add null checks; validate API responses before use |

## Output format

After analyzing, present:

```
## Cloud Run Log Summary — <time window>

### Services with errors
- service-name: N errors

### Top error patterns
1. (42x) <error message> → <proposed fix>
2. (17x) <error message> → <proposed fix>
...

### Recommended actions
- [ ] Action 1
- [ ] Action 2
```

## Advanced filters

```bash
# Logs for a specific revision
gcloud logging read \
  'resource.type="cloud_run_revision" resource.labels.revision_name="SERVICE-NAME-00005-xyz"' \
  --freshness=1h --format=json --limit=50 --project=ai-with-michal

# HTTP 5xx errors only (from request logs)
gcloud logging read \
  'resource.type="cloud_run_revision" httpRequest.status>=500' \
  --freshness=6h --format=json --limit=100 --project=ai-with-michal

# Logs containing a specific string
gcloud logging read \
  'resource.type="cloud_run_revision" textPayload:"OutOfMemoryError"' \
  --freshness=24h --format=json --limit=50 --project=ai-with-michal

# Logs between specific timestamps
gcloud logging read \
  'resource.type="cloud_run_revision" severity>=ERROR timestamp>="2026-03-28T00:00:00Z" timestamp<="2026-03-28T12:00:00Z"' \
  --format=json --limit=200 --project=ai-with-michal
```
