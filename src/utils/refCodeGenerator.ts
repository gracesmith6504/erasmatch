
import { supabase } from "@/integrations/supabase/client";

export const generateRefCode = (name: string): string => {
  if (!name || name.trim() === '') {
    // Fallback if no name is provided
    return `user${Math.floor(100 + Math.random() * 900)}`;
  }
  
  // Take first word, convert to lowercase, remove special characters
  const cleanFirstName = name
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  // If name is empty after cleaning, use fallback
  if (!cleanFirstName || cleanFirstName === '') {
    return `user${Math.floor(100 + Math.random() * 900)}`;
  }
  
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

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking ref_code uniqueness:', error);
    return false;
  }

  // If no data was found, the code is unique
  return !data;
};

export const generateUniqueRefCode = async (name: string): Promise<string> => {
  // Ensure name is not null or undefined before processing
  const safeName = name || '';
  let refCode = generateRefCode(safeName);
  let attempts = 0;
  const maxAttempts = 10;

  while (!(await isRefCodeUnique(refCode)) && attempts < maxAttempts) {
    refCode = generateRefCode(safeName);
    attempts++;
  }

  if (attempts === maxAttempts) {
    // Fallback to a more unique generation if we couldn't find a unique code
    const timestamp = Date.now().toString().slice(-6);
    const namePrefix = safeName ? safeName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') : 'user';
    refCode = `${namePrefix || 'user'}${timestamp}`;
  }

  return refCode;
};
