
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, School, MapPin, CalendarClock, Home } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { getTagColorClass } from "@/components/profile/PersonalityTagSelector";

type ProfileViewProps = {
  profiles: Profile[];
  currentUserId: string | null;
  onSendMessage: (receiverId: string, content: string) => void;
};

const ProfileView = ({ profiles, currentUserId, onSendMessage }: ProfileViewProps) => {
  const { id } = useParams<{ id: string }>();
  const profile = profiles.find((p) => p.id === id);
  const [universityCity, setUniversityCity] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUniversityCity = async () => {
      if (!profile?.university) return;
      
      setIsLoadingCity(true);
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('city')
          .eq('name', profile.university)
          .single();

        if (error) throw error;
        setUniversityCity(data?.city || null);
      } catch (error) {
        console.error("Error fetching university city:", error);
      } finally {
        setIsLoadingCity(false);
      }
    };

    fetchUniversityCity();
  }, [profile?.university]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !id || !currentUserId) return;
    
    setIsSending(true);
    try {
      await onSendMessage(id, messageContent);
      setMessageContent("");
      setIsMessageDialogOpen(false);
      toast.success("Message sent successfully");
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
      console.error("Message sending error:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Student not found</h2>
        <p className="mt-2 text-gray-600">The profile you are looking for does not exist or has been removed.</p>
        <Link to="/students">
          <Button variant="outline" className="mt-4">
            Back to Students
          </Button>
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUserId === profile.id;
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const personalityTags = profile.personality_tags || [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-green h-32"></div>
        <div className="px-4 sm:px-6 py-5 relative">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-shrink-0 -mt-16 relative z-10">
                <Avatar className="h-24 w-24 ring-4 ring-white">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-lg bg-erasmatch-light-accent">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                
                {/* Personality tags */}
                {personalityTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {personalityTags.map(tag => (
                      <Badge key={tag} variant="outline" className={`${getTagColorClass(tag)}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!isOwnProfile && currentUserId && (
              <div className="mt-5 sm:mt-0">
                <Button 
                  onClick={() => setIsMessageDialogOpen(true)}
                  className="w-full sm:w-auto flex items-center"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Home className="h-5 w-5 mr-2 text-erasmatch-purple" />
                <span>{profile.home_university || "Home university not specified"}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <School className="h-5 w-5 mr-2 text-erasmatch-blue" />
                <span>{profile.university || "University not specified"}</span>
              </div>
              {(profile.university && !isLoadingCity) ? (
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-erasmatch-blue" />
                  <span>{universityCity || "Destination city not available"}</span>
                </div>
              ) : isLoadingCity ? (
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-5 w-5 mr-2 text-erasmatch-blue" />
                  <span>Loading city information...</span>
                </div>
              ) : null}
              <div className="flex items-center text-gray-700">
                <CalendarClock className="h-5 w-5 mr-2 text-erasmatch-blue" />
                <span>{profile.semester || "Semester not specified"}</span>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
              <p className="text-gray-700">
                {profile.bio || "No bio information provided."}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-6 flex justify-end">
              <Link to="/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {profile.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Write your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="min-h-32"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSendMessage} 
              disabled={!messageContent.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileView;
