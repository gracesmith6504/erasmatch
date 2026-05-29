// Resolves a free-text university string (as stored on profiles.university) to
// the canonical universities.name, falling back through the university_aliases
// table. This insulates group-chat membership, message filtering, and any other
// equality-based lookups from string drift — typos, trailing whitespace,
// abbreviations, and historical names left on profiles after a rename.

export type UniversityRow = { id: number; name: string; city: string | null; country: string | null };
export type AliasRow = { alias: string; university_id: number };

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export type UniversityResolver = {
  // Given any string (canonical name, alias, typo with trailing whitespace, etc.),
  // returns the canonical universities.name. Returns the trimmed input if no match.
  resolveToCanonical: (raw: string | null | undefined) => string;
  // Given a canonical name, returns [canonical, ...all aliases] for use in
  // .in() filters when reading historical rows that may have been written
  // under an old name.
  getAllNamesFor: (canonicalName: string) => string[];
};

export const buildResolver = (
  universities: UniversityRow[],
  aliases: AliasRow[],
): UniversityResolver => {
  // canonical name lookup (normalized -> canonical name as stored)
  const canonicalByNormalized = new Map<string, string>();
  // alias -> canonical name
  const canonicalByAlias = new Map<string, string>();
  // canonical name -> all known aliases (raw)
  const aliasesByCanonical = new Map<string, Set<string>>();

  const canonicalById = new Map<number, string>();
  for (const u of universities) {
    if (!u.name) continue;
    canonicalById.set(u.id, u.name);
    canonicalByNormalized.set(normalize(u.name), u.name);
  }

  for (const a of aliases) {
    const canonical = canonicalById.get(a.university_id);
    if (!canonical) continue;
    canonicalByAlias.set(normalize(a.alias), canonical);
    if (!aliasesByCanonical.has(canonical)) aliasesByCanonical.set(canonical, new Set());
    aliasesByCanonical.get(canonical)!.add(a.alias);
  }

  return {
    resolveToCanonical: (raw) => {
      const trimmed = (raw ?? "").trim();
      if (!trimmed) return trimmed;
      const n = normalize(trimmed);
      return canonicalByNormalized.get(n) ?? canonicalByAlias.get(n) ?? trimmed;
    },
    getAllNamesFor: (canonicalName) => {
      const set = aliasesByCanonical.get(canonicalName);
      return set ? [canonicalName, ...set] : [canonicalName];
    },
  };
};
