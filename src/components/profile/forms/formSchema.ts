
import { z } from 'zod';
import { NutrientType } from '@/lib/types';

// Form validation schema
export const profileFormSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  sexe: z.enum(["Homme", "Femme", "Autre"], {
    errorMap: () => ({ message: "Veuillez sélectionner un sexe" }),
  }),
  poids: z.coerce.number().positive("Le poids doit être positif"),
  glucides: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  proteines: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  lipides: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  fibres: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  vitamine_c: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  vitamine_d: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  fer: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  calcium: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  magnesium: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  omega_3_total: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
  zinc: z.coerce.number().nonnegative("La valeur doit être positive ou nulle"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Default form values
export const defaultFormValues: ProfileFormData = {
  prenom: "",
  sexe: "Homme",
  poids: 70,
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
  zinc: 11,
};

// Helper function to extract profile data from form data
export const createObjectifsFromFormData = (data: ProfileFormData): Record<NutrientType, number> => {
  return {
    glucides: data.glucides,
    proteines: data.proteines,
    lipides: data.lipides,
    fibres: data.fibres,
    vitamine_c: data.vitamine_c,
    vitamine_d: data.vitamine_d,
    fer: data.fer,
    calcium: data.calcium,
    magnesium: data.magnesium,
    omega_3_total: data.omega_3_total,
    zinc: data.zinc,
  };
};
