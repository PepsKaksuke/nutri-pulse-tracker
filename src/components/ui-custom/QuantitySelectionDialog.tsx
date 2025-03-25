
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Food } from '@/lib/types';

interface QuantitySelectionDialogProps {
  food: Food;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (food: Food, quantity: string) => void;
}

export const QuantitySelectionDialog: React.FC<QuantitySelectionDialogProps> = ({
  food,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedQuantity, setSelectedQuantity] = React.useState('100g');

  const handleConfirm = () => {
    onConfirm(food, selectedQuantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choisissez la quantité de {food.nom}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedQuantity} onValueChange={setSelectedQuantity} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="100g" id="100g" />
              <Label htmlFor="100g" className="cursor-pointer">100 grammes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1 poignet" id="1_poignet" />
              <Label htmlFor="1_poignet" className="cursor-pointer">1 poignet</Label>
            </div>
          </RadioGroup>
        </div>
        
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
