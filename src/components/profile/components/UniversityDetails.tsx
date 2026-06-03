import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { DateField } from "@/components/ui/DateField";
import { Calendar, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { formatSemester, parseSemester } from "@/lib/semesterParsing";

type UniversityDetailsProps = {
  form: {
    home_university: string;
    course: string | null;
    university: string;
    city: string | null;
    semester: string | null;
    arrival_date: string | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | null) => void;
  handleUniversityChange: (university: string) => void;
  handleHomeUniversityChange: (university: string) => void;
};

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const UniversityDetails = ({
  form,
  handleChange,
  handleSelectChange,
  handleUniversityChange,
  handleHomeUniversityChange,
}: UniversityDetailsProps) => {
  const navigate = useNavigate();
  const [lastUniversity, setLastUniversity] = useState("");

  // Seed departure date from the stored semester range string (DB doesn't persist it separately).
  const parsedSeed = useMemo(() => parseSemester(form.semester), [form.semester]);
  const [departureDate, setDepartureDate] = useState<string>(
    parsedSeed ? toISO(parsedSeed.end) : ""
  );

  // If the underlying semester string changes externally, resync departure.
  useEffect(() => {
    if (parsedSeed) setDepartureDate(toISO(parsedSeed.end));
  }, [parsedSeed]);

  const arrivalDate = form.arrival_date || (parsedSeed ? toISO(parsedSeed.start) : "");

  useEffect(() => {
    if (form.university !== lastUniversity && form.university) {
      setLastUniversity(form.university);
    }
  }, [form.university]);

  const enhancedUniversityChange = (university: string) => {
    const isChanging = university !== form.university && university.trim().length > 0;
    handleUniversityChange(university);
    if (isChanging) {
      toast.success(`You've been added to the ${university} chat group`, {
        description: "Navigate to Messages or Groups to join the conversation",
        action: {
          label: "View Chats",
          onClick: () => navigate("/groups"),
        },
      });
    }
  };

  const emitDates = (arrival: string, departure: string) => {
    handleSelectChange("arrival_date", arrival || null);
    if (arrival && departure && new Date(departure) > new Date(arrival)) {
      handleSelectChange("semester", formatSemester(arrival, departure));
    } else {
      handleSelectChange("semester", null);
    }
  };

  const handleArrivalChange = (val: string) => {
    // Clear departure if it becomes invalid
    if (departureDate && val && new Date(departureDate) <= new Date(val)) {
      setDepartureDate("");
      emitDates(val, "");
    } else {
      emitDates(val, departureDate);
    }
  };

  const previewText =
    arrivalDate && departureDate && new Date(departureDate) > new Date(arrivalDate)
      ? formatSemester(arrivalDate, departureDate)
      : "";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <UniversityAutocomplete
          value={form.home_university}
          onChange={handleHomeUniversityChange}
          label="Home University"
          required={false}
          prioritizeIrish={true}
        />
      </div>

      <div>
        <Label htmlFor="course" className="block text-sm font-medium text-gray-700">
          Course Name
        </Label>
        <Input
          id="course"
          name="course"
          value={form.course || ""}
          onChange={handleChange}
          placeholder="Enter your course name"
          className="mt-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="space-y-2">
        <UniversityAutocomplete
          value={form.university}
          onChange={enhancedUniversityChange}
          label="Destination University"
          required={false}
        />

        {form.university && (
          <div className="mt-2">
            <CityAutocomplete
              value={form.city || ""}
              onChange={(val) => handleSelectChange("city", val || null)}
              placeholder="Select destination city"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <DateField
          value={arrivalDate || null}
          onChange={(iso) => handleArrivalChange(iso || "")}
          label="When do you arrive?"
          icon={Plane}
          placeholder="Pick your arrival date"
        />

        <DateField
          value={departureDate || null}
          onChange={(iso) => {
            const val = iso || "";
            setDepartureDate(val);
            emitDates(arrivalDate, val);
          }}
          label="When do you leave?"
          icon={Calendar}
          placeholder="Pick your departure date"
          minDate={arrivalDate ? new Date(arrivalDate) : undefined}
          disabled={!arrivalDate}
        />
      </div>
    </div>
  );
};
