
export type University = {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
  description?: string | null;
  student_count?: number;
  overview?: string | null;
  erasmus_tips?: string | null;
  accommodation_info?: string | null;
  popular_courses?: string | null;
  image_url?: string | null;
  links?: {
    housing?: string;
    transport?: string;
    student_groups?: string;
  } | null;
};
