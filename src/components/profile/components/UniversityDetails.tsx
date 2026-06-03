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

const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export const UniversityDetails = ({
  form,
  handleChange,
  handleSelectChange,
  handleUniversityChange,
  handleHomeUniversityChange,
}: UniversityDetailsProps) => {
  const navigate = useNavigate();
  const [lastUniversity, setLastUniversity] = useState("");

  const parsedSeed = useMemo(() => parseSemester(form.semester), [form.semester]);
  const [departureDate, setDepartureDate] = useState<string>(
    parsedSeed ? toISO(parsedSeed.end) : ""
  );

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
    if (departureDate && val && new Date(departureDate) <= new Date(val)) {
      setDepartureDate("");
      emitDates(val, "");
    } else {
      emitDates(val, departureDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Block A — Home */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <Label htmlFor="course" className={labelClass}>
            Course Name
          </Label>
          <Input
            id="course"
            name="course"
            value={form.course || ""}
            onChange={handleChange}
            placeholder="Enter your course name"
          />
        </div>
      </div>

      {/* Block B — Target Destination */}
      <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Target Destination
        </h4>

        <div>
          <UniversityAutocomplete
            value={form.university}
            onChange={enhancedUniversityChange}
            label="Destination University"
            required={false}
          />
        </div>

        {form.university && (
          <div>
            <Label className={labelClass}>Destination City</Label>
            <CityAutocomplete
              value={form.city || ""}
              onChange={(val) => handleSelectChange("city", val || null)}
              placeholder="Select destination city"
            />
          </div>
        )}
      </div>

      {/* Block C — Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className={labelClass}>When do you arrive?</Label>
          <DateField
            value={arrivalDate || null}
            onChange={(iso) => handleArrivalChange(iso || "")}
            label="Arrival date"
            icon={Plane}
            placeholder="Select arrival date"
            inputStyle="input"
          />
        </div>

        <div>
          <Label className={labelClass}>When do you leave?</Label>
          <DateField
            value={departureDate || null}
            onChange={(iso) => {
              const val = iso || "";
              setDepartureDate(val);
              emitDates(arrivalDate, val);
            }}
            label="Departure date"
            icon={Calendar}
            placeholder="Select departure date"
            minDate={arrivalDate ? new Date(arrivalDate) : undefined}
            disabled={!arrivalDate}
            inputStyle="input"
          />
        </div>
      </div>
    </div>
  );
};
