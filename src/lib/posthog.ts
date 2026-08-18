/**
 * On-demand PostHog initialization.
 *
 * PostHog is loaded only after the user grants analytics consent via the
 * cookie banner. This keeps us GDPR-compliant for EU users (i.e. every
 * Erasmus student) while still letting the rest of the app call
 * `window.posthog?.capture(...)` — the optional chaining handles the
 * case where consent was declined or not yet given.
 */

const POSTHOG_KEY = "phc_mB4tLHsYfXfiNbQKSjMfLxZHvorupqX9P5FsBMD7nNvq";
const POSTHOG_HOST = "https://eu.i.posthog.com";

/** Hostnames where PostHog must NOT be loaded (preview / staging). */
const BLOCKED_HOSTNAMES = ["lovableproject.com", "lovable.app"];

let initialized = false;

/**
 * Returns true when the current hostname belongs to a preview or staging
 * environment where analytics should be suppressed.
 */
const isPreviewEnvironment = (): boolean =>
  typeof window !== "undefined" &&
  BLOCKED_HOSTNAMES.some((h) => window.location.hostname.includes(h));

/**
 * Dynamically loads the PostHog JS snippet and calls `posthog.init()`.
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 * Does nothing in preview / staging environments.
 */
export const initPostHog = (): void => {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (isPreviewEnvironment()) return;

  initialized = true;

  /* ---------- PostHog loader (equivalent to the snippet they provide) ---------- */
  const t = document;
  const e: any = window.posthog || [];

  if (e.__SV) return; // already fully loaded by someone else

  window.posthog = e;
  e._i = [];

  e.init = function (
    i: string,
    s: Record<string, any>,
    a?: string,
  ) {
    function g(target: any, method: string) {
      const parts = method.split(".");
      if (parts.length === 2) {
        target = target[parts[0]];
        method = parts[1];
      }
      target[method] = function () {
        target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      };
    }

    const p = t.createElement("script");
    p.type = "text/javascript";
    p.crossOrigin = "anonymous";
    p.async = true;
    p.src =
      s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
      "/static/array.js";

    const r = t.getElementsByTagName("script")[0];
    r.parentNode!.insertBefore(p, r);

    const u: any = void 0 !== a ? (e[a] = []) : e;
    const label = a || "posthog";

    u.people = u.people || [];
    u.toString = function (flag?: any) {
      let name = "posthog";
      if (label !== "posthog") name += "." + label;
      if (!flag) name += " (stub)";
      return name;
    };
    u.people.toString = function () {
      return u.toString(1) + ".people (stub)";
    };

    const methods =
      "Ii init Di qi Sr Bi Zi Pi capture calculateEventProperties Yi register register_once register_for_session unregister unregister_for_session Xi getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Ji identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Wi Vi createPersonProfile setInternalOrTestUser Gi Fi Ki opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing $i debug Tr Ui getPageViewId captureTraceFeedback captureTraceMetric Ri".split(
        " ",
      );

    for (let n = 0; n < methods.length; n++) g(u, methods[n]);

    e._i.push([i, s, a]);
  };

  e.__SV = 1;
  /* ---------- end loader ---------- */

  e.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
  });
};
