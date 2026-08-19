
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transformAvatarUrl } from "@/lib/avatar";
import { Profile } from "@/types";
import { MessageSquare } from "lucide-react";

interface MessageEmptyStateProps {
  partner?: Profile | null;
  currentUser?: Profile | null;
}

const getInitials = (name: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const getSharedTraits = (currentUser?: Profile | null, partner?: Profile | null) => {
  if (!currentUser || !partner) return [];
  const traits: string[] = [];
  if (currentUser.city && partner.city && currentUser.city === partner.city) {
    traits.push(`Both heading to ${currentUser.city}`);
  }
  if (currentUser.university && partner.university && currentUser.university === partner.university) {
    traits.push(`Both going to ${currentUser.university}`);
  }
  if (currentUser.home_university && partner.home_university && currentUser.home_university === partner.home_university) {
    traits.push(`Both from ${currentUser.home_university}`);
  }
  if (currentUser.semester && partner.semester && currentUser.semester === partner.semester) {
    traits.push(`Same semester`);
  }
  return traits;
};

const MessageEmptyState: React.FC<MessageEmptyStateProps> = ({ partner, currentUser }) => {
  const traits = getSharedTraits(currentUser, partner);

  if (!partner) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">Select a conversation to start chatting</p>
      </div>
    );
  }

  const firstName = partner.name?.split(" ")[0] || partner.name || "them";

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      {/* Profile card */}
      <div className="flex flex-col items-center text-center max-w-[280px]">
        <Avatar className="h-20 w-20 mb-3 ring-4 ring-background shadow-sm">
          <AvatarImage
            src={transformAvatarUrl(partner.avatar_url, 160)}
            alt={partner.name || "User"}
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xl">
            {getInitials(partner.name)}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-semibold text-foreground text-lg leading-tight">
          {partner.name}
        </h3>

        {(partner.city || partner.semester) && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {[partner.city, partner.semester].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Shared traits */}
        {traits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {traits.map((trait) => (
              <span
                key={trait}
                className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-4">
          Say hi to {firstName} — you're both doing Erasmus!
        </p>
      </div>
    </div>
  );
};

export default MessageEmptyState;
