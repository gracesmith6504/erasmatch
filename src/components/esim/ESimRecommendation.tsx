import { Wifi } from "lucide-react";
import { useOutboundLink, type OutboundPlacement } from "@/lib/analytics";

/**
 * Airalo affiliate tracking link (Impact.com).
 * The ad creative (2071037) already redirects to the Airalo homepage
 * with the NEWTOAIRALO15 promo code pre-applied.
 */
const AIRALO_TRACKING_URL =
  "https://airalo.pxf.io/c/7373558/2071037/15608";

const PROMO_CODE = "NEWTOAIRALO15";

interface ESimRecommendationProps {
  /** The destination country, e.g. "Spain". */
  country: string;
  /** The city name, used for analytics attribution. */
  city: string;
  /** Where the component is rendered. Defaults to "city_landing". */
  placement?: OutboundPlacement;
}

export const ESimRecommendation = ({
  country,
  city,
  placement = "city_landing",
}: ESimRecommendationProps) => {
  const linkProps = useOutboundLink({
    partner: "airalo",
    url: AIRALO_TRACKING_URL,
    placement,
    city,
    category: "esim",
  });

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
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Skip roaming fees — get an eSIM data plan before you arrive.
                Works with most phones from 2020 onwards, and you can set it up
                before you leave home.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:underline underline-offset-4">
                  Browse {country} eSIM plans
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>

                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {PROMO_CODE} — 15% off your first eSIM
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
