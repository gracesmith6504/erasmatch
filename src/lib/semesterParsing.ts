/**
 * Parses the various semester string formats stored in profiles.semester:
 * - New format: "Sep 2026 - Jan 2027" (MMM YYYY - MMM YYYY)
 * - Legacy: "Fall 2026", "Spring 2027"
 * - Legacy academic year: "Full Academic Year 2026–27" / "Full Academic Year 2026-27"
 */

const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export interface SemesterWindow {
  start: Date;
  end: Date;
}

const normalize = (s: string) => s.replace(/[–—]/g, "-").trim();

export const parseSemester = (raw: string | null | undefined): SemesterWindow | null => {
  if (!raw) return null;
  const s = normalize(raw);

  // New format: "Sep 2026 - Jan 2027"
  const range = s.match(/^([A-Za-z]+)\s+(\d{4})\s*-\s*([A-Za-z]+)\s+(\d{4})$/);
  if (range) {
    const sm = MONTHS[range[1].toLowerCase()];
    const em = MONTHS[range[3].toLowerCase()];
    if (sm != null && em != null) {
      return {
        start: new Date(Number(range[2]), sm, 1),
        end: new Date(Number(range[4]), em + 1, 0), // last day of end month
      };
    }
  }

  // Legacy "Fall YYYY" → Sep–Jan(+1)
  const fall = s.match(/^Fall\s+(\d{4})$/i);
  if (fall) {
    const y = Number(fall[1]);
    return { start: new Date(y, 8, 1), end: new Date(y + 1, 1, 0) };
  }

  // Legacy "Spring YYYY" → Feb–Jun
  const spring = s.match(/^Spring\s+(\d{4})$/i);
  if (spring) {
    const y = Number(spring[1]);
    return { start: new Date(y, 1, 1), end: new Date(y, 6, 0) };
  }

  // Legacy "Full Academic Year YYYY-YY"
  const fay = s.match(/Full Academic Year\s+(\d{4})-(\d{2,4})/i);
  if (fay) {
    const y = Number(fay[1]);
    return { start: new Date(y, 8, 1), end: new Date(y + 1, 6, 0) };
  }

  return null;
};

export type Season = "Autumn" | "Spring";

/** Arrival month → season. Aug–Dec = Autumn, Jan–July = Spring. */
export const getArrivalSeason = (
  raw: string | null | undefined
): { season: Season; year: number } | null => {
  const w = parseSemester(raw);
  if (!w) return null;
  const m = w.start.getMonth();
  const y = w.start.getFullYear();
  if (m >= 7) return { season: "Autumn", year: y }; // Aug-Dec
  return { season: "Spring", year: y }; // Jan-July
};

export const seasonLabel = (s: { season: Season; year: number }) =>
  `${s.season} ${s.year}`;

export const rangesOverlap = (a: SemesterWindow, b: SemesterWindow): boolean =>
  a.start <= b.end && b.start <= a.end;

/** Build chronologically sorted season chip options from a list of semester strings. */
export const buildSeasonOptions = (semesters: (string | null | undefined)[]): string[] => {
  const seen = new Map<string, { season: Season; year: number }>();
  for (const s of semesters) {
    const info = getArrivalSeason(s);
    if (!info) continue;
    const key = seasonLabel(info);
    if (!seen.has(key)) seen.set(key, info);
  }
  return [...seen.values()]
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.season === "Spring" ? -1 : 1;
    })
    .map(seasonLabel);
};

const SHORT_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatWindow = (w: SemesterWindow): string =>
  `${SHORT_MONTH[w.start.getMonth()]} ${w.start.getFullYear()} – ${SHORT_MONTH[w.end.getMonth()]} ${w.end.getFullYear()}`;

/** Formats two ISO date strings (YYYY-MM-DD) into the canonical semester range string. */
export const formatSemester = (arrival: string, departure: string): string => {
  const a = new Date(arrival);
  const d = new Date(departure);
  if (isNaN(a.getTime()) || isNaN(d.getTime())) return "";
  return `${SHORT_MONTH[a.getMonth()]} ${a.getFullYear()} - ${SHORT_MONTH[d.getMonth()]} ${d.getFullYear()}`;
};
