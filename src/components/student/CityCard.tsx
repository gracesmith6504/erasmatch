import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface CityCardProps {
  city: string;
  studentCount: number;
  isSelected: boolean;
  onClick: () => void;
}

const CityCard = ({ city, studentCount, isSelected, onClick }: CityCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-card
      ${isSelected ? "border-2 border-erasmatch-green bg-erasmatch-green/5" : "border border-border"}`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-erasmatch-green mr-2" />
            <h3 className="font-display font-semibold text-lg text-foreground">{city}</h3>
          </div>
          <div className="bg-secondary rounded-full px-2 py-1 text-xs flex items-center text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {studentCount}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {studentCount === 1 ? "1 student" : `${studentCount} students`} in {city}
        </p>
      </div>
    </Card>
  );
};

export default CityCard;