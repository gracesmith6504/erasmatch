import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateFieldProps = {
  value: string | null;
  onChange: (iso: string | null) => void;
  label: string;
  icon: LucideIcon;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  inputStyle?: "card" | "input";
};

const toDate = (iso: string | null): Date | undefined => {
  if (!iso) return undefined;
  const d = parse(iso, "yyyy-MM-dd", new Date());
  return isValid(d) ? d : undefined;
};

const toIso = (d: Date): string => format(d, "yyyy-MM-dd");

export const DateField = ({
  value,
  onChange,
  label,
  icon: Icon,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabled,
  inputStyle = "card",
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);

  const trigger =
    inputStyle === "input" ? (
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        className={cn(
          "relative w-full h-10 flex items-center rounded-md border border-input bg-background pl-9 pr-3 text-left text-sm transition-colors",
          "hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <Icon className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <span
          className={cn(
            "truncate",
            selected ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selected ? format(selected, "MMM d, yyyy") : placeholder}
        </span>
      </button>
    ) : (
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "group w-full flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 text-left transition-colors",
          "hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-xs font-medium text-muted-foreground leading-tight">
            {label}
          </span>
          <span
            className={cn(
              "block text-base font-semibold leading-snug mt-0.5 truncate",
              selected ? "text-foreground" : "text-muted-foreground font-normal"
            )}
          >
            {selected ? format(selected, "MMM d, yyyy") : placeholder}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
      </button>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(toIso(d));
              setOpen(false);
            }
          }}
          defaultMonth={selected ?? minDate ?? new Date()}
          disabled={(d) => {
            if (minDate && d < minDate) return true;
            if (maxDate && d > maxDate) return true;
            return false;
          }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};
