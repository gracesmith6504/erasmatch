import React, { useState } from "react";
import { ReactionSummary } from "@/hooks/useReactions";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "😢", "😮", "🔥", "👏"];

interface MessageReactionsProps {
  summaries: ReactionSummary[];
  onToggleReaction: (emoji: string) => void;
  isCurrentUser: boolean;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  summaries,
  onToggleReaction,
  isCurrentUser,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1", isCurrentUser ? "items-end" : "items-start")}>
      {summaries.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {summaries.map((s) => (
            <button
              key={s.emoji}
              onClick={() => onToggleReaction(s.emoji)}
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                s.reacted
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-muted border-border text-muted-foreground hover:bg-accent"
              )}
            >
              <span>{s.emoji}</span>
              <span className="font-medium">{s.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted text-muted-foreground"
          aria-label="Add reaction"
        >
          <SmilePlus className="h-3.5 w-3.5" />
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
            <div
              className={cn(
                "absolute z-50 flex gap-1 p-1.5 rounded-full bg-card border border-border shadow-lg",
                isCurrentUser ? "right-0 bottom-full mb-1" : "left-0 bottom-full mb-1"
              )}
            >
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onToggleReaction(emoji);
                    setShowPicker(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors text-base"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
