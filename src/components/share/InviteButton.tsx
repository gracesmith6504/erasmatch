import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { InviteCrewSheet } from "./InviteCrewSheet";

interface InviteButtonProps {
  variant?: "icon" | "menu";
}

export const InviteButton = ({ variant = "icon" }: InviteButtonProps) => {
  const { currentUserProfile } = useAuth();
  const [open, setOpen] = useState(false);

  if (!currentUserProfile) return null;

  const trigger =
    variant === "icon" ? (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
        title="Invite friends"
        aria-label="Invite friends"
      >
        <Send className="w-5 h-5" />
      </Button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <div className="flex items-center">
          <Send className="w-5 h-5 mr-3" />
          Invite friends
        </div>
      </button>
    );

  return (
    <>
      {trigger}
      <InviteCrewSheet
        open={open}
        onOpenChange={setOpen}
        homeUniversity={currentUserProfile.home_university ?? null}
        city={currentUserProfile.city ?? null}
        refCode={currentUserProfile.ref_code ?? null}
        surface={variant === "icon" ? "navbar_desktop" : "navbar_mobile"}
      />
    </>
  );
};
