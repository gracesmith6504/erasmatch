/**
 * Outbound-click tracking for partner and affiliate links.
 *
 * Three layers of attribution work together:
 *   1. **Server-side click tracking** (most reliable): the link routes through
 *      our edge function which logs the click to `affiliate_clicks` before
 *      302-redirecting to the partner. Works even when PostHog is blocked by
 *      ad blockers or cookie consent.
 *   2. **PostHog** (best-effort): client-side event capture. Blocked by ~20-30%
 *      of users (Brave, ad blockers, cookie rejection), so it's a secondary
 *      signal, not the source of truth.
 *   3. **UTM params**: appended to the destination URL so the partner's own
 *      dashboard attributes the resulting sale back to us. The edge function
 *      handles this, so the client doesn't need to.
 *
 * For **email** links, we can't route through the edge function (emails need
 * a direct URL), so `buildOutboundUrl` is still used for that placement.
 */

/** Where the click happened. Keep these stable — they become PostHog filters. */
export type OutboundPlacement =
  | "city_landing"
  | "onboarding_complete"
  | "students_page"
  | "profile"
  | "email"
  | "home";

export type OutboundParams = {
  /** Stable partner slug, e.g. "airalo". Becomes the `partner` property. */
  partner: string;
  /** Destination URL, including any affiliate ref the partner assigned us. */
  url: string;
  /** Where in the product the link was rendered. */
  placement: OutboundPlacement;
  /** Host city of the student clicking, when known. Drives per-city reporting. */
  city?: string | null;
  /** Product category, e.g. "esim", "insurance", "banking". */
  category?: string;
  /** Campaign slug for grouping, e.g. "sept-2026-arrivals". */
  campaign?: string;
};

const UTM_SOURCE = "erasmatch";

/** Schemes allowed to reach an href. Anything else is treated as unsafe. */
const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

/** Supabase project URL — used to build the edge function endpoint. */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

/**
 * Builds a URL that routes through our server-side click tracker.
 *
 * The edge function logs the click to `affiliate_clicks`, appends UTM params,
 * and 302-redirects to the partner URL. Because the click goes through our
 * server first, it's tracked even when PostHog is blocked.
 *
 * Falls back to `buildOutboundUrl` when the Supabase URL isn't configured
 * (e.g. in tests or local dev without env vars).
 */
export const buildServerTrackedUrl = (params: OutboundParams): string | null => {
  const { url, partner, placement, city, category, campaign } = params;

  // Validate the destination URL before building the tracker URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;

  // If Supabase URL isn't available, fall back to direct URL with UTMs
  if (!SUPABASE_URL) return buildOutboundUrl(params);

  const trackerUrl = new URL(`${SUPABASE_URL}/functions/v1/track-click`);
  trackerUrl.searchParams.set("partner", partner);
  trackerUrl.searchParams.set("url", url);
  trackerUrl.searchParams.set("placement", placement);
  if (city) trackerUrl.searchParams.set("city", city);
  if (category) trackerUrl.searchParams.set("category", category);
  if (campaign) trackerUrl.searchParams.set("campaign", campaign);

  return trackerUrl.toString();
};

/**
 * Appends UTM params to a partner URL without clobbering params the partner
 * already put there (affiliate refs frequently live in the query string).
 *
 * Used for **email** links where we can't route through the edge function,
 * and as a fallback when the Supabase URL isn't configured.
 *
 * Returns null when the URL is unparseable or uses a non-web scheme.
 */
export const buildOutboundUrl = (params: OutboundParams): string | null => {
  const { url, partner, placement, city, campaign } = params;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;

  const utms: Record<string, string> = {
    utm_source: UTM_SOURCE,
    utm_medium: placement === "email" ? "email" : "referral",
    utm_campaign: campaign ?? `${partner}_${placement}`,
    utm_content: city ? slugify(city) : placement,
  };

  for (const [key, value] of Object.entries(utms)) {
    if (!parsed.searchParams.has(key)) parsed.searchParams.set(key, value);
  }

  return parsed.toString();
};

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

/**
 * Records an outbound partner click in PostHog.
 *
 * Best-effort — blocked by ~20-30% of users. The server-side tracker
 * is the reliable source of truth; this is a secondary signal that
 * enriches PostHog funnels and session recordings.
 */
export const trackOutboundClick = (params: OutboundParams): void => {
  const { partner, placement, city, category, campaign, url } = params;

  let host: string | undefined;
  try {
    host = new URL(url).hostname;
  } catch {
    host = undefined;
  }

  window.posthog?.capture("outbound_link_clicked", {
    partner,
    placement,
    category,
    campaign,
    city: city ?? undefined,
    destination_host: host,
  });
};

/**
 * Returns the href and click handler for an outbound partner link.
 *
 * For web placements, the href routes through the server-side click tracker
 * (edge function) which logs the click reliably and 302-redirects to the
 * partner. PostHog is still fired as a best-effort secondary signal.
 *
 * For email placements, the href is a direct partner URL with UTM params
 * (emails can't route through edge functions).
 *
 * Usage:
 *   const link = useOutboundLink({ partner: "airalo", url: AIRALO_URL,
 *                                  placement: "city_landing", city: "Granada" });
 *   <a {...link}>Get a data plan</a>
 */
export const useOutboundLink = (params: OutboundParams) => {
  // Email links go directly to the partner (can't route through edge function)
  // Web links route through the server-side click tracker
  const href =
    params.placement === "email"
      ? buildOutboundUrl(params)
      : buildServerTrackedUrl(params);

  return {
    // An anchor without an href is inert, which is the right failure mode for
    // a URL we have rejected as unsafe.
    href: href ?? undefined,
    target: "_blank" as const,
    // noopener/noreferrer is the safe default; some affiliate programmes need
    // the referrer to attribute, in which case drop "noreferrer" for that
    // partner.
    rel: "noopener noreferrer sponsored",
    // Fire PostHog as a secondary signal — the server-side tracker is the
    // reliable source of truth, but PostHog enriches session recordings.
    onClick: href ? () => trackOutboundClick(params) : undefined,
  };
};
