
import { Skeleton } from "@/components/ui/skeleton";

const MessageListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-80" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageListSkeleton;
