
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormData } from './formSchema';

interface NutritionalGoalsFieldsProps {
  form: UseFormReturn<ProfileFormData>;
}

export const NutritionalGoalsFields: React.FC<NutritionalGoalsFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default NutritionalGoalsFields;
