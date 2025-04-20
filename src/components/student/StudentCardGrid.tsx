
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Profile } from "@/types";
import StudentCard from "./StudentCard";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationPrevious, 
  PaginationNext 
} from "@/components/ui/pagination";

interface StudentCardGridProps {
  filteredProfiles: Profile[];
  resetFilters: () => void;
}

const ITEMS_PER_PAGE = 20;

const StudentCardGrid = ({ filteredProfiles, resetFilters }: StudentCardGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProfiles.length]);

  // Calculate the current page's profiles
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProfiles = filteredProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      {/* Results count */}
      <div className="mb-4 md:mb-6 text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{filteredProfiles.length}</span> students
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
              <StudentCard key={profile.id} profile={profile} />
            ))}
          </div>

          <Pagination className="mb-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </>
  );
};

export default StudentCardGrid;

