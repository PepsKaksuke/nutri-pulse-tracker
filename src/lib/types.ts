// Types for the application

export interface Food {
  id: string;
  nom: string;
  categorie: FoodCategory;
  image_url: string;
  saisons: Season[];
  proprietes_sante: HealthProperty[];
  glucides: number;
  proteines: number;
  lipides: number;
  lipides_satures: number;
  mono_insatures: number;
  poly_insatures: number;
  omega_3_epa: number;
  omega_3_dha: number;
  omega_3_ala: number;
  omega_6: number;
  ratio_omega3_omega6: number;
  fibres: number;
  vitamine_c: number;
  vitamine_b6: number;
  vitamine_b9: number;
  vitamine_b12: number;
  vitamine_d: number;
  fer: number;
  magnesium: number;
  zinc: number;
  calcium: number;
  selenium: number;
  composes_bioactifs: string[];
  description?: string; // Description optionnelle pour la fiche détaillée
}

export type FoodCategory = 
  | "Fruit" 
  | "Légume" 
  | "Poisson" 
  | "Viande" 
  | "Noix" 
  | "Céréales" 
  | "Légumineuse" 
  | "Produit laitier" 
  | "Autre";

export type Season = "Printemps" | "Été" | "Automne" | "Hiver" | "Toute l'année";

export type HealthProperty = 
  | "Antioxydant" 
  | "Anti-inflammatoire" 
  | "Santé intestinale" 
  | "Santé cérébrale" 
  | "Santé cardiaque" 
  | "Système immunitaire" 
  | "Santé osseuse"
  | "Énergie" 
  | "Digestion";

export type NutrientType = 
  | "glucides" 
  | "proteines" 
  | "lipides" 
  | "fibres" 
  | "vitamine_c" 
  | "vitamine_d" 
  | "fer" 
  | "calcium" 
  | "magnesium" 
  | "omega_3_total"
  | "zinc"; // Add zinc to the NutrientType

export interface UserProfile {
  id: string;
  prenom: string;
  sexe: "Homme" | "Femme" | "Autre";
  poids: number;
  objectifs: Record<NutrientType, number>;
}

export interface SelectedFood {
  id: string;
  profil_id: string;
  aliment_id: string;
  date_selection: string;
  quantite?: string;
}

// Recommandations nutritionnelles moyennes (pour comparaison avec les objectifs personnalisés)
export interface NutrientRecommendation {
  nutrient: NutrientType;
  label: string; // Nom d'affichage
  unit: string; // g, mg, µg, etc.
  daily: number; // Quantité journalière recommandée
  color: string; // Couleur pour les graphiques
}
