
import React, { useState, useEffect } from 'react';
import { Food } from '@/lib/types';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import FoodCard from '@/components/ui-custom/FoodCard';

interface SearchFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: Food[];
  onSelectFood: (food: Food, quantity?: string) => void;
  selectedFoodIds: string[];
}

const SearchFoodDialog: React.FC<SearchFoodDialogProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectFood,
  selectedFoodIds
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync local state with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Update parent when local state changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearchQuery('');
    onSearchChange('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rechercher un aliment</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Tapez le nom d'un aliment..."
            className="pl-10 pr-10"
            value={localSearchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
          {localSearchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              {localSearchQuery ? (
                <>
                  <p className="text-lg font-medium">Aucun résultat trouvé</p>
                  <p className="text-gray-500">Essayez avec d'autres termes</p>
                </>
              ) : (
                <p className="text-gray-500">Commencez à taper pour rechercher des aliments</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  variant="compact"
                  isSelected={selectedFoodIds.includes(food.id)}
                  onSelect={onSelectFood}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchFoodDialog;
