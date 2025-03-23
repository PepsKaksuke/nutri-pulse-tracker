
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormData } from './formSchema';

interface PersonalInfoFieldsProps {
  form: UseFormReturn<ProfileFormData>;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default PersonalInfoFields;
