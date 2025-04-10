
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { Profile } from "@/types";

interface CityCardProps {
  city: string;
  studentCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const CityCard = ({ city, studentCount, isSelected, onClick }: CityCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md card-hover
      ${isSelected ? "border-2 border-erasmatch-blue bg-blue-50" : "border border-gray-100"}`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-erasmatch-blue mr-2" />
            <h3 className="font-semibold text-lg">{city}</h3>
          </div>
          <div className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {studentCount}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {studentCount === 1 ? "1 student" : `${studentCount} students`} in {city}
        </p>
      </div>
    </Card>
  );
};

export default CityCard;
