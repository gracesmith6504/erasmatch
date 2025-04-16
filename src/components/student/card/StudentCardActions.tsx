
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Globe } from "lucide-react";

interface StudentCardActionsProps {
  studentId: string;
}

const StudentCardActions: React.FC<StudentCardActionsProps> = ({ studentId }) => {
  const navigate = useNavigate();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to messages with user ID as URL parameter
    navigate(`/messages?user=${studentId}`);
    
    // Ensure the page scrolls to top when navigating to messages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-1/2 button-hover group-hover:bg-blue-50 transition-colors"
        onClick={handleMessageClick}
      >
        <Mail className="mr-1 h-4 w-4" /> Message
      </Button>
      <Link to={`/profile/${studentId}`} className="w-1/2">
        <Button className="w-full button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple hover:from-erasmatch-purple hover:to-erasmatch-blue">
          <Globe className="mr-1 h-4 w-4" /> Profile
        </Button>
      </Link>
    </>
  );
};

export default StudentCardActions;
