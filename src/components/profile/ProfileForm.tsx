
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';
import { createProfil, updateProfil } from '@/services/profilsService';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from './forms/PersonalInfoFields';
import { NutritionalGoalsFields } from './forms/NutritionalGoalsFields';
import { FormActions } from './forms/FormActions';
import { 
  profileFormSchema, 
  ProfileFormData, 
  defaultFormValues, 
  createObjectifsFromFormData 
} from './forms/formSchema';

type ProfileFormProps = {
  initialData?: UserProfile;
  isEditing?: boolean;
  onSuccess?: () => void;
};

export const ProfileForm = ({ initialData, isEditing = false, onSuccess }: ProfileFormProps) => {
  const navigate = useNavigate();
  const { refreshProfiles, setActiveProfileId } = useProfile();
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
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
      zinc: initialData.objectifs.zinc,
    } : defaultFormValues,
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("Submitting form data:", data);
      
      // Créer un objet avec les objectifs nutritionnels
      const objectifs = createObjectifsFromFormData(data);
      
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
        zinc: initialData.objectifs.zinc,
      });
    }
  }, [initialData, form]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <NutritionalGoalsFields form={form} />
        <FormActions isSubmitting={form.formState.isSubmitting} isEditing={isEditing} />
      </form>
    </Form>
  );
};
