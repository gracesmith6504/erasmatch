
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '@/components/forum/types';
import { toast } from 'sonner';

export function useCityForums(city: string) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCityForums();
  }, [city]);

  const fetchCityForums = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: forumPosts, error: forumError } = await supabase
        .from('city_forums')
        .select(`
          *,
          profiles:author_id(name, avatar_url)
        `)
        .eq('city', city)
        .order('created_at', { ascending: false });

      if (forumError) {
        throw forumError;
      }

      // Transform the data to match our expected types
      const formattedPosts: ForumPost[] = forumPosts.map(post => ({
        id: post.id,
        city: post.city,
        title: post.title,
        content: post.content,
        author_id: post.author_id,
        created_at: post.created_at,
        author: post.profiles ? {
          name: post.profiles.name,
          avatar_url: post.profiles.avatar_url
        } : undefined
      }));

      setPosts(formattedPosts);
    } catch (err: any) {
      console.error('Error fetching city forums:', err);
      setError(err.message);
      toast.error('Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string, userId: string) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('city_forums')
        .insert({
          city,
          title,
          content,
          author_id: userId
        })
        .select(`
          *,
          profiles:author_id(name, avatar_url)
        `)
        .single();

      if (insertError) {
        throw insertError;
      }

      // Format the new post
      const newPost: ForumPost = {
        id: data.id,
        city: data.city,
        title: data.title,
        content: data.content,
        author_id: data.author_id,
        created_at: data.created_at,
        author: data.profiles ? {
          name: data.profiles.name,
          avatar_url: data.profiles.avatar_url
        } : undefined
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err: any) {
      console.error('Error creating forum post:', err);
      setError(err.message);
      toast.error('Failed to create post');
      throw err;
    }
  };

  return { posts, loading, error, createPost, refreshPosts: fetchCityForums };
}
