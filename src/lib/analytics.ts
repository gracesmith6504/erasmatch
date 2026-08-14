/**
 * Outbound-click tracking for partner and affiliate links.
 *
 * Two things have to line up for affiliate revenue to be attributable:
 *   1. PostHog records the click on our side (how many, from where, which city).
 *   2. The destination URL carries UTM params so the partner's own dashboard
 *      attributes the resulting sale back to us.
 *
 * `buildOutboundUrl` does (2), `trackOutboundClick` does (1), and
 * `useOutboundLink` wires both to a single click handler.
 *
 * Note on reliability: a same-tab navigation can abort the in-flight PostHog
 * request before it leaves the browser. Outbound partner links should open in
 * a new tab (the default in `useOutboundLink`) so the event is never raced.
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

/**
 * Appends UTM params to a partner URL without clobbering params the partner
 * already put there (affiliate refs frequently live in the query string).
 *
 * Returns null when the URL is unparseable or uses a non-web scheme. Both
 * `javascript:` and `data:` parse cleanly through `new URL()`, so rejecting
 * them has to happen here — the return value is spread straight into an href
 * by `useOutboundLink`, and partner URLs are intended to become config-driven.
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
 * Safe to call when PostHog hasn't loaded — `window.posthog` is optional and
 * the call is a no-op in that case.
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
 * Usage:
 *   const link = useOutboundLink({ partner: "airalo", url: AIRALO_URL,
 *                                  placement: "city_landing", city: "Granada" });
 *   <a {...link}>Get a data plan</a>
 */
export const useOutboundLink = (params: OutboundParams) => {
  const href = buildOutboundUrl(params);
  return {
    // An anchor without an href is inert, which is the right failure mode for
    // a URL we have rejected as unsafe.
    href: href ?? undefined,
    target: "_blank" as const,
    // noopener/noreferrer is the safe default; some affiliate programmes need
    // the referrer to attribute, in which case drop "noreferrer" for that
    // partner.
    rel: "noopener noreferrer sponsored",
    // A rejected URL never navigates, so it must not record a click either.
    onClick: href ? () => trackOutboundClick(params) : undefined,
  };
};
