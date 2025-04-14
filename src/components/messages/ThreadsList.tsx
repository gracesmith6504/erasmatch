
import { Link } from "react-router-dom";
import { ChatThread } from "@/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Circle } from "lucide-react";

interface ThreadsListProps {
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  onSelectThread: (thread: ChatThread) => void;
  getInitials: (name: string | null) => string;
  unreadThreadIds?: string[]; // Array of thread IDs with unread messages
}

export const ThreadsList = ({
  threads,
  selectedThread,
  onSelectThread,
  getInitials,
  unreadThreadIds = [], // Default to empty array
}: ThreadsListProps) => {
  return (
    <>
      {threads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-gray-600 mb-4">No messages yet</p>
          <Link to="/students">
            <Button>Find Students</Button>
          </Link>
        </div>
      ) : (
        threads.map((thread) => {
          // Check if this thread has unread messages
          const hasUnread = unreadThreadIds.includes(thread.partner.id);
          
          return (
            <div key={thread.partner.id}>
              <button
                className={`w-full p-4 hover:bg-gray-50 text-left flex items-center ${
                  selectedThread?.partner.id === thread.partner.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectThread(thread)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={thread.partner.avatar_url || undefined} />
                    <AvatarFallback className="bg-erasmatch-light-accent">
                      {getInitials(thread.partner.name)}
                    </AvatarFallback>
                  </Avatar>
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-erasmatch-blue rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="overflow-hidden flex-grow">
                  <div className="font-medium flex items-center justify-between">
                    <span>{thread.partner.name}</span>
                    {hasUnread && (
                      <Circle className="w-2 h-2 text-erasmatch-blue fill-erasmatch-blue ml-1 flex-shrink-0" />
                    )}
                  </div>
                  {thread.lastMessage && (
                    <div className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {thread.lastMessage.sender_id === thread.partner.id ? '' : 'You: '}
                      {thread.lastMessage.content}
                    </div>
                  )}
                </div>
                {thread.lastMessage && (
                  <div className="ml-auto text-xs text-gray-400 flex-shrink-0">
                    {format(new Date(thread.lastMessage.created_at), "MMM d")}
                  </div>
                )}
              </button>
              <Separator />
            </div>
          );
        })
      )}
    </>
  );
};
