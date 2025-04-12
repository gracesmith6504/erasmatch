
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyListingsStateProps {
  hasFilters: boolean;
  resetFilters: () => void;
}

const EmptyListingsState: React.FC<EmptyListingsStateProps> = ({
  hasFilters,
  resetFilters,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <p className="text-gray-600">No listings found. Try another city or room type.</p>
      {hasFilters && (
        <Button
          variant="link"
          onClick={resetFilters}
          className="mt-2 text-erasmatch-blue"
        >
          Reset filters
        </Button>
      )}
    </div>
  );
};

export default EmptyListingsState;
