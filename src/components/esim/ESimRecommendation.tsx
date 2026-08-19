import { useState } from "react";
import { Wifi, X } from "lucide-react";
import { useOutboundLink, type OutboundPlacement } from "@/lib/analytics";

/**
 * Airalo affiliate tracking link (Impact.com).
 * The ad creative (2071037) already redirects to the Airalo homepage
 * with the NEWTOAIRALO15 promo code pre-applied.
 */
const AIRALO_TRACKING_URL =
  "https://airalo.pxf.io/c/7373558/2071037/15608";

const PROMO_CODE = "NEWTOAIRALO15";

const DISMISS_KEY = "esim-recommendation-dismissed";

interface ESimRecommendationProps {
  /** The destination country, e.g. "Spain". */
  country: string;
  /** The city name, used for analytics attribution. */
  city: string;
  /** Where the component is rendered. Defaults to "city_landing". */
  placement?: OutboundPlacement;
  /**
   * "full" renders the card section used on city landing pages.
   * "compact" renders a slim dismissible banner for the students page.
   */
  variant?: "full" | "compact";
}

export const ESimRecommendation = ({
  country,
  city,
  placement = "city_landing",
  variant = "full",
}: ESimRecommendationProps) => {
  const [dismissed, setDismissed] = useState(
    () => variant === "compact" && localStorage.getItem(DISMISS_KEY) === "true",
  );

  const linkProps = useOutboundLink({
    partner: "airalo",
    url: AIRALO_TRACKING_URL,
    placement,
    city,
    category: "esim",
  });

  if (dismissed || !country) return null;

  if (variant === "compact") {
    return (
      <div className="mb-4 relative rounded-lg border border-border bg-card px-4 py-3 pr-10">
        <a
          {...linkProps}
          className="group flex flex-wrap items-center gap-x-3 gap-y-1"
        >
          <Wifi className="h-4 w-4 text-accent flex-shrink-0" />
          <span className="text-sm font-medium text-foreground">
            Stay connected in {country}
          </span>
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Get an eSIM data plan before you arrive
          </span>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {PROMO_CODE} - 15% off
          </span>
          <span
            aria-hidden="true"
            className="text-accent text-sm transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setDismissed(true);
            localStorage.setItem(DISMISS_KEY, "true");
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <a
          {...linkProps}
          className="group block rounded-xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-accent/40 hover:shadow-sm"
        >
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="flex-shrink-0 h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
              <Wifi className="h-5 w-5 text-accent" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Stay connected in {country}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Skip roaming fees and get an eSIM data plan before you arrive.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:underline underline-offset-4">
                  Browse {country} eSIM plans
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>

                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {PROMO_CODE} - 15% off your first eSIM
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
