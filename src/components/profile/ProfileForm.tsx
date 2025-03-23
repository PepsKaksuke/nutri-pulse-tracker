
import React, { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserProfile, NutrientType } from '@/lib/types';
import { toast } from 'sonner';
import { createProfil, updateProfil } from '@/services/profilsService';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';

const formSchema = z.object({
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
});

type FormData = z.infer<typeof formSchema>;

type ProfileFormProps = {
  initialData?: UserProfile;
  isEditing?: boolean;
};

export const ProfileForm = ({ initialData, isEditing = false }: ProfileFormProps) => {
  const navigate = useNavigate();
  const { refreshProfiles, setActiveProfileId } = useProfile();
  
  const defaultValues: FormData = {
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
  };
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      prenom: initialData.prenom,
      sexe: initialData.sexe,
      poids: initialData.poids,
      glucides: initialData.objectifs.glucides,
      proteines: initialData.objectifs.proteines,
      lipides: initialData.objectifs.lipides,
      fibres: initialData.objectifs.fibres,
      vitamine_c: initialData.objectifs.vitamine_c,
      vitamine_d: initialData.objectifs.vitamine_d,
      fer: initialData.objectifs.fer,
      calcium: initialData.objectifs.calcium,
      magnesium: initialData.objectifs.magnesium,
      omega_3_total: initialData.objectifs.omega_3_total,
    } : defaultValues,
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      // Créer un objet avec les objectifs nutritionnels
      const objectifs: Record<NutrientType, number> = {
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
      };
      
      if (isEditing && initialData) {
        // Mise à jour d'un profil existant
        const updatedProfile = await updateProfil({
          id: initialData.id,
          prenom: data.prenom,
          sexe: data.sexe,
          poids: data.poids,
          objectifs,
        });
        
        toast.success("Profil mis à jour avec succès");
        
        // Rafraîchir la liste des profils pour mettre à jour l'UI
        await refreshProfiles();
        
        // Rediriger vers la page des profils
        navigate('/profil');
      } else {
        // Création d'un nouveau profil
        const newProfile = await createProfil({
          prenom: data.prenom,
          sexe: data.sexe,
          poids: data.poids,
          objectifs,
        });
        
        toast.success("Profil créé avec succès");
        
        // Rafraîchir la liste des profils et activer le nouveau profil
        await refreshProfiles();
        setActiveProfileId(newProfile.id);
        
        // Rediriger vers la page des profils
        navigate('/profil');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du profil:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du profil");
    }
  };
  
  useEffect(() => {
    if (initialData) {
      reset({
        prenom: initialData.prenom,
        sexe: initialData.sexe,
        poids: initialData.poids,
        glucides: initialData.objectifs.glucides,
        proteines: initialData.objectifs.proteines,
        lipides: initialData.objectifs.lipides,
        fibres: initialData.objectifs.fibres,
        vitamine_c: initialData.objectifs.vitamine_c,
        vitamine_d: initialData.objectifs.vitamine_d,
        fer: initialData.objectifs.fer,
        calcium: initialData.objectifs.calcium,
        magnesium: initialData.objectifs.magnesium,
        omega_3_total: initialData.objectifs.omega_3_total,
      });
    }
  }, [initialData, reset]);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} />
          {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom.message}</p>}
        </div>
        
        <div>
          <Label>Sexe</Label>
          <RadioGroup defaultValue="homme" className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Homme" id="Homme" {...register("sexe")} />
              <Label htmlFor="Homme">Homme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Femme" id="Femme" {...register("sexe")} />
              <Label htmlFor="Femme">Femme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Autre" id="Autre" {...register("sexe")} />
              <Label htmlFor="Autre">Autre</Label>
            </div>
          </RadioGroup>
          {errors.sexe && <p className="text-sm text-red-500 mt-1">{errors.sexe.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="poids">Poids (kg)</Label>
          <Input id="poids" type="number" step="0.1" {...register("poids")} />
          {errors.poids && <p className="text-sm text-red-500 mt-1">{errors.poids.message}</p>}
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Objectifs nutritionnels quotidiens</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="glucides">Glucides (g)</Label>
            <Input id="glucides" type="number" step="1" {...register("glucides")} />
            {errors.glucides && <p className="text-sm text-red-500 mt-1">{errors.glucides.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="proteines">Protéines (g)</Label>
            <Input id="proteines" type="number" step="1" {...register("proteines")} />
            {errors.proteines && <p className="text-sm text-red-500 mt-1">{errors.proteines.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="lipides">Lipides (g)</Label>
            <Input id="lipides" type="number" step="1" {...register("lipides")} />
            {errors.lipides && <p className="text-sm text-red-500 mt-1">{errors.lipides.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="fibres">Fibres (g)</Label>
            <Input id="fibres" type="number" step="1" {...register("fibres")} />
            {errors.fibres && <p className="text-sm text-red-500 mt-1">{errors.fibres.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="vitamine_c">Vitamine C (mg)</Label>
            <Input id="vitamine_c" type="number" step="1" {...register("vitamine_c")} />
            {errors.vitamine_c && <p className="text-sm text-red-500 mt-1">{errors.vitamine_c.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="vitamine_d">Vitamine D (µg)</Label>
            <Input id="vitamine_d" type="number" step="0.1" {...register("vitamine_d")} />
            {errors.vitamine_d && <p className="text-sm text-red-500 mt-1">{errors.vitamine_d.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="fer">Fer (mg)</Label>
            <Input id="fer" type="number" step="0.1" {...register("fer")} />
            {errors.fer && <p className="text-sm text-red-500 mt-1">{errors.fer.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="calcium">Calcium (mg)</Label>
            <Input id="calcium" type="number" step="1" {...register("calcium")} />
            {errors.calcium && <p className="text-sm text-red-500 mt-1">{errors.calcium.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="magnesium">Magnésium (mg)</Label>
            <Input id="magnesium" type="number" step="1" {...register("magnesium")} />
            {errors.magnesium && <p className="text-sm text-red-500 mt-1">{errors.magnesium.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="omega_3_total">Oméga-3 (g)</Label>
            <Input id="omega_3_total" type="number" step="0.1" {...register("omega_3_total")} />
            {errors.omega_3_total && <p className="text-sm text-red-500 mt-1">{errors.omega_3_total.message}</p>}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/profil')}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer mon profil'}
        </Button>
      </div>
    </form>
  );
};
