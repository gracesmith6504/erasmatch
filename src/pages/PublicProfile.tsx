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
          setError('User not found');
          setLoading(false);
          return;
        }
        setProfile(data as Profile);
      } catch (err) {
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
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const getSecondaryInfo = (profile: Profile) => {
    if (profile.city) return profile.city;
    if (profile.university) return profile.university;
    if (profile.home_university) return profile.home_university;
    if (profile.course) return profile.course;
    return "Erasmus Student";
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-card shadow-card rounded-2xl overflow-hidden border border-border">
          <div className="h-32 bg-gradient-to-r from-erasmatch-green/30 to-erasmatch-blue/30"></div>
          <div className="-mt-16 flex justify-center">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-card" />
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
        <div className="bg-card shadow-card rounded-2xl p-6 text-center border border-border">
          <h2 className="text-2xl font-display font-bold text-foreground">User Not Found</h2>
          <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist or the link is invalid.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-card shadow-card rounded-2xl overflow-hidden border border-border">
        <div className="h-32 bg-gradient-to-r from-erasmatch-green/30 to-erasmatch-blue/30"></div>
        <div className="-mt-16 flex justify-center">
          <Avatar className="w-32 h-32 rounded-full border-4 border-card bg-card">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Profile"} />
            <AvatarFallback className="bg-secondary text-foreground text-2xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-5 px-6 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">{profile.name || "Erasmus Student"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{getSecondaryInfo(profile)}</p>
          
          {profile.university && (
            <Badge variant="outline" className="mt-2 bg-erasmatch-green/10 text-erasmatch-green border-erasmatch-green/20">
              {profile.university}
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
            {profile.home_university && (
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-erasmatch-purple" />
                <span className="text-foreground">{profile.home_university}</span>
              </div>
            )}
            {profile.university && (
              <div className="flex items-center">
                <School className="h-5 w-5 mr-2 text-erasmatch-blue" />
                <span className="text-foreground">{profile.university}</span>
              </div>
            )}
            {profile.semester && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-erasmatch-coral" />
                <span className="text-foreground">{profile.semester}</span>
              </div>
            )}
            {profile.city && (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-erasmatch-green" />
                <span className="text-foreground">{profile.city}</span>
              </div>
            )}
          </div>
          
          {profile.bio && (
            <div className="mt-4">
              <h2 className="text-lg font-display font-semibold text-foreground mb-2">About</h2>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
          )}
          
          <div className="mt-6">
            {isAuthenticated ? (
              <Link to={`/profile/${profile.id}`}>
                <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">View Full Profile</Button>
              </Link>
            ) : (
              <Button 
                onClick={handleConnectClick} 
                className="w-full flex items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90"
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