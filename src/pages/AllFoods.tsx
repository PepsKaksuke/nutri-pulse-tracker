
import React, { useState, useEffect } from 'react';
import { dummyFoods, dummySelectedFoods } from '@/lib/dummyData';
import { Food, SelectedFood } from '@/lib/types';
import FoodCard from '@/components/ui-custom/FoodCard';
import { toast } from '@/components/ui/sonner';

const AllFoods = () => {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>(dummySelectedFoods);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [foodsByLetter, setFoodsByLetter] = useState<Record<string, Food[]>>({});
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  
  // Organiser les aliments par lettre
  useEffect(() => {
    const groupedFoods: Record<string, Food[]> = {};
    const letters: Set<string> = new Set();
    
    dummyFoods.forEach(food => {
      const firstLetter = food.nom.charAt(0).toUpperCase();
      if (!groupedFoods[firstLetter]) {
        groupedFoods[firstLetter] = [];
      }
      groupedFoods[firstLetter].push(food);
      letters.add(firstLetter);
    });
    
    setFoodsByLetter(groupedFoods);
    setAvailableLetters(Array.from(letters).sort());
    
    // Sélectionner la première lettre disponible
    if (letters.size > 0 && !letters.has(selectedLetter)) {
      setSelectedLetter(Array.from(letters)[0]);
    }
  }, [selectedLetter]);
  
  // Générer l'alphabet complet
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Vérifier si un aliment est dans la sélection du jour
  const isSelected = (foodId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedFoods.some(sf => 
      sf.aliment_id === foodId && sf.date_selection === today
    );
  };
  
  // Gérer la sélection d'un aliment
  const handleSelectFood = (food: Food) => {
    const today = new Date().toISOString().split('T')[0];
    const alreadySelected = selectedFoods.find(sf => 
      sf.aliment_id === food.id && sf.date_selection === today
    );
    
    if (alreadySelected) {
      // Supprimer de la sélection
      const updatedSelection = selectedFoods.filter(sf => 
        !(sf.aliment_id === food.id && sf.date_selection === today)
      );
      setSelectedFoods(updatedSelection);
      toast.success(`${food.nom} retiré de votre assiette`);
    } else {
      // Ajouter à la sélection
      const newSelectedFood: SelectedFood = {
        id: `${Date.now()}`,
        profil_id: "1", // ID utilisateur fixe pour le MVP
        aliment_id: food.id,
        date_selection: today
      };
      setSelectedFoods([...selectedFoods, newSelectedFood]);
      toast.success(`${food.nom} ajouté à votre assiette`);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-24 md:pb-10 pt-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Tous les aliments de A à Z</h1>
        <p className="text-gray-600">
          Explorez notre catalogue complet d'aliments classés par ordre alphabétique.
        </p>
      </div>
      
      {/* Navigation alphabétique */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 shadow-sm mb-6">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex justify-center md:justify-start space-x-1 md:space-x-2">
            {alphabet.map(letter => {
              const isAvailable = availableLetters.includes(letter);
              const isActive = selectedLetter === letter;
              
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && setSelectedLetter(letter)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-nutri-green-500 text-white'
                      : isAvailable
                      ? 'hover:bg-gray-100'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!isAvailable}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Affichage des aliments par lettre */}
      <div>
        {Object.keys(foodsByLetter).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun aliment disponible pour le moment.</p>
          </div>
        ) : !foodsByLetter[selectedLetter] || foodsByLetter[selectedLetter].length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun aliment commençant par la lettre {selectedLetter}.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-medium mb-4">
              Aliments commençant par {selectedLetter} <span className="text-gray-500">({foodsByLetter[selectedLetter]?.length || 0})</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {foodsByLetter[selectedLetter]?.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  variant="compact"
                  isSelected={isSelected(food.id)}
                  onSelect={handleSelectFood}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
