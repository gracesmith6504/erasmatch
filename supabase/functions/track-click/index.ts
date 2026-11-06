import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.112.3"

/**
 * Server-side affiliate click tracker.
 *
 * Flow:
 *   1. Client links to /functions/v1/track-click?partner=airalo&url=...&placement=city_landing
 *   2. This function logs the click to the affiliate_clicks table
 *   3. Responds with a 302 redirect to the destination URL (with UTM params appended)
 *
 * Because the click routes through our server, it's tracked even when
 * PostHog is blocked by ad blockers or cookie consent.
 */

const UTM_SOURCE = "erasmatch"

/** Length caps so a public endpoint can't stuff huge strings into the table. */
const MAX_FIELD_LEN = 200
const MAX_URL_LEN = 2000

/** Trim + truncate an optional query param; empty becomes undefined. */
function cap(value: string | null, max = MAX_FIELD_LEN): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, max)
}

const SAFE_PROTOCOLS = new Set(["http:", "https:"])

/** Allowed partner slugs — reject anything else to prevent open redirect. */
const ALLOWED_PARTNERS = new Set([
  "airalo",
])

/** Known partner domain allowlist — the redirect URL must match. */
const ALLOWED_DOMAINS: Record<string, string[]> = {
  airalo: ["airalo.pxf.io", "www.airalo.com", "airalo.com"],
}

function buildRedirectUrl(
  url: string,
  partner: string,
  placement: string,
  city?: string,
  campaign?: string,
): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null

  // Verify domain is in the partner's allowlist
  const allowed = ALLOWED_DOMAINS[partner]
  if (allowed && !allowed.includes(parsed.hostname)) return null

  // Append UTM params without clobbering existing ones
  const utms: Record<string, string> = {
    utm_source: UTM_SOURCE,
    utm_medium: "referral",
    utm_campaign: campaign ?? `${partner}_${placement}`,
    utm_content: city ?? placement,
  }

  for (const [key, value] of Object.entries(utms)) {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value)
  }

  return parsed.toString()
}

serve(async (req) => {
  // Only GET — this is a redirect endpoint
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 })
  }

  const params = new URL(req.url).searchParams
  const partner = cap(params.get("partner"))
  const rawUrl = params.get("url")
  const placement = cap(params.get("placement")) ?? "unknown"
  const city = cap(params.get("city"))
  const category = cap(params.get("category"))
  const campaign = cap(params.get("campaign"))

  if (!partner || !rawUrl) {
    return new Response("Missing partner or url", { status: 400 })
  }

  // Reject (rather than truncate) over-long URLs: truncating would change the
  // redirect target.
  if (rawUrl.length > MAX_URL_LEN) {
    return new Response("URL too long", { status: 400 })
  }
  const url = rawUrl

  if (!ALLOWED_PARTNERS.has(partner)) {
    return new Response("Unknown partner", { status: 400 })
  }

  const redirectUrl = buildRedirectUrl(url, partner, placement, city, campaign)
  if (!redirectUrl) {
    return new Response("Invalid or disallowed URL", { status: 400 })
  }

  // Log the click — best-effort, don't block the redirect
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, serviceKey)

    // Attribute the click to a user ONLY via a verified bearer token.
    // There is intentionally no `uid` query param: it let anyone attribute
    // clicks to arbitrary user IDs. Normal browser link clicks send no
    // Authorization header, so these rows are anonymous (user_id = null).
    let userId: string | null = null
    const authHeader = req.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id ?? null
    }

    await supabase.from("affiliate_clicks").insert({
      user_id: userId,
      partner,
      placement,
      city: city ?? null,
      category: category ?? null,
      campaign: campaign ?? null,
      destination_url: url,
    })
  } catch (err) {
    // Log but don't block — the redirect is more important than the tracking
    console.error("Failed to log affiliate click:", err)
  }

  // 302 redirect to the partner
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      "Cache-Control": "no-store",
    },
  })
})
