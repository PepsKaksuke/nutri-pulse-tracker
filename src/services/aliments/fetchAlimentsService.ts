
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/lib/types";
import { mapAlimentToFood } from "@/utils/foodMapper";

/**
 * Récupère tous les aliments depuis Supabase
 */
export async function fetchAliments(): Promise<Food[]> {
  const { data, error } = await supabase
    .from('aliments')
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des aliments:', error);
    throw error;
  }
  
  // Mapper les données de Supabase au format Food
  return data.map(aliment => mapAlimentToFood(aliment));
}

/**
 * Récupère un aliment par son ID
 */
export async function fetchAlimentById(id: string): Promise<Food | null> {
  const { data, error } = await supabase
    .from('aliments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erreur lors de la récupération de l'aliment ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Mapper les données de Supabase au format Food
  return mapAlimentToFood(data);
}
