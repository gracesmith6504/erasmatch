
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, MapPin, Users, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
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
  const [imageError, setImageError] = useState(false);

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
      
      // Transform data to match Profile type with all required fields
      const profilesWithRequiredFields = data?.map(profile => ({
        ...profile,
        // Ensure all required fields are present with default values if they don't exist
        country: null,
        interests: null
      })) as unknown as Profile[];
      
      setStudents(profilesWithRequiredFields || []);
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

  // Image with fallback
  const universityImage = imageError || !university.image_url 
    ? `https://source.unsplash.com/600x400/?university,${university.name.replace(/\s/g, '+')}` 
    : university.image_url;

  return (
    <Card className="overflow-hidden h-full flex flex-col card-hover bg-white border border-gray-100">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={universityImage} 
          alt={`Image of ${university.name}`} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold text-white">{university.name}</h2>
            {university.student_count !== undefined && university.student_count > 0 && (
              <Badge className="bg-erasmatch-blue border-0 text-white flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {university.student_count} {university.student_count === 1 ? 'student' : 'students'}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-white/90 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{university.city || "City not specified"}{university.country ? `, ${university.country}` : ""}</span>
          </div>
        </div>
      </div>
      <CardContent className="flex-grow pt-4">
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium mb-2 text-gray-700">
            <School className="h-4 w-4 mr-1.5 text-erasmatch-blue" />
            <span>Available Programs:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {programs.map((program) => (
              <Badge key={program} variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-erasmatch-lightblue/30 text-erasmatch-blue">
                {program}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          {university.description || "Explore this university to learn more about their programs and connect with other students heading there."}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col space-y-2">
        <Button 
          onClick={toggleStudents} 
          variant="outline" 
          className="w-full flex items-center justify-center transition-all button-hover"
          disabled={loading}
        >
          {loading ? "Loading..." : (
            <>
              {showStudents ? <ChevronUp className="mr-1.5" /> : <ChevronDown className="mr-1.5" />}
              {showStudents ? "Hide Students" : "View Students"}
              <Users className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
        <Link to={`/university-hub/${university.id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 hover:opacity-90 transition-all">
            <BookOpen className="mr-2 h-4 w-4" /> Discover University
          </Button>
        </Link>
      </CardFooter>
      
      {showStudents && (
        <div className="px-6 pb-6 animate-fade-in">
          <StudentList students={students} />
        </div>
      )}
    </Card>
  );
};

export default UniversityCard;
