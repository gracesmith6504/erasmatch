
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ListingProps {
  id: string;
  price: string | null;
  room_type: string | null;
  image_url: string | null;
  city: string | null;
  source_url: string | null;
  created_at: string;
  platform: string | null;
  details: string | null;
  availability: string | null;
}

const ListingCard: React.FC<{ listing: ListingProps }> = ({ listing }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={`${listing.room_type || 'Room'}`}
            className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-gray-200 to-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {listing.platform && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {listing.platform}
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-5">
        <h3 className="text-lg font-bold mb-1 text-gray-800">
          {listing.price || 'Price not available'}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {listing.room_type || 'Room type not available'}
        </p>
        <p className="text-gray-500 text-sm">
          {listing.city && <span className="flex items-center">
            <span className="mr-1">📍</span> {listing.city}
          </span>}
          {!listing.city && (listing.details || listing.availability || 'No details available')}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full flex items-center justify-center bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple hover:shadow-md hover:from-erasmatch-purple hover:to-erasmatch-blue transition-all duration-300"
          onClick={() => listing.source_url && window.open(listing.source_url, '_blank')}
          disabled={!listing.source_url}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Listing
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
