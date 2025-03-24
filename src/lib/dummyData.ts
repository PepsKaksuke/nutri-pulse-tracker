import { Food, UserProfile, SelectedFood, NutrientRecommendation } from "./types";

// Données de test en attendant l'intégration de Supabase
export const dummyFoods: Food[] = [
  {
    id: "1",
    nom: "Bleuet",
    categorie: "Fruit",
    image_url: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Été"],
    proprietes_sante: ["Antioxydant", "Santé cérébrale", "Anti-inflammatoire"],
    glucides: 14.5,
    proteines: 0.7,
    lipides: 0.3,
    lipides_satures: 0.0,
    mono_insatures: 0.1,
    poly_insatures: 0.2,
    omega_3_epa: 0,
    omega_3_dha: 0,
    omega_3_ala: 0.09,
    omega_6: 0.04,
    ratio_omega3_omega6: 2.25,
    fibres: 2.4,
    vitamine_c: 9.7,
    vitamine_b6: 0.05,
    vitamine_b9: 6,
    vitamine_b12: 0,
    vitamine_d: 0,
    fer: 0.28,
    magnesium: 6,
    zinc: 0.16,
    calcium: 6,
    selenium: 0.1,
    composes_bioactifs: ["Anthocyanes", "Quercétine", "Acide ellagique"],
    description: "Les bleuets sont riches en antioxydants et ont des effets bénéfiques sur la cognition et la mémoire. Leurs composés anti-inflammatoires peuvent aider à réduire l'inflammation chronique liée à diverses maladies."
  },
  {
    id: "2",
    nom: "Avocat",
    categorie: "Fruit",
    image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Printemps", "Été", "Automne"],
    proprietes_sante: ["Santé cardiaque", "Anti-inflammatoire", "Santé cérébrale"],
    glucides: 8.5,
    proteines: 2,
    lipides: 15,
    lipides_satures: 2.1,
    mono_insatures: 10,
    poly_insatures: 1.8,
    omega_3_epa: 0,
    omega_3_dha: 0,
    omega_3_ala: 0.11,
    omega_6: 1.7,
    ratio_omega3_omega6: 0.06,
    fibres: 6.7,
    vitamine_c: 10,
    vitamine_b6: 0.26,
    vitamine_b9: 81,
    vitamine_b12: 0,
    vitamine_d: 0,
    fer: 0.55,
    magnesium: 29,
    zinc: 0.64,
    calcium: 12,
    selenium: 0.4,
    composes_bioactifs: ["Lutéine", "Zéaxanthine", "Phytostérols"],
    description: "L'avocat est un fruit riche en graisses monoinsaturées bénéfiques pour la santé cardiovasculaire. Il contient également une quantité importante de fibres et de nutriments essentiels comme le potassium, qui aide à réguler la pression artérielle."
  },
  {
    id: "3",
    nom: "Fraise",
    categorie: "Fruit",
    image_url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Printemps", "Été"],
    proprietes_sante: ["Antioxydant", "Anti-inflammatoire"],
    glucides: 7.7,
    proteines: 0.7,
    lipides: 0.3,
    lipides_satures: 0.0,
    mono_insatures: 0.1,
    poly_insatures: 0.2,
    omega_3_epa: 0,
    omega_3_dha: 0,
    omega_3_ala: 0.07,
    omega_6: 0.09,
    ratio_omega3_omega6: 0.8,
    fibres: 2,
    vitamine_c: 58.8,
    vitamine_b6: 0.047,
    vitamine_b9: 24,
    vitamine_b12: 0,
    vitamine_d: 0,
    fer: 0.41,
    magnesium: 13,
    zinc: 0.14,
    calcium: 16,
    selenium: 0.4,
    composes_bioactifs: ["Anthocyanes", "Acide ellagique", "Quercétine"],
    description: "Les fraises sont riches en vitamine C et en antioxydants, elles aident à combattre les radicaux libres. Leurs composés bioactifs peuvent avoir des effets anti-inflammatoires et bénéfiques pour la santé cardiovasculaire."
  },
  {
    id: "4",
    nom: "Épinard",
    categorie: "Légume",
    image_url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Printemps", "Automne"],
    proprietes_sante: ["Antioxydant", "Anti-inflammatoire", "Santé osseuse"],
    glucides: 3.6,
    proteines: 2.9,
    lipides: 0.4,
    lipides_satures: 0.1,
    mono_insatures: 0,
    poly_insatures: 0.2,
    omega_3_epa: 0,
    omega_3_dha: 0,
    omega_3_ala: 0.14,
    omega_6: 0.03,
    ratio_omega3_omega6: 4.7,
    fibres: 2.2,
    vitamine_c: 28.1,
    vitamine_b6: 0.195,
    vitamine_b9: 194,
    vitamine_b12: 0,
    vitamine_d: 0,
    fer: 2.7,
    magnesium: 79,
    zinc: 0.53,
    calcium: 99,
    selenium: 0.1,
    composes_bioactifs: ["Lutéine", "Zéaxanthine", "Flavonoïdes"],
    description: "L'épinard est un légume vert à feuilles riche en fer, en calcium et en vitamine K, importants pour la santé osseuse. Il contient également des antioxydants comme la lutéine et la zéaxanthine qui sont bénéfiques pour la santé oculaire."
  },
  {
    id: "5",
    nom: "Brocoli",
    categorie: "Légume",
    image_url: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Printemps", "Automne", "Hiver"],
    proprietes_sante: ["Antioxydant", "Anti-inflammatoire", "Santé intestinale"],
    glucides: 6.6,
    proteines: 2.8,
    lipides: 0.4,
    lipides_satures: 0.1,
    mono_insatures: 0,
    poly_insatures: 0.2,
    omega_3_epa: 0,
    omega_3_dha: 0,
    omega_3_ala: 0.1,
    omega_6: 0.05,
    ratio_omega3_omega6: 2,
    fibres: 2.6,
    vitamine_c: 89.2,
    vitamine_b6: 0.175,
    vitamine_b9: 63,
    vitamine_b12: 0,
    vitamine_d: 0,
    fer: 0.73,
    magnesium: 21,
    zinc: 0.41,
    calcium: 47,
    selenium: 1.6,
    composes_bioactifs: ["Sulforaphane", "Indole-3-carbinol", "Glucosinolates"],
    description: "Le brocoli est riche en composés soufrés comme le sulforaphane, qui ont des propriétés anti-cancérigènes. C'est également une excellente source de vitamine C, de fibres et de nombreux minéraux essentiels à la santé."
  },
  {
    id: "6",
    nom: "Saumon",
    categorie: "Poisson",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    saisons: ["Toute l'année"],
    proprietes_sante: ["Santé cardiaque", "Santé cérébrale", "Anti-inflammatoire"],
    glucides: 0,
    proteines: 20.4,
    lipides: 13.4,
    lipides_satures: 3.1,
    mono_insatures: 3.8,
    poly_insatures: 5.4,
    omega_3_epa: 0.69,
    omega_3_dha: 0.82,
    omega_3_ala: 0.1,
    omega_6: 0.4,
    ratio_omega3_omega6: 4.0,
    fibres: 0,
    vitamine_c: 0,
    vitamine_b6: 0.8,
    vitamine_b9: 25,
    vitamine_b12: 2.8,
    vitamine_d: 11.2,
    fer: 0.8,
    magnesium: 29,
    zinc: 0.64,
    calcium: 9,
    selenium: 40,
    composes_bioactifs: ["Astaxanthine", "Peptides bioactifs", "Coenzyme Q10"],
    description: "Le saumon est une source exceptionnelle d'acides gras oméga-3 qui soutiennent la santé cardiaque et cérébrale. Il est également riche en protéines de haute qualité et en vitamine D, essentielle pour la santé osseuse et immunitaire."
  }
];

