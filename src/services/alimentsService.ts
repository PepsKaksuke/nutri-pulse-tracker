
import { supabase } from "@/integrations/supabase/client";
import { Food, FoodCategory, Season, HealthProperty } from "@/lib/types";

export async function fetchAliments(): Promise<Food[]> {
  const { data, error } = await supabase
    .from('aliments')
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des aliments:', error);
    throw error;
  }
  
  // Convertir les données de Supabase au format Food avec les bons types
  return data.map(aliment => ({
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: parseFloat(aliment.glucides),
    proteines: parseFloat(aliment.proteines),
    lipides: parseFloat(aliment.lipides),
    lipides_satures: parseFloat(aliment.lipides_satures),
    mono_insatures: parseFloat(aliment.mono_insatures),
    poly_insatures: parseFloat(aliment.poly_insatures),
    omega_3_epa: parseFloat(aliment.omega_3_epa),
    omega_3_dha: parseFloat(aliment.omega_3_dha),
    omega_3_ala: parseFloat(aliment.omega_3_ala),
    omega_6: parseFloat(aliment.omega_6),
    ratio_omega3_omega6: parseFloat(aliment.ratio_omega3_omega6),
    fibres: parseFloat(aliment.fibres),
    vitamine_c: parseFloat(aliment.vitamine_c),
    vitamine_b6: parseFloat(aliment.vitamine_b6),
    vitamine_b9: parseFloat(aliment.vitamine_b9),
    vitamine_b12: parseFloat(aliment.vitamine_b12),
    vitamine_d: parseFloat(aliment.vitamine_d),
    fer: parseFloat(aliment.fer),
    magnesium: parseFloat(aliment.magnesium),
    zinc: parseFloat(aliment.zinc),
    calcium: parseFloat(aliment.calcium),
    selenium: parseFloat(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  }));
}

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
  
  // Convertir les données de Supabase au format Food avec les bons types
  return {
    id: data.id,
    nom: data.nom,
    categorie: data.categorie as FoodCategory,
    image_url: data.image_url,
    saisons: data.saisons as Season[],
    proprietes_sante: data.proprietes_sante as HealthProperty[],
    glucides: parseFloat(data.glucides),
    proteines: parseFloat(data.proteines),
    lipides: parseFloat(data.lipides),
    lipides_satures: parseFloat(data.lipides_satures),
    mono_insatures: parseFloat(data.mono_insatures),
    poly_insatures: parseFloat(data.poly_insatures),
    omega_3_epa: parseFloat(data.omega_3_epa),
    omega_3_dha: parseFloat(data.omega_3_dha),
    omega_3_ala: parseFloat(data.omega_3_ala),
    omega_6: parseFloat(data.omega_6),
    ratio_omega3_omega6: parseFloat(data.ratio_omega3_omega6),
    fibres: parseFloat(data.fibres),
    vitamine_c: parseFloat(data.vitamine_c),
    vitamine_b6: parseFloat(data.vitamine_b6),
    vitamine_b9: parseFloat(data.vitamine_b9),
    vitamine_b12: parseFloat(data.vitamine_b12),
    vitamine_d: parseFloat(data.vitamine_d),
    fer: parseFloat(data.fer),
    magnesium: parseFloat(data.magnesium),
    zinc: parseFloat(data.zinc),
    calcium: parseFloat(data.calcium),
    selenium: parseFloat(data.selenium),
    composes_bioactifs: data.composes_bioactifs,
    description: data.description
  };
}

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
  
  // Convertir les données de Supabase au format Food avec les bons types
  return data.map(aliment => ({
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: parseFloat(aliment.glucides),
    proteines: parseFloat(aliment.proteines),
    lipides: parseFloat(aliment.lipides),
    lipides_satures: parseFloat(aliment.lipides_satures),
    mono_insatures: parseFloat(aliment.mono_insatures),
    poly_insatures: parseFloat(aliment.poly_insatures),
    omega_3_epa: parseFloat(aliment.omega_3_epa),
    omega_3_dha: parseFloat(aliment.omega_3_dha),
    omega_3_ala: parseFloat(aliment.omega_3_ala),
    omega_6: parseFloat(aliment.omega_6),
    ratio_omega3_omega6: parseFloat(aliment.ratio_omega3_omega6),
    fibres: parseFloat(aliment.fibres),
    vitamine_c: parseFloat(aliment.vitamine_c),
    vitamine_b6: parseFloat(aliment.vitamine_b6),
    vitamine_b9: parseFloat(aliment.vitamine_b9),
    vitamine_b12: parseFloat(aliment.vitamine_b12),
    vitamine_d: parseFloat(aliment.vitamine_d),
    fer: parseFloat(aliment.fer),
    magnesium: parseFloat(aliment.magnesium),
    zinc: parseFloat(aliment.zinc),
    calcium: parseFloat(aliment.calcium),
    selenium: parseFloat(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  }));
}

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
  
  // Convertir les données de Supabase au format Food avec les bons types
  return data.map(aliment => ({
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: parseFloat(aliment.glucides),
    proteines: parseFloat(aliment.proteines),
    lipides: parseFloat(aliment.lipides),
    lipides_satures: parseFloat(aliment.lipides_satures),
    mono_insatures: parseFloat(aliment.mono_insatures),
    poly_insatures: parseFloat(aliment.poly_insatures),
    omega_3_epa: parseFloat(aliment.omega_3_epa),
    omega_3_dha: parseFloat(aliment.omega_3_dha),
    omega_3_ala: parseFloat(aliment.omega_3_ala),
    omega_6: parseFloat(aliment.omega_6),
    ratio_omega3_omega6: parseFloat(aliment.ratio_omega3_omega6),
    fibres: parseFloat(aliment.fibres),
    vitamine_c: parseFloat(aliment.vitamine_c),
    vitamine_b6: parseFloat(aliment.vitamine_b6),
    vitamine_b9: parseFloat(aliment.vitamine_b9),
    vitamine_b12: parseFloat(aliment.vitamine_b12),
    vitamine_d: parseFloat(aliment.vitamine_d),
    fer: parseFloat(aliment.fer),
    magnesium: parseFloat(aliment.magnesium),
    zinc: parseFloat(aliment.zinc),
    calcium: parseFloat(aliment.calcium),
    selenium: parseFloat(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  }));
}

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
  
  // Convertir les données filtrées au format Food avec les bons types
  return filtered.map(aliment => ({
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: parseFloat(aliment.glucides),
    proteines: parseFloat(aliment.proteines),
    lipides: parseFloat(aliment.lipides),
    lipides_satures: parseFloat(aliment.lipides_satures),
    mono_insatures: parseFloat(aliment.mono_insatures),
    poly_insatures: parseFloat(aliment.poly_insatures),
    omega_3_epa: parseFloat(aliment.omega_3_epa),
    omega_3_dha: parseFloat(aliment.omega_3_dha),
    omega_3_ala: parseFloat(aliment.omega_3_ala),
    omega_6: parseFloat(aliment.omega_6),
    ratio_omega3_omega6: parseFloat(aliment.ratio_omega3_omega6),
    fibres: parseFloat(aliment.fibres),
    vitamine_c: parseFloat(aliment.vitamine_c),
    vitamine_b6: parseFloat(aliment.vitamine_b6),
    vitamine_b9: parseFloat(aliment.vitamine_b9),
    vitamine_b12: parseFloat(aliment.vitamine_b12),
    vitamine_d: parseFloat(aliment.vitamine_d),
    fer: parseFloat(aliment.fer),
    magnesium: parseFloat(aliment.magnesium),
    zinc: parseFloat(aliment.zinc),
    calcium: parseFloat(aliment.calcium),
    selenium: parseFloat(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  }));
}

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
  
  // Convertir les données filtrées au format Food avec les bons types
  return filtered.map(aliment => ({
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: parseFloat(aliment.glucides),
    proteines: parseFloat(aliment.proteines),
    lipides: parseFloat(aliment.lipides),
    lipides_satures: parseFloat(aliment.lipides_satures),
    mono_insatures: parseFloat(aliment.mono_insatures),
    poly_insatures: parseFloat(aliment.poly_insatures),
    omega_3_epa: parseFloat(aliment.omega_3_epa),
    omega_3_dha: parseFloat(aliment.omega_3_dha),
    omega_3_ala: parseFloat(aliment.omega_3_ala),
    omega_6: parseFloat(aliment.omega_6),
    ratio_omega3_omega6: parseFloat(aliment.ratio_omega3_omega6),
    fibres: parseFloat(aliment.fibres),
    vitamine_c: parseFloat(aliment.vitamine_c),
    vitamine_b6: parseFloat(aliment.vitamine_b6),
    vitamine_b9: parseFloat(aliment.vitamine_b9),
    vitamine_b12: parseFloat(aliment.vitamine_b12),
    vitamine_d: parseFloat(aliment.vitamine_d),
    fer: parseFloat(aliment.fer),
    magnesium: parseFloat(aliment.magnesium),
    zinc: parseFloat(aliment.zinc),
    calcium: parseFloat(aliment.calcium),
    selenium: parseFloat(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  }));
}
