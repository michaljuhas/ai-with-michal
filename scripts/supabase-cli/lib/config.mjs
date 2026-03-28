/**
 * Config loading and project ref resolution.
 */

/**
 * Extracts the project ref (subdomain) from a Supabase URL.
 * e.g. "https://xyzabc.supabase.co" → "xyzabc"
 */
export function getProjectRef(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.split('.')[0];
  } catch {
    throw new Error(`Invalid Supabase URL: ${url}`);
  }
}

/**
 * Loads config from environment variables.
 * @param {Record<string,string>} env - defaults to process.env
 */
export function loadConfig(env = process.env) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const pat = env.SUPABASE_PAT ?? null;

  if (!supabaseUrl) throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');

  return {
    supabaseUrl,
    serviceRoleKey,
    pat,
    projectRef: getProjectRef(supabaseUrl),
  };
}
