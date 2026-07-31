import { supabase } from '$lib/supabase';

export async function getCreative() {
  const { data, error } = await supabase
    .from('creative')
    .select('*')
    .order('position');

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}