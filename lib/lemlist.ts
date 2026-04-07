const BASE_URL = "https://api.lemlist.com/api";

function authHeader(): string {
  const apiKey = process.env.LEMLIST_API_KEY;
  if (!apiKey) throw new Error("LEMLIST_API_KEY is not set");
  return "Basic " + Buffer.from(":" + apiKey).toString("base64");
}

async function request(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  query?: Record<string, string>,
): Promise<unknown> {
  const params = new URLSearchParams(query);
  const qs = params.toString();
  const url = BASE_URL + path + (qs ? "?" + qs : "");

  const headers: Record<string, string> = {
    Authorization: authHeader(),
  };

  const init: RequestInit = { method, headers };

  if (body && ["POST", "PATCH", "PUT"].includes(method)) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  let response = await fetch(url, init);

  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    const waitMs = retryAfter ? parseFloat(retryAfter) * 1000 : 1000;
    await new Promise((r) => setTimeout(r, waitMs));
    response = await fetch(url, init);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Lemlist API error ${response.status}: ${text}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export type LemlistLeadData = {
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  jobTitle?: string;
  // Custom fields for B2B context
  interestType?: string;
  services?: string;
};

/**
 * Adds a lead to a LemList campaign. Uses deduplicate=true so re-submitting
 * the same email is a no-op rather than an error.
 */
export async function addLeadToCampaign(
  campaignId: string,
  lead: LemlistLeadData,
): Promise<void> {
  await request(
    "POST",
    `/campaigns/${campaignId}/leads`,
    lead,
    { deduplicate: "true" },
  );
}

/**
 * Resolves the correct inbound campaign ID for a given interest type.
 * Returns null (and logs a warning) if the env var is not configured —
 * this keeps the route working even before campaigns are set up in LemList.
 */
export function inboundCampaignId(
  interestType: "workshop" | "integration" | "contact",
): string | null {
  const envKey =
    interestType === "workshop"
      ? "LEMLIST_INBOUND_WORKSHOP_CAMPAIGN_ID"
      : interestType === "integration"
        ? "LEMLIST_INBOUND_INTEGRATION_CAMPAIGN_ID"
        : "LEMLIST_INBOUND_CONTACT_CAMPAIGN_ID";
  const id = process.env[envKey];

  if (!id) {
    const hint =
      interestType === "contact"
        ? "Set LEMLIST_INBOUND_CONTACT_CAMPAIGN_ID to enable syncing."
        : `Set LEMLIST_INBOUND_${interestType.toUpperCase()}_CAMPAIGN_ID to enable syncing.`;
    console.warn(`[lemlist] No campaign ID configured for interest_type="${interestType}". ${hint}`);
    return null;
  }

  return id;
}
