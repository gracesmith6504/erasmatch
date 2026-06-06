import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, Check, ArrowRight, GraduationCap, MapPin } from "lucide-react";

interface InviteCrewStepProps {
  homeUniversity: string | null;
  city: string | null;
  refCode: string | null;
  onComplete: () => void;
}

type Target = "university" | "city";

const REFERRAL_BASE = "https://erasmatch.com";

export const InviteCrewStep = ({ homeUniversity, city, refCode, onComplete }: InviteCrewStepProps) => {
  const [copied, setCopied] = useState<Target | null>(null);
  const [sharedAny, setSharedAny] = useState(false);

  const referralUrl = refCode ? `${REFERRAL_BASE}/?ref=${refCode}` : REFERRAL_BASE;

  const uniText = homeUniversity
    ? `hey are you doing erasmus next semester? found this site where people from ${homeUniversity} connect before they leave - use my link so you see my profile: ${referralUrl}`
    : "";
  const cityText = city
    ? `hey are you going to ${city} for erasmus? found this site where people heading there meet before arriving - use my link so you see my profile: ${referralUrl}`
    : "";

  useEffect(() => {
    window.posthog?.capture("invite_step_viewed", {
      has_university: !!homeUniversity,
      has_city: !!city,
      has_ref_code: !!refCode,
    });
  }, [homeUniversity, city, refCode]);

  const handleWhatsApp = (target: Target, text: string) => {
    setSharedAny(true);
    window.posthog?.capture("invite_step_whatsapp_clicked", { target, surface: "onboarding" });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopy = async (target: Target) => {
    await navigator.clipboard.writeText(referralUrl);
    setSharedAny(true);
    setCopied(target);
    window.posthog?.capture("invite_step_copied", { target, surface: "onboarding" });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSkip = () => {
    window.posthog?.capture("invite_step_skipped", { shared_any: sharedAny });
    onComplete();
  };

  const renderCard = (
    target: Target,
    icon: React.ReactNode,
    headline: string,
    sub: string,
    waText: string,
  ) => (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft text-left">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
          {icon}
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground leading-snug">{headline}</h3>
          <p className="text-sm text-muted-foreground mt-1">{sub}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => handleWhatsApp(target, waText)}
          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button variant="outline" onClick={() => handleCopy(target)} className="flex-1">
          {copied === target ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const showUni = !!homeUniversity;
  const showCity = !!city;
  const hasAny = showUni || showCity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 px-6 text-center max-w-md w-full"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Bring your crew
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Your Erasmus is better with people you know. Invite anyone going abroad.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {showUni &&
            renderCard(
              "university",
              <GraduationCap className="h-5 w-5" />,
              `Know anyone from ${homeUniversity} going abroad?`,
              "Tag them in — they'll see your profile first when they sign up.",
              uniText,
            )}
          {showCity &&
            renderCard(
              "city",
              <MapPin className="h-5 w-5" />,
              `Anyone else heading to ${city}?`,
              "Get a head start — share the link with them.",
              cityText,
            )}
          {!hasAny && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <p className="text-sm text-muted-foreground">
                Share your link with anyone doing Erasmus:
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={() =>
                    handleWhatsApp(
                      "city",
                      `hey are you doing erasmus? found this site where people meet before they go - use my link so you see my profile: ${referralUrl}`,
                    )
                  }
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={() => handleCopy("city")} className="flex-1">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          {sharedAny ? "Done — continue" : "Skip for now"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};
