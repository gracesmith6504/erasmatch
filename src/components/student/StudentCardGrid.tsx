
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Profile } from "@/types";
import StudentCard from "./StudentCard";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";

interface StudentCardGridProps {
  filteredProfiles: Profile[];
  resetFilters: () => void;
  featuredProfiles?: Profile[];
}

const ITEMS_PER_PAGE = 20; // Reduced from 40 to 20 for better performance
const PAGINATION_STATE_KEY = "studentGridPaginationState";

const StudentCardGrid = ({ filteredProfiles, resetFilters, featuredProfiles = [] }: StudentCardGridProps) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  // Process profiles to remove featured profiles from the main list to avoid duplication
  const processedProfiles = useMemo(() => {
    if (featuredProfiles.length === 0) return filteredProfiles;
    
    // Create a Set of featured profile IDs for efficient lookup
    const featuredIds = new Set(featuredProfiles.map(fp => fp.id));
    
    // Filter out featured profiles from the main list to prevent duplication
    return filteredProfiles.filter(p => !featuredIds.has(p.id));
  }, [filteredProfiles, featuredProfiles]);

  // Calculate total pages based on the processed profiles (excluding featured ones)
  const totalPages = Math.ceil(processedProfiles.length / ITEMS_PER_PAGE);

  // Store current page in session storage when it changes
  useEffect(() => {
    sessionStorage.setItem(PAGINATION_STATE_KEY, currentPage.toString());
  }, [currentPage]);

  // Restore pagination state from session storage on component mount
  useEffect(() => {
    const savedPage = sessionStorage.getItem(PAGINATION_STATE_KEY);
    if (savedPage) {
      const parsedPage = parseInt(savedPage, 10);
      // Ensure the page is valid for current data
      if (parsedPage > 0 && parsedPage <= Math.ceil(processedProfiles.length / ITEMS_PER_PAGE)) {
        setCurrentPage(parsedPage);
      }
    }
  }, [processedProfiles.length]);

  // Reset to page 1 only when filters change (profile length changes)
  useEffect(() => {
    // Only reset to page 1 when filters change, not when returning from a profile
    const comingFromProfile = location.state?.fromProfile;
    if (!comingFromProfile) {
      setCurrentPage(1);
    }
  }, [filteredProfiles.length, location.state]);

  const currentProfiles = useMemo(() => {
    // For page 1, include featured profiles at the top
    if (currentPage === 1 && featuredProfiles.length > 0) {
      // Only use featured profiles that are also in the filtered list
      const featuredInFilter = featuredProfiles.filter(fp =>
        filteredProfiles.some(p => p.id === fp.id)
      );
      
      // Calculate how many regular profiles to show on page 1 after featured profiles
      const remainingSlots = ITEMS_PER_PAGE - featuredInFilter.length;
      const page1RegularProfiles = processedProfiles.slice(0, remainingSlots);
      
      // Combine featured profiles with regular ones for page 1
      return [...featuredInFilter, ...page1RegularProfiles];
    }
    
    // For pages beyond the first, calculate the correct slice of regular profiles
    const start = (currentPage - 1) * ITEMS_PER_PAGE - (currentPage > 1 ? featuredProfiles.length : 0);
    const adjustedStart = Math.max(0, start); // Ensure we don't go below 0
    
    return processedProfiles.slice(adjustedStart, adjustedStart + ITEMS_PER_PAGE);
  }, [currentPage, processedProfiles, featuredProfiles, filteredProfiles]);

  const scrollToGrid = () => {
    const grid = document.getElementById("student-grid");
    if (grid) {
      const yOffset = isMobile ? -80 : -120;
      const y = grid.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setTimeout(scrollToGrid, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setTimeout(scrollToGrid, 0);
    }
  };

  // Calculate the total number of profiles (including featured ones)
  const totalProfileCount = filteredProfiles.length;
  // Calculate the displayed count, factoring in featured profiles on page 1
  const displayedCount = Math.min(currentProfiles.length, ITEMS_PER_PAGE);

  return (
    <div id="student-grid">
      <div className="mb-4 md:mb-6 text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{displayedCount}</span> of <span className="font-medium text-gray-900">{totalProfileCount}</span> students
        {currentPage === 1 && featuredProfiles.length > 0 && (
          <span className="ml-1 text-xs text-blue-600">(including featured students)</span>
        )}
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No students found</h2>
          <p className="text-gray-600 mb-5 md:mb-6 px-4">Try adjusting your filters or search term</p>
          <Button className="button-hover py-2.5 md:py-2" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {currentProfiles.map((profile) => (
              <StudentCard 
                key={profile.id} 
                profile={profile} 
                isFeatured={currentPage === 1 && featuredProfiles.some(fp => fp.id === profile.id)}
              />
            ))}
          </div>

          <Pagination className="mb-8">
            <PaginationContent>
              <PaginationItem>
                <Button 
                  variant="outline"
                  size="sm"
                  className={cn("gap-1", currentPage === 1 ? "opacity-50 cursor-not-allowed" : "")}
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button 
                  variant="outline"
                  size="sm"
                  className={cn("gap-1", currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "")}
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default StudentCardGrid;
