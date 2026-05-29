
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCityForums } from '@/hooks/useCityForums';
import { ForumPostCard } from '@/components/forum/ForumPostCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function CityForum() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading } = useCityForums(city || '');
  
  const handleNewPost = () => {
    navigate(`/forum/${city}/new`);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {city ? `${city} Forum` : 'City Forum'}
        </h1>
        <Button onClick={handleNewPost}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search posts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div>
        {loading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <ForumPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? 'No posts match your search criteria' : 'Be the first to start a discussion'}
            </p>
            {!searchQuery && (
              <Button onClick={handleNewPost} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Create first post
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
