
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock, Search } from "lucide-react";
import { Profile } from "@/types";

type StudentsProps = {
  profiles: Profile[];
  currentUserId: string | null;
};

const Students = ({ profiles, currentUserId }: StudentsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  const [uniqueUniversities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueCities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueSemesters, setUniqueSemesters] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique filter options
    if (profiles.length > 0) {
      const universities = [...new Set(profiles.map(p => p.university).filter(Boolean))] as string[];
      const cities = [...new Set(profiles.map(p => p.city).filter(Boolean))] as string[];
      const semesters = [...new Set(profiles.map(p => p.semester).filter(Boolean))] as string[];
      
      setUniqueUniversities(universities);
      setUniqueUniversities(cities);
      setUniqueSemesters(semesters);
    }
  }, [profiles]);

  // Filter profiles based on search and filters
  const filteredProfiles = profiles.filter(profile => {
    // Skip current user
    if (profile.id === currentUserId) return false;

    const nameMatch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm;
    const uniMatch = !universityFilter || profile.university === universityFilter;
    const cityMatch = !cityFilter || profile.city === cityFilter;
    const semesterMatch = !semesterFilter || profile.semester === semesterFilter;

    return nameMatch && uniMatch && cityMatch && semesterMatch;
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setUniversityFilter("");
    setCityFilter("");
    setSemesterFilter("");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Erasmus Students</h1>

      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Universities</SelectItem>
                {uniqueUniversities.map((uni) => (
                  <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Semesters</SelectItem>
                {uniqueSemesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No students found</h2>
          <p className="text-gray-600">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-erasmatch-blue/10 to-erasmatch-green/10 pb-0">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-lg bg-erasmatch-light-accent">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <h3 className="font-semibold text-lg text-gray-900">{profile.name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <School className="h-4 w-4 mr-1 text-erasmatch-blue" />
                    <span>{profile.university || "University not specified"}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 text-erasmatch-blue" />
                    <span>{profile.city || "City not specified"}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CalendarClock className="h-4 w-4 mr-1 text-erasmatch-blue" />
                    <span>{profile.semester || "Semester not specified"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-center">
                <Link to={`/profile/${profile.id}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
