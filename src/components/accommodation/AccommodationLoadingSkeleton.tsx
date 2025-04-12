
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AccommodationLoadingSkeleton = () => {
  // Generate an array for skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-10 w-72 mb-6" />
      
      {/* Filters skeleton */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      
      {/* Listing cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonCards.map((index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            
            <CardContent className="p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
            
            <CardFooter className="p-5 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccommodationLoadingSkeleton;
