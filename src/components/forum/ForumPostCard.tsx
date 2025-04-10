
import { ForumPost } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface ForumPostCardProps {
  post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formattedDate = format(date, 'MMM d, yyyy');
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      return { formattedDate, timeAgo };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { formattedDate: "Unknown date", timeAgo: "" };
    }
  };

  const { formattedDate, timeAgo } = formatDate(post.created_at);
  
  // Extract a preview of the content (first 150 characters)
  const contentPreview = post.content.length > 150 
    ? `${post.content.substring(0, 150)}...` 
    : post.content;

  return (
    <Link to={`/forum/post/${post.id}`} className="block no-underline text-inherit">
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-lg md:text-xl">{post.title}</CardTitle>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Avatar className="h-6 w-6 mr-2">
              <img 
                src={post.author?.avatar_url || '/placeholder.svg'} 
                alt={post.author?.name || 'Anonymous'} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }} 
              />
            </Avatar>
            <span>{post.author?.name || 'Anonymous'}</span>
            <span className="mx-2">•</span>
            <span title={formattedDate}>{timeAgo}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{contentPreview}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
