
import { NutrientType } from "./types";

export interface NutrientData {
  label: string;
  unit: string;
  daily: number;
  color: string;
}

// Table des données pour chaque nutriment
const nutrientDataMap: Record<NutrientType, NutrientData> = {
  glucides: {
    label: 'Glucides',
    unit: 'g',
    daily: 260,
    color: '#3B82F6' // blue-500
  },
  proteines: {
    label: 'Protéines',
    unit: 'g',
    daily: 70,
    color: '#EF4444' // red-500
  },
  lipides: {
    label: 'Lipides',
    unit: 'g',
    daily: 77,
    color: '#F59E0B' // amber-500
  },
  fibres: {
    label: 'Fibres',
    unit: 'g',
    daily: 30,
    color: '#10B981' // emerald-500
  },
  vitamine_c: {
    label: 'Vitamine C',
    unit: 'mg',
    daily: 90,
    color: '#6366F1' // indigo-500
  },
  vitamine_d: {
    label: 'Vitamine D',
    unit: 'µg',
    daily: 15,
    color: '#8B5CF6' // purple-500
  },
  fer: {
    label: 'Fer',
    unit: 'mg',
    daily: 18,
    color: '#EC4899' // pink-500
  },
  calcium: {
    label: 'Calcium',
    unit: 'mg',
    daily: 1000,
    color: '#14B8A6' // teal-500
  },
  magnesium: {
    label: 'Magnésium',
    unit: 'mg',
    daily: 400,
    color: '#F97316' // orange-500
  },
  omega_3_total: {
    label: 'Oméga-3',
    unit: 'g',
    daily: 2,
    color: '#0EA5E9' // sky-500
  },
  zinc: {
    label: 'Zinc',
    unit: 'mg',
    daily: 11,
    color: '#A855F7' // purple-500
  }
};

// Fonction pour récupérer les données d'un nutriment
export const getNutrientData = (nutrientType: NutrientType): NutrientData => {
  return nutrientDataMap[nutrientType] || {
    label: 'Inconnu',
    unit: '',
    daily: 0,
    color: '#9CA3AF' // gray-400
  };
};

// Groupes de nutriments
export const macroNutrients: NutrientType[] = [
  'glucides', 'proteines', 'lipides', 'fibres', 'omega_3_total'
];

export const microNutrients: NutrientType[] = [
  'vitamine_c', 'vitamine_d', 'fer', 'calcium', 'magnesium', 'zinc'
];
