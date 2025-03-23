
import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Food } from '@/lib/types';
import { toast } from 'sonner';

interface SearchFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Food[];
  onAddFood: (food: Food) => void;
}

const SearchFoodDialog: React.FC<SearchFoodDialogProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onAddFood
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl animate-scale-in">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un aliment par nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-nutri-green-500 focus:ring focus:ring-nutri-green-200 focus:ring-opacity-50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-gray-600 px-2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="absolute inset-y-0 right-0 flex items-center text-gray-400 hover:text-gray-600 px-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {searchQuery.trim() === '' ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Commencez à taper pour rechercher un aliment
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Aucun aliment trouvé pour "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(food => (
                <div 
                  key={food.id}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src={food.image_url} 
                    alt={food.nom} 
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{food.nom}</h3>
                    <p className="text-sm text-gray-500">{food.categorie}</p>
                  </div>
                  
                  <button 
                    onClick={() => onAddFood(food)}
                    className="shrink-0 p-2 bg-nutri-green-500 text-white rounded-full hover:bg-nutri-green-600 transition-colors"
                    aria-label="Ajouter à l'assiette"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFoodDialog;
