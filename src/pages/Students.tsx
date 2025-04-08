
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
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock, Search, Filter, X } from "lucide-react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
  const [uniqueCities, setUniqueCities] = useState<string[]>([]); // Fixed: changed from setUniqueUniversities to setUniqueCities
  const [uniqueSemesters, setUniqueSemesters] = useState<string[]>([]);
  const [loadedProfiles, setLoadedProfiles] = useState<Profile[]>(profiles);
  const [loading, setLoading] = useState(true);

  // Fetch profiles from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          setLoadedProfiles(data as Profile[]);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    // Extract unique filter options
    if (loadedProfiles.length > 0) {
      const universities = [...new Set(loadedProfiles.map(p => p.university).filter(Boolean))] as string[];
      const cities = [...new Set(loadedProfiles.map(p => p.city).filter(Boolean))] as string[];
      const semesters = [...new Set(loadedProfiles.map(p => p.semester).filter(Boolean))] as string[];
      
      setUniqueUniversities(universities);
      setUniqueCities(cities); // Fixed: changed from setUniqueUniversities to setUniqueCities
      setUniqueSemesters(semesters);
    }
  }, [loadedProfiles]);

  // Filter profiles based on search and filters
  const filteredProfiles = loadedProfiles.filter(profile => {
    // Skip current user
    if (profile.id === currentUserId) return false;

    const nameMatch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm;
    const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
    const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;
    const semesterMatch = !semesterFilter || semesterFilter === "all-semesters" || profile.semester === semesterFilter;

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

  // Rendering skeleton loaders during loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="h-10 w-60 skeleton rounded-xl mb-6"></div>
        
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="h-12 w-full skeleton rounded-lg lg:col-span-2"></div>
            <div className="h-12 w-full skeleton rounded-lg"></div>
            <div className="h-12 w-full skeleton rounded-lg"></div>
            <div className="h-12 w-full skeleton rounded-lg"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-80 w-full skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">Find Erasmus Students</h1>

      <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 focus:border-erasmatch-blue"
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
                <div className="flex items-center">
                  <School className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="University" />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all-universities">All Universities</SelectItem>
                {uniqueUniversities.map((uni) => (
                  <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="City" />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all-cities">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
                <div className="flex items-center">
                  <CalendarClock className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Semester" />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all-semesters">All Semesters</SelectItem>
                {uniqueSemesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Tag display for active filters */}
        {(searchTerm || universityFilter || cityFilter || semesterFilter) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
            <div className="text-sm text-gray-500 mr-1">Active filters:</div>
            {searchTerm && (
              <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded-full">
                Search: {searchTerm}
                <button className="ml-1" onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {universityFilter && universityFilter !== "all-universities" && (
              <div className="inline-flex items-center text-xs bg-purple-50 text-purple-700 py-1 px-2 rounded-full">
                University: {universityFilter}
                <button className="ml-1" onClick={() => setUniversityFilter("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {cityFilter && cityFilter !== "all-cities" && (
              <div className="inline-flex items-center text-xs bg-green-50 text-green-700 py-1 px-2 rounded-full">
                City: {cityFilter}
                <button className="ml-1" onClick={() => setCityFilter("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {semesterFilter && semesterFilter !== "all-semesters" && (
              <div className="inline-flex items-center text-xs bg-orange-50 text-orange-700 py-1 px-2 rounded-full">
                Semester: {semesterFilter}
                <button className="ml-1" onClick={() => setSemesterFilter("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={resetFilters} className="button-hover">
            Reset All Filters
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{filteredProfiles.length}</span> students
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No students found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
          <Button className="button-hover" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden card-hover border-gray-100">
              <div className="h-24 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple"></div>
              <div className="-mt-12 flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardContent className="pt-4 text-center">
                <h3 className="font-semibold text-lg text-gray-900 mt-4">{profile.name || "Anonymous Student"}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
                    <span>{profile.university || "University not specified"}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
                    <span>{profile.city || "City not specified"}</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CalendarClock className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
                    <span>{profile.semester || "Semester not specified"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-1 flex justify-center">
                <Link to={`/profile/${profile.id}`}>
                  <Button variant="outline" className="button-hover">View Profile</Button>
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
