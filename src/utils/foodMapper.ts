
import { Food, FoodCategory, Season, HealthProperty } from "@/lib/types";

/**
 * Convertit les données d'un aliment venant de Supabase vers le type Food
 */
export function mapAlimentToFood(aliment: any): Food {
  return {
    id: aliment.id,
    nom: aliment.nom,
    categorie: aliment.categorie as FoodCategory,
    image_url: aliment.image_url,
    saisons: aliment.saisons as Season[],
    proprietes_sante: aliment.proprietes_sante as HealthProperty[],
    glucides: Number(aliment.glucides),
    proteines: Number(aliment.proteines),
    lipides: Number(aliment.lipides),
    lipides_satures: Number(aliment.lipides_satures),
    mono_insatures: Number(aliment.mono_insatures),
    poly_insatures: Number(aliment.poly_insatures),
    omega_3_epa: Number(aliment.omega_3_epa),
    omega_3_dha: Number(aliment.omega_3_dha),
    omega_3_ala: Number(aliment.omega_3_ala),
    omega_6: Number(aliment.omega_6),
    ratio_omega3_omega6: Number(aliment.ratio_omega3_omega6),
    fibres: Number(aliment.fibres),
    vitamine_c: Number(aliment.vitamine_c),
    vitamine_b6: Number(aliment.vitamine_b6),
    vitamine_b9: Number(aliment.vitamine_b9),
    vitamine_b12: Number(aliment.vitamine_b12),
    vitamine_d: Number(aliment.vitamine_d),
    fer: Number(aliment.fer),
    magnesium: Number(aliment.magnesium),
    zinc: Number(aliment.zinc),
    calcium: Number(aliment.calcium),
    selenium: Number(aliment.selenium),
    composes_bioactifs: aliment.composes_bioactifs,
    description: aliment.description
  };
}
