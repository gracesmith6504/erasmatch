
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UniversityFilters from "@/components/university/UniversityFilters";
import UniversityCardGrid from "@/components/university/UniversityCardGrid";
import UniversityLoadingSkeleton from "@/components/university/UniversityLoadingSkeleton";
import { useUniversitiesData } from "@/hooks/useUniversitiesData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { MapPin, Building } from "lucide-react";

const Locations = () => {
  const {
    universities,
    filteredUniversities,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    uniqueCountries,
    handleResetFilters
  } = useUniversitiesData();

  const [activeTab, setActiveTab] = useState<"universities" | "cities">("universities");

  if (loading) {
    return <UniversityLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm border border-red-100">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error loading locations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button className="button-hover bg-gradient-to-r from-red-500 to-orange-500 text-white" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 animate-fade-in overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold gradient-text">Discover Locations</h1>
        <Link to="/profile">
          <Button className="button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple border-0 text-white w-full sm:w-auto">
            Update Your Profile
          </Button>
        </Link>
      </div>
      
      {/* Tab selection */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "universities" | "cities")} className="mb-6 w-full">
        <TabsList className="w-full md:w-auto bg-muted/50 mb-4">
          <TabsTrigger value="universities" className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 md:flex-none">
            <Building className="h-4 w-4 mr-1 sm:mr-1.5" />
            <span>Universities</span>
          </TabsTrigger>
          <TabsTrigger value="cities" className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 md:flex-none">
            <MapPin className="h-4 w-4 mr-1 sm:mr-1.5" />
            <span>Cities</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="universities" className="mt-0 w-full">
          {/* Search and Filters */}
          <UniversityFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            uniqueCountries={uniqueCountries}
            onResetFilters={handleResetFilters}
          />
          
          {/* University Cards */}
          <UniversityCardGrid
            universities={filteredUniversities}
            filteredCount={filteredUniversities.length}
            totalCount={universities.length}
            onResetFilters={handleResetFilters}
          />
        </TabsContent>
        
        <TabsContent value="cities" className="mt-0 w-full">
          <div className="flex justify-center mb-6">
            <Link to="/forum" className="w-full max-w-md">
              <Button className="w-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-green border-0 text-white flex items-center justify-center space-x-2 py-4 sm:py-6">
                <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                <span className="text-base sm:text-lg">Explore City Forums</span>
              </Button>
            </Link>
          </div>
          
          <p className="text-center text-gray-600">
            Visit our city forums to connect with students and discover information about cities across Europe.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Locations;
