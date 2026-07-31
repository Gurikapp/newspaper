import { supabase } from '$lib/supabase';

export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('position');

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}