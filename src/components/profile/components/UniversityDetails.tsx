
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type UniversityDetailsProps = {
  form: {
    home_university: string;
    course: string | null;
    university: string;
    city: string | null;
    semester: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleUniversityChange: (university: string) => void;
  handleHomeUniversityChange: (university: string) => void;
};

const SEMESTERS = ["Fall 2024", "Spring 2025", "Fall 2025", "Spring 2026"];

export const UniversityDetails = ({
  form,
  handleChange,
  handleSelectChange,
  handleUniversityChange,
  handleHomeUniversityChange
}: UniversityDetailsProps) => {
  const navigate = useNavigate();

  // Handle realtime university changes to automatically update group chats
  useEffect(() => {
    // When university changes and we have a valid university, show a toast notification
    if (form.university && form.university.trim().length > 0) {
      toast.success(`You've been added to the ${form.university} chat group`, {
        description: "Check your messages to join the conversation",
        action: {
          label: "View Chat",
          onClick: () => navigate('/messages')
        }
      });
    }
  }, [form.university, navigate]);

  // Enhanced handleUniversityChange function to better handle the change
  const enhancedUniversityChange = (university: string) => {
    // Call the original handler
    handleUniversityChange(university);
    
    // If the university is valid, show a notification that you've joined the chat
    if (university && university.trim().length > 0) {
      toast.success(`You've been added to the ${university} chat group`, {
        description: "Check your messages to join the conversation",
        action: {
          label: "View Chat",
          onClick: () => navigate('/messages')
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <UniversityAutocomplete
          value={form.home_university}
          onChange={handleHomeUniversityChange}
          label="Home University"
          required={true}
        />
      </div>

      <div>
        <Label htmlFor="course" className="block text-sm font-medium text-gray-700">
          Course Name
        </Label>
        <Input
          id="course"
          name="course"
          value={form.course || ""}
          onChange={handleChange}
          placeholder="Enter your course name"
          className="mt-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="space-y-2">
        <UniversityAutocomplete
          value={form.university}
          onChange={enhancedUniversityChange}
          label="Destination University"
          required={false}
        />
        
        {/* Display city as read-only information */}
        {form.university && (
          <div className="flex items-center text-sm mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1 text-erasmatch-green" />
            <span>
              {form.city ? form.city : "City not available for this university"}
            </span>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="semester" className="block text-sm font-medium text-gray-700">
          Exchange Semester
        </Label>
        <Select
          value={form.semester || ""}
          onValueChange={(value) => handleSelectChange("semester", value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            {SEMESTERS.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
