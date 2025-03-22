
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/lib/types";
import { mapAlimentToFood } from "@/utils/foodMapper";
import { fetchAliments } from "./fetchAlimentsService";

/**
 * Recherche des aliments par mot-clé
 */
export async function searchAliments(query: string): Promise<Food[]> {
  if (!query.trim()) {
    return fetchAliments();
  }
  
  const searchTerm = query.toLowerCase();
  
  const { data, error } = await supabase
    .from('aliments')
    .select('*')
    .or(`nom.ilike.%${searchTerm}%,categorie.ilike.%${searchTerm}%`);
  
  if (error) {
    console.error('Erreur lors de la recherche des aliments:', error);
    throw error;
  }
  
  // Mapper les données de Supabase au format Food
  return data.map(aliment => mapAlimentToFood(aliment));
}
