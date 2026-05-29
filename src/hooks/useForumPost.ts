
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ForumPost, ForumComment } from '@/components/forum/types';
import { toast } from 'sonner';

export function useForumPost(postId: string) {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the forum post - using any to bypass type checking
      const { data: postData, error: postError } = await (supabase as any)
        .from('city_forums')
        .select(`
          *,
          profiles:author_id(name, avatar_url)
        `)
        .eq('id', postId)
        .single();

      if (postError) {
        throw postError;
      }

      // Format the post data
      const formattedPost: ForumPost = {
        id: postData.id,
        city: postData.city,
        title: postData.title,
        content: postData.content,
        author_id: postData.author_id,
        created_at: postData.created_at,
        author: postData.profiles ? {
          name: postData.profiles.name,
          avatar_url: postData.profiles.avatar_url
        } : undefined
      };

      setPost(formattedPost);

      // Fetch comments for the post
      const { data: commentData, error: commentError } = await (supabase as any)
        .from('city_comments')
        .select(`
          *,
          profiles:author_id(name, avatar_url)
        `)
        .eq('forum_id', postId)
        .order('created_at', { ascending: true });

      if (commentError) {
        throw commentError;
      }

      // Format the comments data
      const formattedComments: ForumComment[] = commentData.map((comment: any) => ({
        id: comment.id,
        forum_id: comment.forum_id,
        author_id: comment.author_id,
        content: comment.content,
        created_at: comment.created_at,
        author: comment.profiles ? {
          name: comment.profiles.name,
          avatar_url: comment.profiles.avatar_url
        } : undefined
      }));

      setComments(formattedComments);
    } catch (err: any) {
      console.error('Error fetching forum post and comments:', err);
      setError(err.message);
      toast.error('Failed to load post and comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, userId: string) => {
    if (!postId) return;

    try {
      setError(null);
      
      // Use any to bypass type checking
      const { data, error: insertError } = await (supabase as any)
        .from('city_comments')
        .insert({
          forum_id: postId,
          author_id: userId,
          content
        })
        .select(`
          *,
          profiles:author_id(name, avatar_url)
        `)
        .single();

      if (insertError) {
        throw insertError;
      }

      // Format the new comment
      const newComment: ForumComment = {
        id: data.id,
        forum_id: data.forum_id,
        author_id: data.author_id,
        content: data.content,
        created_at: data.created_at,
        author: data.profiles ? {
          name: data.profiles.name,
          avatar_url: data.profiles.avatar_url
        } : undefined
      };

      setComments(prevComments => [...prevComments, newComment]);
      return newComment;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      setError(err.message);
      toast.error('Failed to add comment');
      throw err;
    }
  };

  return { 
    post, 
    comments, 
    loading, 
    error, 
    addComment,
    refreshData: fetchPostAndComments
  };
}
