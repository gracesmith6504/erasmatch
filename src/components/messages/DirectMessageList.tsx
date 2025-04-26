import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import { motion } from 'framer-motion';

interface DirectMessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const DirectMessageList = ({
  messages,
  currentUserId,
}: DirectMessageListProps) => {
  return (
    <div className="flex flex-col w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <MessageBubble
              content={message.content}
              timestamp={message.created_at}
              isCurrentUser={isCurrentUser}
              isRead={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
