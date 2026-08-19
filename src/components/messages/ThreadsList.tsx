import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChatThread, Profile } from "@/types";
import { format, isToday, isYesterday, differenceInDays, differenceInMinutes } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transformAvatarUrl } from "@/lib/avatar";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

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
  return differenceInMinutes(new Date(), new Date(partner.last_active_at)) <= 5;
};

export const ThreadsList = ({
  threads,
  selectedThread,
  onSelectThread,
  getInitials,
}: ThreadsListProps) => {
  const [search, setSearch] = useState("");

  const filteredThreads = useMemo(() => {
    if (!search.trim()) return threads;
    const q = search.toLowerCase();
    return threads.filter(
      (t) => t.partner.name?.toLowerCase().includes(q)
    );
  }, [threads, search]);

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
      {/* Search */}
      {threads.length > 3 && (
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full bg-muted/50 border border-border/60 rounded-full text-base pl-8 pr-8 py-2 outline-none focus:border-primary/40 focus:bg-background transition-colors placeholder:text-muted-foreground text-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      )}

      {filteredThreads.length === 0 && search.trim() && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">No conversations found</p>
        </div>
      )}

      {filteredThreads.map((thread) => {
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
                <AvatarImage src={transformAvatarUrl(thread.partner.avatar_url)} loading="lazy" decoding="async" />
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
