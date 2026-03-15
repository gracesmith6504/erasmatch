import { ProfileProvider } from "@/components/profile/context/ProfileProvider";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { DataExportDialog } from "@/components/profile/DataExportDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserCog, ShieldCheck, Eye, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfileViewers } from "@/hooks/useProfileViewers";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUserId, currentUserProfile, handleProfileUpdate } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (currentUserProfile) {
      setEmailNotifications(currentUserProfile.email_notifications !== false);
    }
  }, [currentUserProfile]);

  const handleToggleEmailNotifications = async (checked: boolean) => {
    setEmailNotifications(checked);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications: checked } as any)
        .eq('id', currentUserId);
      if (error) throw error;
      toast.success(checked ? "Email notifications enabled" : "Email notifications disabled");
    } catch (err: any) {
      setEmailNotifications(!checked);
      toast.error("Failed to update notification preference");
    }
  };

  const fetchProfile = async () => {};

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-center mb-8 text-foreground">
            Your Profile
          </h1>

          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="edit" className="gap-2">
                <UserCog className="h-4 w-4" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Privacy & Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <ProfileProvider
                profile={currentUserProfile}
                onProfileUpdate={handleProfileUpdate}
                fetchProfile={fetchProfile}
              >
                <ProfileForm />
              </ProfileProvider>
            </TabsContent>

            <TabsContent value="privacy">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-display font-semibold text-foreground mb-1">Notifications</h2>
                  <p className="text-sm text-muted-foreground mb-4">Manage how you receive updates.</p>
                  <div className="flex items-center justify-between rounded-xl border border-border p-4 bg-secondary/40">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-sm font-medium text-foreground">
                        Email notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive an email when someone messages you
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={handleToggleEmailNotifications}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-display font-semibold text-foreground mb-1">Your Data</h2>
                  <p className="text-sm text-muted-foreground mb-4">Download or delete your data at any time.</p>
                  <div className="space-y-3">
                    <DataExportDialog userId={currentUserId} />
                    <DeleteAccountDialog userId={currentUserId} />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground pt-2">
                  Your data is protected under GDPR. You can export your data or delete your account at any time.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
