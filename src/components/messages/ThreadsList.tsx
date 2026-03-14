import { Link } from "react-router-dom";
import { ChatThread } from "@/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleDot } from "lucide-react";

interface ThreadsListProps {
  threads: (ChatThread & { hasUnreadMessages?: boolean })[];
  selectedThread: ChatThread | null;
  onSelectThread: (thread: ChatThread) => void;
  getInitials: (name: string | null) => string;
}

export const ThreadsList = ({
  threads,
  selectedThread,
  onSelectThread,
  getInitials,
}: ThreadsListProps) => {
  return (
    <>
      {threads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-muted-foreground mb-4">No messages yet</p>
          <Link to="/students">
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">Find Students</Button>
          </Link>
        </div>
      ) : (
        threads.map((thread) => (
          <div key={thread.partner.id}>
            <button
              className={`w-full p-4 hover:bg-secondary text-left flex items-center relative transition-colors ${
                selectedThread?.partner.id === thread.partner.id ? 'bg-secondary' : ''
              }`}
              onClick={() => onSelectThread(thread)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={thread.partner.avatar_url || undefined} />
                <AvatarFallback className="bg-secondary text-foreground">
                  {getInitials(thread.partner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden flex-1">
                <div className="font-medium text-foreground flex items-center">
                  {thread.partner.name}
                  {thread.hasUnreadMessages && (
                    <CircleDot className="h-3 w-3 text-erasmatch-green ml-2" />
                  )}
                </div>
                {thread.lastMessage && (
                  <div className="text-sm text-muted-foreground truncate">
                    {thread.lastMessage.sender_name === thread.partner.name ? '' : 'You: '}
                    {thread.lastMessage.content}
                  </div>
                )}
              </div>
              {thread.lastMessage && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(thread.lastMessage.created_at), "MMM d")}
                </div>
              )}
            </button>
            <Separator />
          </div>
        ))
      )}
    </>
  );
};