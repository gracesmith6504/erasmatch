
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "./types";
import { Profile } from "@/types";
import StudentList from "./StudentList";

interface UniversityCardProps {
  university: University;
}

const UniversityCard = ({ university }: UniversityCardProps) => {
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder programs - in a real app, these would come from the database
  const programs = ["Business", "Engineering", "Arts"];
  
  // Fetch students when "View Students" is clicked
  const fetchStudents = async () => {
    if (showStudents) {
      // If already showing students, just toggle the view
      setShowStudents(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("university", university.name);
      
      if (error) {
        console.error("Error fetching students:", error);
        return;
      }
      
      setStudents(data as Profile[] || []);
      setShowStudents(true);
    } catch (error) {
      console.error("Error in fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudents = () => {
    if (!showStudents) {
      fetchStudents();
    } else {
      setShowStudents(false);
    }
  };

  // Image based on the university name (placeholder)
  const universityImage = `https://source.unsplash.com/400x200/?university,${university.name.replace(/\s/g, '+')}`;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={universityImage} 
          alt={university.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <h2 className="text-xl font-semibold">{university.name}</h2>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{university.city || "City not specified"}{university.country ? `, ${university.country}` : ""}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Available Programs:</div>
          <div className="flex flex-wrap gap-2">
            {programs.map((program) => (
              <Badge key={program} variant="outline" className="bg-erasmatch-blue/10">
                {program}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={toggleStudents} 
          variant="outline" 
          className="w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading ? "Loading..." : (
            <>
              {showStudents ? <ChevronUp className="mr-1" /> : <ChevronDown className="mr-1" />}
              {showStudents ? "Hide Students" : "View Students"}
            </>
          )}
        </Button>
        <Link to="/profile" className="w-full">
          <Button className="w-full">Update Your Profile</Button>
        </Link>
      </CardFooter>
      
      {showStudents && (
        <div className="px-6 pb-6">
          <StudentList students={students} />
        </div>
      )}
    </Card>
  );
};

export default UniversityCard;