export const dummyProfile: UserProfile = {
  id: "1",
  prenom: "Thomas",
  sexe: "Homme",
  poids: 75,
  objectifs: {
    glucides: 250,
    proteines: 75,
    lipides: 60,
    fibres: 30,
    vitamine_c: 90,
    vitamine_d: 20,
    fer: 8,
    calcium: 1000,
    magnesium: 400,
    omega_3_total: 1.6,
    zinc: 11
  }
};

export const dummySelectedFoods: SelectedFood[] = [
  {
    id: "1",
    profil_id: "1",
    aliment_id: "2", // Avocat
    date_selection: new Date().toISOString().split('T')[0] // Aujourd'hui
  },
  {
    id: "2",
    profil_id: "1",
    aliment_id: "6", // Saumon
    date_selection: new Date().toISOString().split('T')[0] // Aujourd'hui
  }
];

export const nutrientRecommendations: NutrientRecommendation[] = [
  { nutrient: "glucides", label: "Glucides", unit: "g", daily: 275, color: "bg-blue-500" },
  { nutrient: "proteines", label: "Protéines", unit: "g", daily: 55, color: "bg-red-500" },
  { nutrient: "lipides", label: "Lipides", unit: "g", daily: 78, color: "bg-yellow-500" },
  { nutrient: "fibres", label: "Fibres", unit: "g", daily: 25, color: "bg-nutri-green-400" },
  { nutrient: "vitamine_c", label: "Vitamine C", unit: "mg", daily: 90, color: "bg-orange-400" },
  { nutrient: "vitamine_d", label: "Vitamine D", unit: "µg", daily: 15, color: "bg-yellow-300" },
  { nutrient: "fer", label: "Fer", unit: "mg", daily: 8, color: "bg-red-600" },
  { nutrient: "calcium", label: "Calcium", unit: "mg", daily: 1000, color: "bg-gray-400" },
  { nutrient: "magnesium", label: "Magnésium", unit: "mg", daily: 400, color: "bg-purple-500" },
  { nutrient: "omega_3_total", label: "Oméga-3", unit: "g", daily: 1.6, color: "bg-blue-400" },
  { nutrient: "zinc", label: "Zinc", unit: "mg", daily: 11, color: "bg-purple-500" }
];

