# AI with Michal — public API (partner reference)

This document describes **public** HTTP endpoints you may call from your own website or backend. Other routes under `/api/*` are internal (checkout, webhooks, admin, etc.) and are **not** supported for third-party integration.

**Production base URL:** `https://aiwithmichal.com`

**Authentication:** None. These endpoints do not accept API keys or session cookies.

**Caching:** Responses may be cached for a short period (on the order of a few minutes). If an event disappears from the list shortly after it starts, that is expected.

---

## List upcoming workshops

Returns scheduled public workshops that have not yet started, ordered by start time (earliest first).

### Request

| Item | Value |
|------|--------|
| Method | `GET` |
| URL | `https://aiwithmichal.com/api/workshops/upcoming` |
| Query parameters | None |
| Request body | None |

### CORS (browser usage)

The response includes `Access-Control-Allow-Origin: *`, so you may call this URL from client-side JavaScript on another origin.

For preflight requests, `OPTIONS` is supported and returns `204 No Content` with the same CORS headers.

### Response

**Status:** `200 OK`

**Content-Type:** `application/json`

**Body:** an object with a single array field `workshops`.

Each element describes one upcoming event:

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Stable identifier for the event (used in our URLs). |
| `name` | string | Human-readable workshop title. |
| `hostName` | string | Host name (currently always `Michal Juhas`). |
| `form` | string | Delivery format (currently always `Online`). |
| `thumbnailUrl` | string | Absolute URL to a promotional image suitable for listings. |
| `date` | string | Event date as shown to attendees (plain text, e.g. `April 16, 2026`). |
| `time` | string | Event time range in **Central European Time**, labeled as **CET** in the string (e.g. `4:00 PM – 5:30 PM CET`). |
| `url` | string | Absolute URL to the public event page on aiwithmichal.com. |

### Example response

```json
{
  "workshops": [
    {
      "slug": "2026-04-16-ai-in-recruiting",
      "name": "AI in Recruiting and Talent Acquisition",
      "hostName": "Michal Juhas",
      "form": "Online",
      "thumbnailUrl": "https://aiwithmichal.com/workshop-og.jpeg",
      "date": "April 16, 2026",
      "time": "4:00 PM – 5:30 PM CET",
      "url": "https://aiwithmichal.com/workshops/2026-04-16-ai-in-recruiting"
    }
  ]
}
```

When there are no upcoming workshops, `workshops` is an empty array:

```json
{
  "workshops": []
}
```

### Notes for implementers

- **Canonical links:** `url` and `thumbnailUrl` always use the production hostname `https://aiwithmichal.com`, even when the API itself is requested from another host (for example a staging or regional deployment URL).
- **Empty list:** Plan for `workshops` to be `[]` between seasons or after the last scheduled event.
- **Stability:** Field names and the overall JSON shape are intended to remain stable. New optional fields may be added without breaking well-behaved clients.
- **Thumbnails:** Today all listed events may share the same `thumbnailUrl`. Per-event images could be introduced later without changing required fields.
- **Time zones:** Use the `time` string as provided for display; do not assume UTC. Our public copy uses the **CET** label consistently.

---

## Support

For integration questions or to report incorrect data, contact the AI with Michal team using the contact details on [aiwithmichal.com](https://aiwithmichal.com).
