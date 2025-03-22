
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/lib/types";

export async function fetchProfils(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profils_utilisateurs')
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    throw error;
  }
  
  // Convertir les données de Supabase au format UserProfile avec les bons types
  return data.map(profil => ({
    id: profil.id,
    prenom: profil.prenom,
    sexe: profil.sexe as "Homme" | "Femme" | "Autre",
    poids: Number(profil.poids),
    objectifs: {
      glucides: Number(profil.glucides),
      proteines: Number(profil.proteines),
      lipides: Number(profil.lipides),
      fibres: Number(profil.fibres),
      vitamine_c: Number(profil.vitamine_c),
      vitamine_d: Number(profil.vitamine_d),
      fer: Number(profil.fer),
      calcium: Number(profil.calcium),
      magnesium: Number(profil.magnesium),
      omega_3_total: Number(profil.omega_3_total)
    }
  }));
}

export async function fetchProfilById(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profils_utilisateurs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erreur lors de la récupération du profil ${id}:`, error);
    return null;
  }
  
  if (!data) return null;
  
  // Convertir les données de Supabase au format UserProfile avec les bons types
  return {
    id: data.id,
    prenom: data.prenom,
    sexe: data.sexe as "Homme" | "Femme" | "Autre",
    poids: Number(data.poids),
    objectifs: {
      glucides: Number(data.glucides),
      proteines: Number(data.proteines),
      lipides: Number(data.lipides),
      fibres: Number(data.fibres),
      vitamine_c: Number(data.vitamine_c),
      vitamine_d: Number(data.vitamine_d),
      fer: Number(data.fer),
      calcium: Number(data.calcium),
      magnesium: Number(data.magnesium),
      omega_3_total: Number(data.omega_3_total)
    }
  };
}

export async function updateProfil(profil: UserProfile): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profils_utilisateurs')
    .update({
      prenom: profil.prenom,
      sexe: profil.sexe,
      poids: profil.poids,
      glucides: profil.objectifs.glucides,
      proteines: profil.objectifs.proteines,
      lipides: profil.objectifs.lipides,
      fibres: profil.objectifs.fibres,
      vitamine_c: profil.objectifs.vitamine_c,
      vitamine_d: profil.objectifs.vitamine_d,
      fer: profil.objectifs.fer,
      calcium: profil.objectifs.calcium,
      magnesium: profil.objectifs.magnesium,
      omega_3_total: profil.objectifs.omega_3_total
    })
    .eq('id', profil.id)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de la mise à jour du profil ${profil.id}:`, error);
    throw error;
  }
  
  // Convertir les données de Supabase au format UserProfile avec les bons types
  return {
    id: data.id,
    prenom: data.prenom,
    sexe: data.sexe as "Homme" | "Femme" | "Autre",
    poids: Number(data.poids),
    objectifs: {
      glucides: Number(data.glucides),
      proteines: Number(data.proteines),
      lipides: Number(data.lipides),
      fibres: Number(data.fibres),
      vitamine_c: Number(data.vitamine_c),
      vitamine_d: Number(data.vitamine_d),
      fer: Number(data.fer),
      calcium: Number(data.calcium),
      magnesium: Number(data.magnesium),
      omega_3_total: Number(data.omega_3_total)
    }
  };
}

export async function createProfil(profil: Omit<UserProfile, 'id'>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profils_utilisateurs')
    .insert({
      prenom: profil.prenom,
      sexe: profil.sexe,
      poids: profil.poids,
      glucides: profil.objectifs.glucides,
      proteines: profil.objectifs.proteines,
      lipides: profil.objectifs.lipides,
      fibres: profil.objectifs.fibres,
      vitamine_c: profil.objectifs.vitamine_c,
      vitamine_d: profil.objectifs.vitamine_d,
      fer: profil.objectifs.fer,
      calcium: profil.objectifs.calcium,
      magnesium: profil.objectifs.magnesium,
      omega_3_total: profil.objectifs.omega_3_total
    })
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de la création du profil:', error);
    throw error;
  }
  
  // Convertir les données de Supabase au format UserProfile avec les bons types
  return {
    id: data.id,
    prenom: data.prenom,
    sexe: data.sexe as "Homme" | "Femme" | "Autre",
    poids: Number(data.poids),
    objectifs: {
      glucides: Number(data.glucides),
      proteines: Number(data.proteines),
      lipides: Number(data.lipides),
      fibres: Number(data.fibres),
      vitamine_c: Number(data.vitamine_c),
      vitamine_d: Number(data.vitamine_d),
      fer: Number(data.fer),
      calcium: Number(data.calcium),
      magnesium: Number(data.magnesium),
      omega_3_total: Number(data.omega_3_total)
    }
  };
}
