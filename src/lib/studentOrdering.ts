// Centralised student ordering maths. Edit weights and tiers here so every
// student listing (filtered /students, By City, recommendations) stays in sync.
import { Profile } from "@/types";

// ---- Editable knobs ----
export const PROFILE_PHOTO_PRIORITY = true; // photos always first
export const RECENT_WINDOW_DAYS = 21;

export const RECOMMENDATION_WEIGHTS = {
  sameUniversity: 8,
  sameSemester: 6,
  sharedTag: 3,
};

// ---- Helpers ----
const RECENT_MS = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const ts = (v: string | null | undefined) => (v ? new Date(v).getTime() : 0);

export const hasPhoto = (p: Profile) => Boolean(p.avatar_url);

export const profileCompleteness = (p: Profile) => {
  const fields = [
    p.name, p.university, p.avatar_url, p.bio, p.semester,
    p.home_university, p.city, p.country, p.interests,
  ];
  return fields.filter(Boolean).length;
};

export const scoreRecommendation = (p: Profile, me: Profile) => {
  const myTags = me.personality_tags ?? [];
  const pTags = p.personality_tags ?? [];
  let score = 0;
  if (me.university && p.university === me.university) score += RECOMMENDATION_WEIGHTS.sameUniversity;
  if (me.semester && p.semester === me.semester) score += RECOMMENDATION_WEIGHTS.sameSemester;
  score += myTags.filter((t) => pTags.includes(t)).length * RECOMMENDATION_WEIGHTS.sharedTag;
  return score;
};

// Photo > recent join > recent active > completeness. Used for filtered /students
// results, By City selected city, and as the tail of the recommendation sort.
export const compareFiltered = (a: Profile, b: Profile, now = Date.now()): number => {
  if (PROFILE_PHOTO_PRIORITY) {
    const ap = hasPhoto(a), bp = hasPhoto(b);
    if (ap !== bp) return ap ? -1 : 1;
  }

  const cA = ts(a.created_at), cB = ts(b.created_at);
  const recentJoinA = now - cA <= RECENT_MS;
  const recentJoinB = now - cB <= RECENT_MS;
  if (recentJoinA !== recentJoinB) return recentJoinA ? -1 : 1;
  if (recentJoinA && recentJoinB && cA !== cB) return cB - cA;

  const aA = ts(a.last_active_at), aB = ts(b.last_active_at);
  const recentActiveA = aA > 0 && now - aA <= RECENT_MS;
  const recentActiveB = aB > 0 && now - aB <= RECENT_MS;
  if (recentActiveA !== recentActiveB) return recentActiveA ? -1 : 1;
  if (recentActiveA && recentActiveB && aA !== aB) return aB - aA;

  return profileCompleteness(b) - profileCompleteness(a);
};

// Photo > score > filtered tail. Used by PeopleToMeet recommendations.
export const compareRecommendation = (
  a: Profile, b: Profile, me: Profile, now = Date.now()
): number => {
  if (PROFILE_PHOTO_PRIORITY) {
    const ap = hasPhoto(a), bp = hasPhoto(b);
    if (ap !== bp) return ap ? -1 : 1;
  }
  const sA = scoreRecommendation(a, me);
  const sB = scoreRecommendation(b, me);
  if (sA !== sB) return sB - sA;
  return compareFiltered(a, b, now);
};

// Default (no filter) /students: photo > completeness. Preserved as-is.
export const compareDefault = (a: Profile, b: Profile): number => {
  const ap = hasPhoto(a), bp = hasPhoto(b);
  if (ap !== bp) return ap ? -1 : 1;
  return profileCompleteness(b) - profileCompleteness(a);
};
