
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCityForums } from '@/hooks/useCityForums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewForumPost() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { createPost } = useCityForums(city || '');
  const currentUserId = localStorage.getItem('userId'); // Temporary solution, replace with proper auth
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    if (!currentUserId) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    try {
      setSubmitting(true);
      const post = await createPost(title, content, currentUserId);
      toast.success('Post created successfully');
      navigate(`/forum/post/${post.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link 
        to={`/forum/${city}`}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to {city} forum
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Post in {city}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="min-h-[200px]"
                required
              />
            </div>
            
            <div className="flex justify-end pt-4 space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/forum/${city}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={submitting || !title.trim() || !content.trim()}
              >
                {submitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
