
import { Users } from "lucide-react";

type EmptyMessageStateProps = {
  message?: string;
};

const EmptyMessageState = ({ 
  message = "Be the first to start a conversation in this group!" 
}: EmptyMessageStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Users className="h-12 w-12 text-gray-400 mb-3" />
      <h3 className="text-xl font-semibold text-gray-700">No messages yet</h3>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
};

export default EmptyMessageState;
