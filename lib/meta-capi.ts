const PIXEL_ID = "1227582702838805";
const API_VERSION = "v21.0";

interface MetaUserData {
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
  client_ip_address?: string;
  em?: string; // SHA-256 hashed lowercase email
}

interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
}

interface MetaEventPayload {
  event_name: string;
  event_source_url: string;
  event_id?: string; // shared with browser pixel for deduplication
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
}

export async function sendMetaEvent(payload: MetaEventPayload): Promise<void> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!accessToken) return;

  // Strip undefined/empty fields from user_data
  const user_data = Object.fromEntries(
    Object.entries(payload.user_data).filter(([, v]) => v)
  );

  const custom_data = payload.custom_data
    ? Object.fromEntries(Object.entries(payload.custom_data).filter(([, v]) => v != null))
    : undefined;

  const event = {
    event_name: payload.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: payload.event_source_url,
    action_source: "website",
    user_data,
    ...(payload.event_id ? { event_id: payload.event_id } : {}),
    ...(custom_data && Object.keys(custom_data).length ? { custom_data } : {}),
  };

  try {
    await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event], access_token: accessToken }),
      }
    );
  } catch {
    // CAPI is non-critical — never block the main flow
  }
}
