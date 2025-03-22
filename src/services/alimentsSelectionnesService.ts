
import { supabase } from "@/integrations/supabase/client";
import { SelectedFood, Food } from "@/lib/types";
import { fetchAlimentById } from "./alimentsService";

export async function fetchAlimentsSelectionnes(profilId: string): Promise<SelectedFood[]> {
  const { data, error } = await supabase
    .from('aliments_selectionnes')
    .select('*')
    .eq('profil_id', profilId);
  
  if (error) {
    console.error('Erreur lors de la récupération des aliments sélectionnés:', error);
    throw error;
  }
  
  // Convertir les données de Supabase au format SelectedFood
  return data.map(aliment => ({
    id: aliment.id,
    profil_id: aliment.profil_id,
    aliment_id: aliment.aliment_id,
    date_selection: aliment.date_selection
  }));
}

export async function fetchAlimentsSelectionnesByDate(profilId: string, date: string): Promise<SelectedFood[]> {
  const { data, error } = await supabase
    .from('aliments_selectionnes')
    .select('*')
    .eq('profil_id', profilId)
    .eq('date_selection', date);
  
  if (error) {
    console.error(`Erreur lors de la récupération des aliments sélectionnés pour la date ${date}:`, error);
    throw error;
  }
  
  // Convertir les données de Supabase au format SelectedFood
  return data.map(aliment => ({
    id: aliment.id,
    profil_id: aliment.profil_id,
    aliment_id: aliment.aliment_id,
    date_selection: aliment.date_selection
  }));
}

export async function addAlimentSelectionne(profilId: string, alimentId: string, date: string): Promise<SelectedFood> {
  // Vérifier si l'aliment est déjà sélectionné pour cette date
  const { data: existing } = await supabase
    .from('aliments_selectionnes')
    .select('*')
    .eq('profil_id', profilId)
    .eq('aliment_id', alimentId)
    .eq('date_selection', date);
  
  if (existing && existing.length > 0) {
    return existing[0];
  }
  
  // Ajouter l'aliment à la sélection
  const { data, error } = await supabase
    .from('aliments_selectionnes')
    .insert({
      profil_id: profilId,
      aliment_id: alimentId,
      date_selection: date
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de l\'ajout de l\'aliment à la sélection:', error);
    throw error;
  }
  
  // Convertir les données de Supabase au format SelectedFood
  return {
    id: data.id,
    profil_id: data.profil_id,
    aliment_id: data.aliment_id,
    date_selection: data.date_selection
  };
}

export async function removeAlimentSelectionne(profilId: string, alimentId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from('aliments_selectionnes')
    .delete()
    .eq('profil_id', profilId)
    .eq('aliment_id', alimentId)
    .eq('date_selection', date);
  
  if (error) {
    console.error('Erreur lors de la suppression de l\'aliment de la sélection:', error);
    throw error;
  }
}

export async function clearAlimentsSelectionnesForDate(profilId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from('aliments_selectionnes')
    .delete()
    .eq('profil_id', profilId)
    .eq('date_selection', date);
  
  if (error) {
    console.error(`Erreur lors de la suppression des aliments sélectionnés pour la date ${date}:`, error);
    throw error;
  }
}

export async function getSelectedFoodsForDate(profilId: string, date: string): Promise<Food[]> {
  const selectedFoods = await fetchAlimentsSelectionnesByDate(profilId, date);
  
  // Récupérer les détails de chaque aliment sélectionné
  const foods: Food[] = [];
  
  for (const selected of selectedFoods) {
    const food = await fetchAlimentById(selected.aliment_id);
    if (food) {
      foods.push(food);
    }
  }
  
  return foods;
}
