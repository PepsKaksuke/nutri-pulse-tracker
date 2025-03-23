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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  onSuccess?: () => void;
};

export const ProfileForm = ({ initialData, isEditing = false, onSuccess }: ProfileFormProps) => {
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
  
  const form = useForm<FormData>({
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
      console.log("Submitting form data:", data);
      
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
        console.log("Updating profile:", initialData.id, "with data:", objectifs);
        
        const updatedProfile = await updateProfil({
          id: initialData.id,
          prenom: data.prenom,
          sexe: data.sexe,
          poids: data.poids,
          objectifs,
        });
        
        console.log("Profile updated successfully:", updatedProfile);
        toast.success("Profil mis à jour avec succès");
        
        // Rafraîchir la liste des profils pour mettre à jour l'UI
        await refreshProfiles();
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Otherwise navigate to profiles page
          navigate('/profil');
        }
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
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Otherwise navigate to profiles page
          navigate('/profil');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du profil:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du profil");
    }
  };
  
  useEffect(() => {
    if (initialData) {
      form.reset({
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
  }, [initialData, form.reset]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sexe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Homme" id="Homme" />
                      <Label htmlFor="Homme">Homme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Femme" id="Femme" />
                      <Label htmlFor="Femme">Femme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Autre" id="Autre" />
                      <Label htmlFor="Autre">Autre</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="poids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Objectifs nutritionnels quotidiens</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="glucides"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glucides (g)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="proteines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protéines (g)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lipides"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lipides (g)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fibres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fibres (g)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vitamine_c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitamine C (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vitamine_d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitamine D (µg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fer (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="calcium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calcium (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="magnesium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Magnésium (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="omega_3_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oméga-3 (g)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer mon profil'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
