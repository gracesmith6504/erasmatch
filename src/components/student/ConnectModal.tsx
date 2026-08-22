import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useSendMessage } from "@/hooks/useSendMessage";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import InviteFriendModal from "@/components/share/InviteFriendModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { transformAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const MAX_CHARS = 300;

/** Maximum number of quick-reply chips to display. */
const MAX_CHIPS = 3;

// ─── contextual quick-reply builder ─────────────────────────────────
// Compares the current user's profile with the target student's profile
// and returns up to MAX_CHIPS conversation starters, ordered from most
// contextual to most generic. Shared fields make better openers because
// they give the recipient something concrete to reply to.

function buildContextualReplies(
  me: Profile | null | undefined,
  them: Partial<Profile> | null | undefined,
  sharedCity: string | null | undefined,
  sharedUniversity: string | null | undefined,
): string[] {
  const chips: string[] = [];

  if (me && them) {
    // 1. Same course — strongest academic connection
    if (me.course && them.course && me.course === them.course) {
      chips.push(`We're both studying ${me.course}! What modules are you picking?`);
    }

    // 2. Same home university — personal "small world" connection
    if (
      me.home_university &&
      them.home_university &&
      me.home_university === them.home_university
    ) {
      chips.push(`No way, I'm from ${me.home_university} too! Small world 😄`);
    }

    // 3. Arrival dates within 14 days — welcome-week buddy
    if (me.arrival_date && them.arrival_date) {
      const gap = Math.abs(
        differenceInDays(new Date(me.arrival_date), new Date(them.arrival_date)),
      );
      if (gap <= 14) {
        chips.push(
          "Looks like we arrive around the same time, want to explore welcome week together? 🎉",
        );
      }
    }

    // 4. Both seeking flatmates in the same city
    if (
      sharedCity &&
      me.looking_for?.includes("flatmate") &&
      them.looking_for?.includes("flatmate")
    ) {
      chips.push(`Also looking for a place in ${sharedCity}, found anything yet?`);
    }

    // 5. Both seeking a travel buddy
    if (
      me.looking_for?.includes("travel-buddy") &&
      them.looking_for?.includes("travel-buddy")
    ) {
      chips.push("Looking for a travel buddy too! Any trips planned yet? ✈️");
    }
  }

  // 6. Shared destination city (existing)
  if (sharedCity) {
    chips.push(`Also heading to ${sharedCity} soon! 👋`);
  }

  // 7. Shared destination university (existing)
  if (sharedUniversity) {
    chips.push(`We're both going to ${sharedUniversity}! 👋`);
  }

  // 8. Welcome week — always a good icebreaker when few contextual matches
  if (chips.length < MAX_CHIPS) {
    chips.push(
      "Going to any welcome week events? Would be great to know someone there! 🎉",
    );
  }

  // 9. Generic fallback — always available as last resort
  chips.push("Hey! Saw we're both doing Erasmus, would love to connect 👋");

  // Deduplicate (shared-city chip might overlap with flatmate chip, etc.)
  const seen = new Set<string>();
  const unique = chips.filter((c) => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });

  return unique.slice(0, MAX_CHIPS);
}

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  studentAvatarUrl?: string | null;
  studentCity?: string | null;
  studentSemester?: string | null;
  studentLastActiveAt?: string | null;
  sharedCity?: string | null;
  sharedUniversity?: string | null;
  /** Partial profile of the target student for contextual conversation starters. */
  studentProfile?: Partial<Profile> | null;
  initialNote?: string;
  onSent?: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  open,
  onOpenChange,
  studentId,
  studentName,
  studentAvatarUrl,
  studentCity,
  studentSemester,
  studentLastActiveAt,
  sharedCity,
  sharedUniversity,
  studentProfile,
  initialNote,
  onSent,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [note, setNote] = useState(initialNote ?? "");

  useEffect(() => {
    if (open) setNote(initialNote ?? "");
  }, [open, studentId, initialNote]);
  const [sending, setSending] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const sendMessage = useSendMessage();
  const { currentUserId, currentUserProfile } = useAuth();

  const quickReplies = useMemo(
    () => buildContextualReplies(currentUserProfile, studentProfile, sharedCity, sharedUniversity),
    [currentUserProfile, studentProfile, sharedCity, sharedUniversity],
  );

  const placeholder = quickReplies[0] || "Hey! Saw we're both doing Erasmus, would love to connect 👋";

  const handleSend = async () => {
    if (!note.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(studentId, note.trim());
      window.posthog?.capture("say_hi_sent");
      onSent?.();
      toast({ title: "Message sent!", description: `Your note is on its way to ${studentName.split(" ")[0]}.` });
      setNote("");

      if (currentUserId && !localStorage.getItem("invitePromptSeen")) {
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("sender_id", currentUserId);

        if (count === 1) {
          setShowInviteModal(true);
          setSending(false);
          return;
        }
      }

      onOpenChange(false);
    } catch {
      toast({ title: "Failed to send", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && note.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  const refCode = currentUserProfile?.ref_code || "";
  const firstName = studentName.split(" ")[0] || studentName;
  const initials = studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarSrc = transformAvatarUrl(studentAvatarUrl, 144);

  const subtitleParts = [studentCity, studentSemester].filter(Boolean) as string[];
  const subtitle = subtitleParts.join(" · ");

  const isActive = studentLastActiveAt
    ? differenceInDays(new Date(), new Date(studentLastActiveAt)) <= 21
    : false;

  const goToProfile = () => {
    onOpenChange(false);
    navigate(`/profile/${studentId}`);
  };

  const pct = Math.min(100, (note.length / MAX_CHARS) * 100);
  const barColor =
    note.length > 90
      ? "bg-erasmatch-coral"
      : note.length > 75
        ? "bg-erasmatch-orange"
        : "bg-primary";
  const counterColor =
    note.length > 90
      ? "text-erasmatch-coral"
      : note.length > 75
        ? "text-erasmatch-orange"
        : "text-muted-foreground";

  // Stop click/keypress from bubbling out of the modal (Radix portals to body
  // but React events still bubble through the React tree to parent handlers
  // like clickable cards on the /students page).
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <>
      <Dialog open={open && !showInviteModal} onOpenChange={onOpenChange}>
        <DialogContent
          onClick={stop}
          onMouseDown={stop}
          onPointerDown={stop}
          onKeyDown={stop}
          className="sm:max-w-[420px] w-[calc(100vw-2rem)] p-0 gap-0 overflow-hidden rounded-2xl border-border/60"
        >
          {/* Header */}
          <div className="relative pt-7 pb-4 px-5 sm:px-6 text-center bg-gradient-to-b from-secondary/40 to-transparent">
            <div className="flex justify-center mb-3">
              <button
                type="button"
                onClick={goToProfile}
                aria-label={`View ${firstName}'s profile`}
                className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform hover:scale-[1.03] active:scale-100 cursor-pointer"
              >
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-card">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={studentName} />}
                  <AvatarFallback className="bg-secondary text-foreground font-semibold text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isActive && (
                  <span
                    aria-label="Recently active"
                    className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"
                  />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={goToProfile}
              className="font-display text-xl font-semibold text-foreground leading-tight hover:underline underline-offset-4 decoration-2 decoration-primary/40"
            >
              Say hi to {firstName}
            </button>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 px-2 break-words">{subtitle}</p>
            )}
            {sharedCity && (
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium max-w-full">
                <span>🎉</span>
                <span className="truncate">You're both heading to {sharedCity}</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="px-5 sm:px-6 pb-4 pt-1">
            {!note.trim() && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {quickReplies.map((chip, idx) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setNote(chip);
                      window.posthog?.capture("quick_reply_chip_clicked", {
                        chip_text: chip,
                        chip_index: idx,
                      });
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            <label className="sr-only" htmlFor="connect-note">
              Your message
            </label>
            <Textarea
              id="connect-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={MAX_CHARS}
              rows={4}
              autoFocus={!isMobile}
              className="resize-none rounded-2xl bg-secondary/40 border-border/60 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40 text-base leading-relaxed px-4 py-3 min-h-[110px] transition-colors"
            />

            {/* Counter + progress */}
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-200", barColor)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={cn("text-xs font-medium tabular-nums", counterColor)}>
                {note.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-border/60 bg-secondary/20">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!note.trim() || sending}
              className="rounded-full px-6 gap-2 shadow-button"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {refCode && (
        <InviteFriendModal
          open={showInviteModal}
          onOpenChange={(v) => {
            setShowInviteModal(v);
            if (!v) onOpenChange(false);
          }}
          refCode={refCode}
        />
      )}
    </>
  );
};

export default ConnectModal;
