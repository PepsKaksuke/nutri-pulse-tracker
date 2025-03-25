
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Food } from '@/lib/types';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface QuantitySelectionDialogProps {
  food: Food;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (food: Food, quantity: string) => void;
}

type UnitType = 'g' | 'poignet';

type QuantityFormValues = {
  quantity: string;
};

export const QuantitySelectionDialog: React.FC<QuantitySelectionDialogProps> = ({
  food,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [unit, setUnit] = useState<UnitType>('g');
  
  const form = useForm<QuantityFormValues>({
    defaultValues: {
      quantity: '100'
    }
  });

  const handleConfirm = () => {
    const quantityValue = form.getValues().quantity;
    
    // Validation: Check if quantity is a valid positive number
    if (!quantityValue || isNaN(Number(quantityValue)) || Number(quantityValue) <= 0) {
      return; // Don't proceed if invalid
    }
    
    // Format the final quantity string based on selected unit
    const finalQuantity = `${quantityValue}${unit === 'g' ? 'g' : ' poignet'}`;
    
    onConfirm(food, finalQuantity);
    onClose();
    
    // Reset form and unit for next use
    form.reset({ quantity: '100' });
    setUnit('g');
  };

  const handleUnitChange = (value: UnitType) => {
    setUnit(value);
    // Set a sensible default based on unit
    if (value === 'g') {
      form.setValue('quantity', '100');
    } else {
      form.setValue('quantity', '1');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisissez la quantité de {food.nom}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <div className="py-4 space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="quantity">Saisir la quantité</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <FormControl>
                      <Input
                        {...field}
                        id="quantity"
                        type="number"
                        min="1"
                        className="flex-1"
                      />
                    </FormControl>
                    
                    <div className="relative flex-initial w-28">
                      <Select value={unit} onValueChange={(value: UnitType) => handleUnitChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">g</SelectItem>
                          <SelectItem value="poignet">
                            <div className="flex items-center">
                              poignet
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
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </FormItem>
              )}
            />
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
