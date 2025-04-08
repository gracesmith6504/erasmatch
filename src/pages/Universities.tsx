
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UniversityFilters from "@/components/university/UniversityFilters";
import UniversityCardGrid from "@/components/university/UniversityCardGrid";
import UniversityLoadingSkeleton from "@/components/university/UniversityLoadingSkeleton";
import { useUniversitiesData } from "@/hooks/useUniversitiesData";

const Universities = () => {
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

  if (loading) {
    return <UniversityLoadingSkeleton />;
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
    </div>
  );
};

export default Universities;
