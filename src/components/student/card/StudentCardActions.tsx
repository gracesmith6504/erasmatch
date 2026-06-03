import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ConnectModal from "@/components/student/ConnectModal";
import { useAuth } from "@/contexts/AuthContext";

interface StudentCardActionsProps {
  studentId: string;
  studentName: string;
  studentCity?: string | null;
  studentUniversity?: string | null;
  studentAvatarUrl?: string | null;
  studentSemester?: string | null;
  studentLastActiveAt?: string | null;
  initialNote?: string;
}

const StudentCardActions: React.FC<StudentCardActionsProps> = ({
  studentId,
  studentName,
  studentCity,
  studentUniversity,
  studentAvatarUrl,
  studentSemester,
  studentLastActiveAt,
  initialNote,
}) => {
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
    e.stopPropagation();
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("message_button_clicked");
    }
    setConnectOpen(true);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full rounded-full border-border/70 font-medium hover:bg-secondary transition-colors"
        onClick={handleConnectClick}
      >
        <UserPlus className="mr-1.5 h-4 w-4" /> Connect
      </Button>

      <ConnectModal
        open={connectOpen}
        onOpenChange={setConnectOpen}
        studentId={studentId}
        studentName={studentName}
        studentAvatarUrl={studentAvatarUrl}
        studentCity={studentCity}
        studentSemester={studentSemester}
        sharedCity={sharedCity}
        sharedUniversity={sharedUniversity}
        initialNote={initialNote}
      />
    </>
  );
};

export default StudentCardActions;

