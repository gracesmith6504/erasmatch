
import { Link } from "react-router-dom";
import { ChatThread, Profile } from "@/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ThreadsListProps {
  threads: ChatThread[];
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
          <p className="text-gray-600 mb-4">No messages yet</p>
          <Link to="/students">
            <Button>Find Students</Button>
          </Link>
        </div>
      ) : (
        threads.map((thread) => (
          <div key={thread.partner.id}>
            <button
              className={`w-full p-4 hover:bg-gray-50 text-left flex items-center ${
                selectedThread?.partner.id === thread.partner.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelectThread(thread)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={thread.partner.avatar_url || undefined} />
                <AvatarFallback className="bg-erasmatch-light-accent">
                  {getInitials(thread.partner.name)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="font-medium">{thread.partner.name}</div>
                {thread.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {thread.lastMessage.sender_id === selectedThread?.partner.id ? '' : 'You: '}
                    {thread.lastMessage.content}
                  </div>
                )}
              </div>
              {thread.lastMessage && (
                <div className="ml-auto text-xs text-gray-400">
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
