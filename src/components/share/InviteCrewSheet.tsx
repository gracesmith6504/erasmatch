import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, Check, GraduationCap, MapPin } from "lucide-react";

type Target = "university" | "city";

const REFERRAL_BASE = "https://erasmatch.com";

interface InviteCrewBodyProps {
  homeUniversity: string | null;
  city: string | null;
  refCode: string | null;
  surface: string;
  onShared?: () => void;
}

export const InviteCrewBody = ({
  homeUniversity,
  city,
  refCode,
  surface,
  onShared,
}: InviteCrewBodyProps) => {
  const [copied, setCopied] = useState<Target | null>(null);

  const referralUrl = refCode ? `${REFERRAL_BASE}/?ref=${refCode}` : REFERRAL_BASE;

  const uniText = homeUniversity
    ? `hey are you doing erasmus next semester? found this site where people from ${homeUniversity} connect before they leave - use my link so you see my profile: ${referralUrl}`
    : "";
  const cityText = city
    ? `hey are you going to ${city} for erasmus? found this site where people heading there meet before arriving - use my link so you see my profile: ${referralUrl}`
    : "";

  const handleWhatsApp = (target: Target, text: string) => {
    window.posthog?.capture("invite_whatsapp_clicked", { target, surface });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    onShared?.();
  };

  const handleCopy = async (target: Target, text: string) => {
    await navigator.clipboard.writeText(text || referralUrl);
    setCopied(target);
    window.posthog?.capture("invite_link_copied", { target, surface });
    onShared?.();
    setTimeout(() => setCopied(null), 2000);
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
        <Button variant="outline" onClick={() => handleCopy(target, waText)} className="flex-1">
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
          <p className="text-sm text-muted-foreground mb-3">
            Share your link with anyone doing Erasmus:
          </p>
          <div className="flex gap-2">
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
            <Button variant="outline" onClick={() => handleCopy("city", referralUrl)} className="flex-1">
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
  );
};

interface InviteCrewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeUniversity: string | null;
  city: string | null;
  refCode: string | null;
  surface: string;
  title?: string;
  description?: string;
}

export const InviteCrewSheet = ({
  open,
  onOpenChange,
  homeUniversity,
  city,
  refCode,
  surface,
  title = "Bring your crew",
  description = "Your Erasmus is better with people you know. Invite anyone going abroad.",
}: InviteCrewSheetProps) => {
  useEffect(() => {
    if (open) {
      window.posthog?.capture("invite_sheet_opened", { surface });
    }
  }, [open, surface]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InviteCrewBody
          homeUniversity={homeUniversity}
          city={city}
          refCode={refCode}
          surface={surface}
        />
      </DialogContent>
    </Dialog>
  );
};
