/**
 * GDPR-compliant cookie consent banner.
 *
 * Shows once on first visit. Stores the user's choice in localStorage under
 * `cookie-consent`. PostHog is only initialised when the user accepts
 * analytics cookies; the rest of the app already guards calls behind
 * `window.posthog?.capture(...)` so nothing breaks when PostHog is absent.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { initPostHog } from "@/lib/posthog";

const STORAGE_KEY = "cookie-consent";

interface ConsentValue {
  analytics: boolean;
  timestamp: string;
}

/** Read the persisted consent decision, if one exists. */
const getStoredConsent = (): ConsentValue | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentValue;
  } catch {
    return null;
  }
};

/** Persist the consent decision. */
const setStoredConsent = (analytics: boolean): void => {
  const value: ConsentValue = {
    analytics,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();

    if (consent === null) {
      // First visit — show the banner after a brief delay so it doesn't
      // flash during the initial page paint.
      const id = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(id);
    }

    // Returning user who already consented — load PostHog immediately.
    if (consent.analytics) {
      initPostHog();
    }
  }, []);

  const accept = () => {
    setStoredConsent(true);
    initPostHog();
    setVisible(false);
  };

  const decline = () => {
    setStoredConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 " +
        "animate-in slide-in-from-bottom duration-500 fill-mode-both"
      }
    >
      <div
        className={
          "mx-auto max-w-lg rounded-xl border border-border bg-card p-4 sm:p-5 " +
          "shadow-lg"
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          We use analytics cookies to improve your experience.{" "}
          <Link
            to="/privacy-policy"
            className="underline underline-offset-2 text-foreground hover:text-primary"
          >
            Privacy Policy
          </Link>
        </p>

        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={accept}>
            Accept All
          </Button>
          <Button size="sm" variant="outline" onClick={decline}>
            Necessary Only
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