// Fonction utilitaire pour calculer la somme des apports quotidiens
export const calculateDailyIntake = (foodIds: string[], nutrient: keyof Food) => {
  return foodIds.reduce((total, foodId) => {
    const food = dummyFoods.find(food => food.id === foodId);
    return total + (food ? food[nutrient] as number : 0);
  }, 0);
};

// Calculer les oméga-3 totaux (EPA + DHA + ALA)
export const calculateTotalOmega3 = (foodIds: string[]) => {
  return foodIds.reduce((total, foodId) => {
    const food = dummyFoods.find(food => food.id === foodId);
    if (!food) return total;
    return total + food.omega_3_epa + food.omega_3_dha + food.omega_3_ala;
  }, 0);
};

// Fonction pour obtenir les aliments sélectionnés pour une date
export const getSelectedFoodsForDate = (date: string, profileId: string): Food[] => {
  const selectedIds = dummySelectedFoods
    .filter(sf => sf.date_selection === date && sf.profil_id === profileId)
    .map(sf => sf.aliment_id);
  
  return dummyFoods.filter(food => selectedIds.includes(food.id));
};

// Fonction pour obtenir les aliments commençant par une lettre
export const getFoodsByLetter = (letter: string): Food[] => {
  return dummyFoods.filter(food => food.nom.toLowerCase().startsWith(letter.toLowerCase()));
};

// Fonction pour rechercher des aliments
export const searchFoods = (query: string): Food[] => {
  if (!query.trim()) return dummyFoods;
  
  const searchTerm = query.toLowerCase().trim();
  return dummyFoods.filter(food => 
    food.nom.toLowerCase().includes(searchTerm) || 
    food.categorie.toLowerCase().includes(searchTerm) ||
    food.proprietes_sante.some(prop => prop.toLowerCase().includes(searchTerm))
  );
};

// Fonction pour filtrer les aliments par catégorie
export const filterFoodsByCategory = (category: string): Food[] => {
  if (category === "Tous") return dummyFoods;
  return dummyFoods.filter(food => food.categorie === category);
};

// Fonction pour filtrer les aliments par propriété santé
export const filterFoodsByHealthProperty = (property: string): Food[] => {
  return dummyFoods.filter(food => food.proprietes_sante.includes(property as any));
};

// Fonction pour filtrer les aliments par saison
export const filterFoodsBySeason = (season: string): Food[] => {
  return dummyFoods.filter(food => food.saisons.includes(season as any));
};
