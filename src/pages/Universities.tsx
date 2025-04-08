
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import UniversityCard from "@/components/university/UniversityCard";
import { University } from "@/components/university/types";
import { Search, X } from "lucide-react";

const Universities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }

        const universities = data || [];
        setUniversities(universities);
        setFilteredUniversities(universities);
        
        // Extract unique countries
        const countries = universities
          .map(uni => uni.country)
          .filter(Boolean) // Remove null/undefined values
          .filter((country, index, self) => self.indexOf(country) === index)
          .sort();
        
        setUniqueCountries(countries);
      } catch (err: any) {
        console.error("Error fetching universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filter universities based on search query and selected country
  useEffect(() => {
    let filtered = [...universities];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(uni => 
        (uni.name && uni.name.toLowerCase().includes(query)) ||
        (uni.city && uni.city.toLowerCase().includes(query)) ||
        (uni.country && uni.country.toLowerCase().includes(query))
        // Note: We can't filter by programs here as they're just placeholders in the current implementation
      );
    }
    
    // Filter by country
    if (selectedCountry !== "all") {
      filtered = filtered.filter(uni => uni.country === selectedCountry);
    }
    
    setFilteredUniversities(filtered);
  }, [searchQuery, selectedCountry, universities]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setFilteredUniversities(universities);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Loading universities...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error loading universities</h2>
          <p className="text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Destination Universities</h1>
        <Link to="/profile">
          <Button>Update Your Profile</Button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Search universities, cities, programs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <Select 
          value={selectedCountry} 
          onValueChange={setSelectedCountry}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {uniqueCountries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={handleResetFilters}
          className="w-full sm:w-auto"
          disabled={!searchQuery && selectedCountry === "all"}
        >
          Reset Filters
        </Button>
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredUniversities.length} of {universities.length} universities
      </div>
      
      {filteredUniversities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No universities found</h2>
          <p className="text-gray-600">Try adjusting your search or filters</p>
          <Button className="mt-4" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Universities;
