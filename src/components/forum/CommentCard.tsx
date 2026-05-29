
import { ForumComment } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';

interface CommentCardProps {
  comment: ForumComment;
}

export function CommentCard({ comment }: CommentCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formattedDate = format(date, 'MMM d, yyyy h:mm a');
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      return { formattedDate, timeAgo };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { formattedDate: "Unknown date", timeAgo: "" };
    }
  };

  const { formattedDate, timeAgo } = formatDate(comment.created_at);

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-start mb-3">
          <Avatar className="h-8 w-8 mr-3">
            <img 
              src={comment.author?.avatar_url || '/placeholder.svg'} 
              alt={comment.author?.name || 'Anonymous'} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }} 
            />
          </Avatar>
          <div>
            <div className="font-medium">{comment.author?.name || 'Anonymous'}</div>
            <div className="text-xs text-muted-foreground" title={formattedDate}>
              {timeAgo}
            </div>
          </div>
        </div>
        <div className="pl-11">
          <p>{comment.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}
