
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Food } from '@/lib/types';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';

interface QuantitySelectionDialogProps {
  food: Food;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (food: Food, quantity: string) => void;
}

type QuantityFormValues = {
  customGrams: string;
};

export const QuantitySelectionDialog: React.FC<QuantitySelectionDialogProps> = ({
  food,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState('100g');
  const [customQuantityActive, setCustomQuantityActive] = useState(false);
  
  const form = useForm<QuantityFormValues>({
    defaultValues: {
      customGrams: ''
    }
  });

  const handleRadioChange = (value: string) => {
    setSelectedQuantity(value);
    setCustomQuantityActive(false);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim() !== '') {
      setCustomQuantityActive(true);
    } else {
      setCustomQuantityActive(false);
    }
  };

  const handleConfirm = () => {
    let finalQuantity = selectedQuantity;
    
    // Si une quantité personnalisée est active, l'utiliser
    if (customQuantityActive) {
      const customValue = form.getValues().customGrams;
      // Vérifier que la valeur n'est pas vide et est un nombre positif
      if (customValue && !isNaN(Number(customValue)) && Number(customValue) > 0) {
        finalQuantity = `${customValue}g`;
      } else {
        // En cas d'erreur, on reste sur l'option sélectionnée
        setCustomQuantityActive(false);
        return;
      }
    }
    
    onConfirm(food, finalQuantity);
    onClose();
    
    // Réinitialiser l'état pour la prochaine ouverture
    setSelectedQuantity('100g');
    setCustomQuantityActive(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisissez la quantité de {food.nom}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <div className="py-4 space-y-4">
            <RadioGroup 
              value={customQuantityActive ? "" : selectedQuantity} 
              onValueChange={handleRadioChange} 
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100g" id="100g" />
                <Label htmlFor="100g" className="cursor-pointer">100 grammes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1 poignet" id="1_poignet" />
                <Label htmlFor="1_poignet" className="cursor-pointer">
                  1 poignet
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 p-0">
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                        <span className="sr-only">Plus d'info</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-3 text-sm">
                      <p>Correspond à environ 30-40g pour la plupart des aliments</p>
                    </PopoverContent>
                  </Popover>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <FormField
                control={form.control}
                name="customGrams"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="customGrams">Saisir une quantité en grammes</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="customGrams"
                        type="number"
                        min="1"
                        placeholder="ex : 45"
                        className="mt-1"
                        onChange={(e) => {
                          field.onChange(e);
                          handleCustomInputChange(e);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
        
        <div className="flex justify-end space-x-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Ajouter à l'assiette</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantitySelectionDialog;
