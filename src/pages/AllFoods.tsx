
import React, { useState, useEffect } from 'react';
import { Food, SelectedFood } from '@/lib/types';
import FoodCard from '@/components/ui-custom/FoodCard';
import { toast } from 'sonner';
import { fetchAliments } from '@/services/alimentsService';
import { 
  fetchAlimentsSelectionnes, 
  addAlimentSelectionne, 
  removeAlimentSelectionne 
} from '@/services/alimentsSelectionnesService';

const AllFoods = () => {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [foodsByLetter, setFoodsByLetter] = useState<Record<string, Food[]>>({});
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilId, setProfilId] = useState<string>("1"); // Profil par défaut pour le moment
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Récupérer tous les aliments
        const allFoods = await fetchAliments();
        
        // Grouper les aliments par première lettre
        const groupedFoods: Record<string, Food[]> = {};
        const letters: Set<string> = new Set();
        
        allFoods.forEach(food => {
          const firstLetter = food.nom.charAt(0).toUpperCase();
          if (!groupedFoods[firstLetter]) {
            groupedFoods[firstLetter] = [];
          }
          groupedFoods[firstLetter].push(food);
          letters.add(firstLetter);
        });
        
        setFoodsByLetter(groupedFoods);
        
        const sortedLetters = Array.from(letters).sort();
        setAvailableLetters(sortedLetters);
        
        if (sortedLetters.length > 0 && !sortedLetters.includes(selectedLetter)) {
          setSelectedLetter(sortedLetters[0]);
        }
        
        // Récupérer les aliments sélectionnés
        const selected = await fetchAlimentsSelectionnes(profilId);
        setSelectedFoods(selected);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [profilId, selectedLetter]);
  
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  const isSelected = (foodId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedFoods.some(sf => 
      sf.aliment_id === foodId && sf.date_selection === today
    );
  };
  
  const handleSelectFood = async (food: Food) => {
    const today = new Date().toISOString().split('T')[0];
    const alreadySelected = selectedFoods.find(sf => 
      sf.aliment_id === food.id && sf.date_selection === today
    );
    
    try {
      if (alreadySelected) {
        // Supprimer de la sélection
        await removeAlimentSelectionne(profilId, food.id, today);
        const updatedSelection = selectedFoods.filter(sf => 
          !(sf.aliment_id === food.id && sf.date_selection === today)
        );
        setSelectedFoods(updatedSelection);
        toast.success(`${food.nom} retiré de votre assiette`);
      } else {
        // Ajouter à la sélection
        const newSelectedFood = await addAlimentSelectionne(profilId, food.id, today);
        setSelectedFoods([...selectedFoods, newSelectedFood]);
        toast.success(`${food.nom} ajouté à votre assiette`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la sélection:', error);
      toast.error('Erreur lors de la mise à jour de votre assiette');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24 md:pb-10 pt-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Tous les aliments de A à Z</h1>
        <p className="text-gray-600">
          Explorez notre catalogue complet d'aliments classés par ordre alphabétique.
        </p>
      </div>
      
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
