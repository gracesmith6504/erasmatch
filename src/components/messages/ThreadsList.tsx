import { Link } from "react-router-dom";
import { ChatThread, Profile } from "@/types";
import { format, isToday, isYesterday, differenceInDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ThreadsListProps {
  threads: (ChatThread & { hasUnreadMessages?: boolean })[];
  selectedThread: ChatThread | null;
  onSelectThread: (thread: ChatThread) => void;
  getInitials: (name: string | null) => string;
}

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  if (differenceInDays(new Date(), date) < 7) return format(date, "EEE");
  return format(date, "dd/MM/yy");
};

const isOnline = (partner: ChatThread["partner"]) => {
  if (!partner.last_active_at) return false;
  return differenceInDays(new Date(), new Date(partner.last_active_at)) <= 14;
};

export const ThreadsList = ({
  threads,
  selectedThread,
  onSelectThread,
  getInitials,
}: ThreadsListProps) => {
  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-muted-foreground mb-4 text-sm">No messages yet</p>
        <Link to="/students">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm px-6">
            Find Students
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {threads.map((thread) => {
        const isSelected = selectedThread?.partner.id === thread.partner.id;
        const unread = thread.hasUnreadMessages;
        const online = isOnline(thread.partner);

        return (
          <button
            key={thread.partner.id}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-b border-border/50 ${
              isSelected
                ? "bg-accent/60"
                : "hover:bg-accent/30"
            }`}
            onClick={() => onSelectThread(thread)}
          >
            {/* Avatar with online indicator */}
            <div className="relative shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={thread.partner.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                  {getInitials(thread.partner.name)}
                </AvatarFallback>
              </Avatar>
              {online && (
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm truncate ${unread ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                  {thread.partner.name}
                </span>
                {thread.lastMessage && (
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatMessageTime(thread.lastMessage.created_at)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {thread.lastMessage ? (
                  <p className={`text-[13px] truncate ${unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {thread.lastMessage.sender_name !== thread.partner.name && (
                      <span className="text-muted-foreground">You: </span>
                    )}
                    {thread.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-[13px] text-muted-foreground italic">No messages yet</p>
                )}
                {unread && (
                  <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
