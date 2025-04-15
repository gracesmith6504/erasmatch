
import { supabase } from "@/integrations/supabase/client";

export const generateRefCode = (name: string): string => {
  // Take first word, convert to lowercase, remove special characters
  const cleanFirstName = name
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  // Generate a random 3-digit number
  const randomNum = Math.floor(100 + Math.random() * 900);
  
  return `${cleanFirstName}${randomNum}`;
};

export const isRefCodeUnique = async (refCode: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('ref_code')
    .eq('ref_code', refCode)
    .single();

  if (error) {
    console.error('Error checking ref_code uniqueness:', error);
    return false;
  }

  return !data;
};

export const generateUniqueRefCode = async (name: string): Promise<string> => {
  let refCode = generateRefCode(name);
  let attempts = 0;

  while (!(await isRefCodeUnique(refCode)) && attempts < 10) {
    refCode = generateRefCode(name);
    attempts++;
  }

  if (attempts === 10) {
    // Fallback to a more random generation if unique code can't be found
    refCode = `${generateRefCode(name)}${Date.now()}`.slice(-10);
  }

  return refCode;
};
