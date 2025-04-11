
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCitiesData } from "@/hooks/useCitiesData";
import { supabase } from "@/integrations/supabase/client";

type CityDropdownProps = {
  value: string | null;
  onChange: (value: string) => void;
  universityName: string | null;
};

export function CityDropdown({ value, onChange, universityName }: CityDropdownProps) {
  const { cities, loading } = useCitiesData();
  const [universityCity, setUniversityCity] = useState<string | null>(null);

  // Fetch city for the selected university
  useEffect(() => {
    if (!universityName) {
      setUniversityCity(null);
      return;
    }

    const fetchUniversityCity = async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('city')
        .eq('name', universityName)
        .maybeSingle();
      
      if (!error && data?.city) {
        setUniversityCity(data.city);
        // Auto-select the university city if no city is manually selected yet
        if (!value) {
          onChange(data.city);
        }
      }
    };

    fetchUniversityCity();
  }, [universityName, onChange, value]);

  return (
    <div>
      <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
        City
      </Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Your exchange city" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>Loading cities...</SelectItem>
          ) : (
            cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city} {city === universityCity ? "(University City)" : ""}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {universityCity && universityCity !== value && (
        <p className="mt-1 text-xs text-gray-500">
          University city: {universityCity}
        </p>
      )}
    </div>
  );
}
