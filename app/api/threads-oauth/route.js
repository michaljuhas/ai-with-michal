import { NextResponse } from "next/server";

/**
 * Threads OAuth callback — displays the authorization code so you can
 * paste it into the threads-oauth.mjs script.
 *
 * Register this URL in Meta App Dashboard → Threads API → Redirect URIs:
 *   https://aiwithmichal.com/api/threads-oauth
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  if (error) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:monospace;padding:2rem;max-width:600px">
        <h2 style="color:#c00">Authorization failed</h2>
        <p><strong>${error}</strong></p>
        <p>${errorDesc ?? ""}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  if (!code) {
    return new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:monospace;padding:2rem">
        <p>No code received.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  return new NextResponse(
    `<!DOCTYPE html><html><head><title>Threads OAuth</title></head>
    <body style="font-family:monospace;padding:2rem;max-width:640px">
      <h2>Authorization successful</h2>
      <p>Copy the code below and paste it into the terminal:</p>
      <textarea id="code" readonly rows="4"
        style="width:100%;font-size:0.85rem;padding:0.5rem;border:1px solid #ccc;border-radius:4px;background:#f5f5f5"
      >${code}</textarea>
      <br><br>
      <button onclick="navigator.clipboard.writeText(document.getElementById('code').value).then(()=>this.textContent='Copied!')"
        style="padding:0.5rem 1rem;font-size:1rem;cursor:pointer">
        Copy code
      </button>
      <p style="color:#666;font-size:0.85rem;margin-top:1.5rem">
        You can close this tab after copying.
      </p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}
