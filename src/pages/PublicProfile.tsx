import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, School, Calendar, User, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const PublicProfile = () => {
  const { refCode } = useParams<{ refCode: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileByRefCode = async () => {
      if (!refCode) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('ref_code', refCode)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setError('User not found');
          setLoading(false);
          return;
        }
        
        setProfile(data as Profile);
      } catch (err) {
        console.error('Error in fetch operation:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileByRefCode();
  }, [refCode]);

  const handleConnectClick = () => {
    if (!isAuthenticated && refCode) {
      navigate(`/auth?mode=signup&ref=${refCode}&returnTo=/u/${refCode}`);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="-mt-16 flex justify-center">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
          </div>
          <div className="pt-5 pb-10 px-6 text-center">
            <Skeleton className="h-6 w-2/3 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-6" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">User Not Found</h2>
          <p className="mt-2 text-gray-600">The user you're looking for doesn't exist or the link is invalid.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="-mt-16 flex justify-center">
          <Avatar className="w-32 h-32 rounded-full border-4 border-white bg-white">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Profile"} />
            <AvatarFallback className="bg-indigo-100 text-indigo-800 text-2xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-5 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name || "Erasmus Student"}</h1>
          <p className="text-sm text-gray-500 mt-1">{profile.email}</p>
          
          {profile.university && (
            <Badge variant="outline" className="mt-2 bg-indigo-50 text-indigo-700 border-indigo-200">
              {profile.university}
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            {profile.home_university && (
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="text-gray-700">{profile.home_university}</span>
              </div>
            )}
            
            {profile.university && (
              <div className="flex items-center">
                <School className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="text-gray-700">{profile.university}</span>
              </div>
            )}
            
            {profile.semester && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="text-gray-700">{profile.semester}</span>
              </div>
            )}

            {profile.city && (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                <span className="text-gray-700">{profile.city}</span>
              </div>
            )}
          </div>
          
          {profile.bio && (
            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">About</h2>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}
          
          <div className="mt-6">
            {isAuthenticated ? (
              <Link to={`/profile/${profile.id}`}>
                <Button className="w-full">View Full Profile</Button>
              </Link>
            ) : (
              <Button 
                onClick={handleConnectClick} 
                className="w-full flex items-center justify-center"
              >
                <LogIn className="mr-2 h-5 w-5" /> 
                Log in to connect
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
