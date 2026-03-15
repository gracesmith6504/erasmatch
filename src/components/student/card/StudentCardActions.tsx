import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Globe } from "lucide-react";
import { recordProfileView } from "@/hooks/useProfileViewers";

interface StudentCardActionsProps {
  studentId: string;
}

const StudentCardActions: React.FC<StudentCardActionsProps> = ({ studentId }) => {
  const navigate = useNavigate();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/messages?user=${studentId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        onClick={handleMessageClick}
      >
        <Mail className="mr-1 h-4 w-4" /> Message
      </Button>
      <Button
        onClick={handleProfileClick}
        className="w-1/2 bg-foreground text-background hover:bg-foreground/90"
      >
        <Globe className="mr-1 h-4 w-4" /> Profile
      </Button>
    </>
  );
};

export default StudentCardActions;