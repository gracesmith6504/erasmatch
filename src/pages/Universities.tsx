
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
import { Search, X, Filter } from "lucide-react";

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

  // Rendering skeleton loaders during loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-60 skeleton rounded-lg"></div>
          <div className="h-10 w-40 skeleton rounded-lg"></div>
        </div>
        
        {/* Search and filter skeletons */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 w-full skeleton rounded-lg"></div>
            <div className="h-10 w-full sm:w-48 skeleton rounded-lg"></div>
            <div className="h-10 w-full sm:w-32 skeleton rounded-lg"></div>
          </div>
        </div>
        
        {/* Results count skeleton */}
        <div className="mb-4 h-5 w-40 skeleton rounded-lg"></div>
        
        {/* University card skeletons */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-96 w-full skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-red-100">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error loading universities</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button className="button-hover bg-gradient-to-r from-red-500 to-orange-500 text-white" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold gradient-text">Discover Universities</h1>
        <Link to="/profile">
          <Button className="button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white">
            Update Your Profile
          </Button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search universities, cities, programs..."
              className="pl-10 h-12 border-gray-200 focus:border-erasmatch-blue transition-colors"
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
          
          <div className="relative min-w-[200px]">
            <Select 
              value={selectedCountry} 
              onValueChange={setSelectedCountry}
            >
              <SelectTrigger className="w-full h-12 border-gray-200 focus:border-erasmatch-blue transition-colors">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Select Country" />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="h-12 sm:w-auto button-hover"
            disabled={!searchQuery && selectedCountry === "all"}
          >
            Reset Filters
          </Button>
        </div>
        
        {/* Tag display for active filters */}
        {(searchQuery || selectedCountry !== "all") && (
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
            <div className="text-sm text-gray-500 mr-1">Active filters:</div>
            {searchQuery && (
              <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded-full">
                Search: {searchQuery}
                <button className="ml-1" onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {selectedCountry !== "all" && (
              <div className="inline-flex items-center text-xs bg-purple-50 text-purple-700 py-1 px-2 rounded-full">
                Country: {selectedCountry}
                <button className="ml-1" onClick={() => setSelectedCountry("all")}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{filteredUniversities.length}</span> of <span className="font-medium text-gray-900">{universities.length}</span> universities
      </div>
      
      {filteredUniversities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No universities found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <Button className="button-hover" onClick={handleResetFilters}>
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
