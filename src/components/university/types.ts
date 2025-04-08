
export type University = {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
  description?: string | null; // Added description as an optional field
};
