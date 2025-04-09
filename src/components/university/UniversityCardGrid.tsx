
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { University } from "./types";
import UniversityCard from "./UniversityCard";
import { Search, TrendingUp } from "lucide-react";

type UniversityCardGridProps = {
  universities: University[];
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
};

const UniversityCardGrid = ({
  universities,
  filteredCount,
  totalCount,
  onResetFilters
}: UniversityCardGridProps) => {
  return (
    <>
      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredCount}</span> of <span className="font-medium text-gray-900">{totalCount}</span> universities
        </div>
        <div className="text-sm flex items-center text-erasmatch-blue">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>Sorted by popularity</span>
        </div>
      </div>
      
      {universities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No universities found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <Button className="button-hover" onClick={onResetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      )}
    </>
  );
};

export default UniversityCardGrid;
