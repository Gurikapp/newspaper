import { supabase } from '$lib/supabase';

export async function getEditorial() {
  const { data, error } = await supabase
    .from('editorial')
    .select('*')
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}