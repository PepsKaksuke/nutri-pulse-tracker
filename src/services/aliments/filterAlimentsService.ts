
import { supabase } from "@/integrations/supabase/client";
import { Food } from "@/lib/types";
import { mapAlimentToFood } from "@/utils/foodMapper";
import { fetchAliments } from "./fetchAlimentsService";

/**
 * Filtre les aliments par catégorie
 */
export async function filterAlimentsByCategory(category: string): Promise<Food[]> {
  if (category === "Tous") {
    return fetchAliments();
  }
  
  const { data, error } = await supabase
    .from('aliments')
    .select('*')
    .eq('categorie', category);
  
  if (error) {
    console.error('Erreur lors du filtrage des aliments par catégorie:', error);
    throw error;
  }
  
  // Mapper les données de Supabase au format Food
  return data.map(aliment => mapAlimentToFood(aliment));
}

/**
 * Filtre les aliments par saison
 */
export async function filterAlimentsBySeason(season: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('aliments')
    .select('*');
  
  if (error) {
    console.error('Erreur lors du filtrage des aliments par saison:', error);
    throw error;
  }
  
  // Filtrer les aliments par saison
  const filtered = data.filter(aliment => aliment.saisons.includes(season));
  
  // Mapper les données filtrées au format Food
  return filtered.map(aliment => mapAlimentToFood(aliment));
}

/**
 * Filtre les aliments par propriété santé
 */
export async function filterAlimentsByHealthProperty(property: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('aliments')
    .select('*');
  
  if (error) {
    console.error('Erreur lors du filtrage des aliments par propriété santé:', error);
    throw error;
  }
  
  // Filtrer les aliments par propriété santé
  const filtered = data.filter(aliment => aliment.proprietes_sante.includes(property));
  
  // Mapper les données filtrées au format Food
  return filtered.map(aliment => mapAlimentToFood(aliment));
}
