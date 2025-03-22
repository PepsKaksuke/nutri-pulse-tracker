
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserProfile } from '@/lib/types';
import { createProfil } from '@/services/profilsService';

const profileFormSchema = z.object({
  prenom: z.string().min(2, { message: 'Le prénom doit avoir au moins 2 caractères' }),
  sexe: z.enum(['Homme', 'Femme', 'Autre'], { message: 'Veuillez sélectionner un sexe' }),
  poids: z.coerce.number().min(30, { message: 'Le poids doit être d\'au moins 30kg' }).max(250, { message: 'Le poids doit être de moins de 250kg' }),
  objectifs: z.object({
    glucides: z.coerce.number().min(0),
    proteines: z.coerce.number().min(0),
    lipides: z.coerce.number().min(0),
    fibres: z.coerce.number().min(0),
    vitamine_c: z.coerce.number().min(0),
    vitamine_d: z.coerce.number().min(0),
    fer: z.coerce.number().min(0),
    calcium: z.coerce.number().min(0),
    magnesium: z.coerce.number().min(0),
    omega_3_total: z.coerce.number().min(0),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Valeurs par défaut basées sur des recommandations générales
const defaultValues: Partial<ProfileFormValues> = {
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
  },
};

interface ProfileFormProps {
  onSuccess?: (profile: UserProfile) => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const navigate = useNavigate();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const newProfile = await createProfil(data);
      toast.success("Profil créé avec succès!");
      if (onSuccess) {
        onSuccess(newProfile);
      } else {
        navigate('/profil');
      }
    } catch (error) {
      console.error("Erreur lors de la création du profil:", error);
      toast.error("Erreur lors de la création du profil");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            <p className="text-sm text-muted-foreground">
              Vos informations de base pour personnaliser vos recommandations nutritionnelles.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre sexe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input 
                      type="number" 
                      min="30"
                      max="250"
                      placeholder="70" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Objectifs nutritionnels (g/jour)</h3>
            <p className="text-sm text-muted-foreground">
              Définissez vos objectifs quotidiens pour chaque nutriment.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="objectifs.glucides"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Glucides (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.proteines"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protéines (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.lipides"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lipides (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.fibres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fibres (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.vitamine_c"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitamine C (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.vitamine_d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vitamine D (μg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.fer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fer (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.calcium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calcium (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.magnesium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Magnésium (mg)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="objectifs.omega_3_total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oméga-3 (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Créer profil
        </Button>
      </form>
    </Form>
  );
}
