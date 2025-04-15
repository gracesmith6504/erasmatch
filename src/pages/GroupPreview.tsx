
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Users, Lock, Globe, MapPin, Calendar } from "lucide-react";

type Group = {
  id: string;
  name: string;
  type: "university" | "city" | "custom";
  description: string | null;
  visibility: "public" | "private" | "unlisted";
  creator_id: string | null;
  created_at: string;
  slug: string;
  member_count?: number;
};

const GroupPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserMember, setIsUserMember] = useState(false);
  const { isAuthenticated, currentUserId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("slug", slug)
          .single();
          
        if (groupError) throw groupError;
        
        if (groupData) {
          // Get member count
          const { count, error: countError } = await supabase
            .from("group_members")
            .select("*", { count: 'exact', head: true })
            .eq("group_id", groupData.id);
            
          if (countError) throw countError;
          
          setGroup({
            ...groupData,
            member_count: count || 0
          });
          
          // Check if current user is a member
          if (isAuthenticated && currentUserId) {
            const { data: memberData, error: memberError } = await supabase
              .from("group_members")
              .select("*")
              .eq("group_id", groupData.id)
              .eq("user_id", currentUserId)
              .maybeSingle();
              
            if (!memberError && memberData) {
              setIsUserMember(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroup();
  }, [slug, isAuthenticated, currentUserId]);
  
  const handleJoinClick = async () => {
    if (!group) return;
    
    if (!isAuthenticated) {
      // Redirect to auth page with group slug
      navigate(`/auth?mode=signup&group=${encodeURIComponent(slug!)}&returnTo=/groups/${encodeURIComponent(slug!)}`);
      return;
    }
    
    // User is authenticated, join the group directly
    try {
      await supabase.rpc("join_group_by_slug", {
        user_id: currentUserId,
        group_slug: slug
      });
      
      // Navigate to the Groups page
      navigate("/groups");
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };
  
  const getGroupIcon = () => {
    if (!group) return null;
    
    switch (group.type) {
      case "university":
        return <GraduationCap className="w-12 h-12 text-purple-500" />;
      case "city":
        return <MapPin className="w-12 h-12 text-blue-500" />;
      default:
        return <Users className="w-12 h-12 text-green-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Group Not Found</h1>
        <p className="mb-8">The group you're looking for doesn't exist or may have been removed.</p>
        <Button onClick={() => navigate("/groups")}>
          Browse Groups
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {group.visibility === "public" ? (
                  <Globe className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span className="text-sm uppercase tracking-wider font-medium">
                  {group.visibility} {group.type} group
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
              
              <div className="flex items-center text-sm text-white/90 mt-4">
                <Users className="w-4 h-4 mr-1" />
                <span>{group.member_count} members</span>
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            {getGroupIcon()}
          </div>
        </div>
        
        <div className="p-8">
          {group.description && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">About this group</h2>
              <p className="text-gray-700">{group.description}</p>
            </div>
          )}
          
          {isUserMember ? (
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate("/groups")}>
                You're already a member
              </Button>
              <Button onClick={() => navigate("/groups")}>
                Open Chat
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleJoinClick}>
                {isAuthenticated ? "Join this chat" : "Sign up & join"}
              </Button>
              {isAuthenticated ? null : (
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate(`/auth?mode=login&group=${encodeURIComponent(slug!)}&returnTo=/groups/${encodeURIComponent(slug!)}`)}>
                  Already have an account? Log in
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GroupPreview;
