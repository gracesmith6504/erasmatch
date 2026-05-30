
import React from "react";
import { Profile } from "@/types";
import StudentCard from "./StudentCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CityProfileListProps {
  city: string;
  profiles: Profile[];
  onResetCity: () => void;
}

const CityProfileList = ({ city, profiles, onResetCity }: CityProfileListProps) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
          <Search className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">No students found in {city}</h2>
        <p className="text-gray-600 mb-6">Try selecting a different city</p>
        <Button onClick={onResetCity} className="button-hover">
          View All Cities
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Students in {city}</h2>
        <Button variant="outline" onClick={onResetCity} size="sm" className="button-hover">
          Back to All Cities
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {profiles.map((profile) => (
          <StudentCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default CityProfileList;
