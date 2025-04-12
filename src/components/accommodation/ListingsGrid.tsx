
import React from "react";
import ListingCard, { ListingProps } from "./ListingCard";
import EmptyListingsState from "./EmptyListingsState";

interface ListingsGridProps {
  listings: ListingProps[];
  hasFilters: boolean;
  resetFilters: () => void;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  hasFilters,
  resetFilters,
}) => {
  if (listings.length === 0) {
    return <EmptyListingsState hasFilters={hasFilters} resetFilters={resetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsGrid;
