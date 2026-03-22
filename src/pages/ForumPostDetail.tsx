import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForumPost } from '@/hooks/useForumPost';
import { useAuth } from '@/contexts/AuthContext';
import { CommentCard } from '@/components/forum/CommentCard';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

export default function ForumPostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { post, comments, loading, addComment } = useForumPost(postId || '');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUserId } = useAuth();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    if (!currentUserId) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    try {
      setSubmitting(true);
      await addComment(commentContent, currentUserId);
      setCommentContent('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-6 w-40 mb-8" />
        <Skeleton className="h-32 w-full mb-8" />
        
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Link to={`/forum/${postId?.split('-')[0] || ''}`}>
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to forum
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = () => {
    try {
      return format(new Date(post.created_at), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link 
          to={`/forum/${post.city}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to {post.city} forum
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-8 w-8 mr-2">
            <img 
              src={post.author?.avatar_url || '/placeholder.svg'} 
              alt={post.author?.name || 'Anonymous'} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }} 
            />
          </Avatar>
          <div>
            <div className="font-medium">{post.author?.name || 'Anonymous'}</div>
            <div className="text-xs text-muted-foreground">{formattedDate()}</div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <MessageSquare className="mr-2 h-5 w-5" /> 
          Comments ({comments.length})
        </h2>
        
        {currentUserId && (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="mb-3"
              rows={3}
            />
            <Button type="submit" disabled={submitting || !commentContent.trim()}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        )}
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
