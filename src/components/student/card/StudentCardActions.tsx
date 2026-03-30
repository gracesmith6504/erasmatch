import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, Globe } from "lucide-react";
import { recordProfileView } from "@/hooks/useProfileViewers";
import ConnectModal from "@/components/student/ConnectModal";
import { useAuth } from "@/contexts/AuthContext";

interface StudentCardActionsProps {
  studentId: string;
  studentName: string;
  studentCity?: string | null;
  studentUniversity?: string | null;
  initialNote?: string;
}

const StudentCardActions: React.FC<StudentCardActionsProps> = ({
  studentId,
  studentName,
  studentCity,
  studentUniversity,
  initialNote,
}) => {
  const navigate = useNavigate();
  const { currentUserProfile } = useAuth();
  const [connectOpen, setConnectOpen] = useState(false);

  const sharedCity =
    currentUserProfile?.city && studentCity && currentUserProfile.city === studentCity
      ? studentCity
      : null;

  const sharedUniversity =
    currentUserProfile?.university && studentUniversity && currentUserProfile.university === studentUniversity
      ? studentUniversity
      : null;

  const handleConnectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setConnectOpen(true);
  };

  const handleProfileClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await recordProfileView(studentId);
    navigate(`/profile/${studentId}`, { state: { fromProfile: true } });
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-1/2 border-border hover:bg-secondary transition-colors"
        onClick={handleConnectClick}
      >
        <UserPlus className="mr-1 h-4 w-4" /> Connect
      </Button>
      <Button
        onClick={handleProfileClick}
        className="w-1/2 bg-foreground text-background hover:bg-foreground/90"
      >
        <Globe className="mr-1 h-4 w-4" /> Profile
      </Button>

      <ConnectModal
        open={connectOpen}
        onOpenChange={setConnectOpen}
        studentId={studentId}
        studentName={studentName}
        sharedCity={sharedCity}
        sharedUniversity={sharedUniversity}
      />
    </>
  );
};

export default StudentCardActions;
