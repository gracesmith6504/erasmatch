
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
    <Card className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-100">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={`${listing.room_type || 'Room'}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {listing.platform && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {listing.platform}
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-5">
        <h3 className="text-lg font-bold mb-1">
          {listing.price || 'Price not available'}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {listing.room_type || 'Room type not available'}
        </p>
        <p className="text-gray-500 text-sm">
          {listing.details || listing.availability || 'No details available'}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full flex items-center justify-center bg-erasmatch-blue hover:bg-erasmatch-blue/90"
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
