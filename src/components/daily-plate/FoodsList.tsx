
import React from 'react';
import { Plus } from 'lucide-react';
import { Food } from '@/lib/types';
import FoodCard from '@/components/ui-custom/FoodCard';

interface FoodsListProps {
  foods: Food[];
  onRemoveFood: (food: Food) => void;
  onOpenSearch: () => void;
}

const FoodsList: React.FC<FoodsListProps> = ({ 
  foods, 
  onRemoveFood,
  onOpenSearch
}) => {
  if (foods.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-lg font-medium mb-2">Votre assiette est vide</h3>
        <p className="text-gray-500 mb-4">
          Commencez à ajouter des aliments pour suivre vos apports nutritionnels.
        </p>
        <button 
          onClick={onOpenSearch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-nutri-green-500 text-white rounded-lg hover:bg-nutri-green-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un aliment
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {foods.map(food => (
        <FoodCard
          key={food.id}
          food={food}
          variant="list"
          onSelect={onRemoveFood}
          isSelected={true}
        />
      ))}
    </div>
  );
};

export default FoodsList;
