
import React from "react";
import { useAccommodationListings } from "@/hooks/useAccommodationListings";
import AccommodationFilters from "@/components/accommodation/AccommodationFilters";
import ListingsGrid from "@/components/accommodation/ListingsGrid";
import AccommodationLoadingSkeleton from "@/components/accommodation/AccommodationLoadingSkeleton";

const Accommodation = () => {
  const {
    listings,
    loading,
    cityFilter,
    setCityFilter,
    roomTypeFilter,
    setRoomTypeFilter,
    uniqueCities,
    uniqueRoomTypes,
    resetFilters,
    hasActiveFilters
  } = useAccommodationListings();

  if (loading) {
    return <AccommodationLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">Find Accommodation</h1>
      
      {/* Filters */}
      <AccommodationFilters
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        roomTypeFilter={roomTypeFilter}
        setRoomTypeFilter={setRoomTypeFilter}
        uniqueCities={uniqueCities}
        uniqueRoomTypes={uniqueRoomTypes}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />
      
      {/* Listings */}
      <ListingsGrid 
        listings={listings} 
        hasFilters={hasActiveFilters}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default Accommodation;
