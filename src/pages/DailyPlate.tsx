
import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Trash2 } from 'lucide-react';
import { 
  nutrientRecommendations,
  calculateDailyIntake,
  calculateTotalOmega3,
} from '@/lib/dummyData';
import { Food, SelectedFood, NutrientType } from '@/lib/types';
import FoodCard from '@/components/ui-custom/FoodCard';
import NutrientProgressBar from '@/components/ui-custom/NutrientProgressBar';
import { toast } from 'sonner';
import { fetchProfilById } from '@/services/profilsService';
import { 
  getSelectedFoodsForDate,
  addAlimentSelectionne,
  removeAlimentSelectionne,
  clearAlimentsSelectionnesForDate
} from '@/services/alimentsSelectionnesService';
import { searchAliments } from '@/services/alimentsService';

const DailyPlate = () => {
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [todayFoods, setTodayFoods] = useState<Food[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [todayFoodIds, setTodayFoodIds] = useState<string[]>([]);
  
  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Récupérer le profil utilisateur
        const profileData = await fetchProfilById("1");
        
        if (profileData) {
          setProfile(profileData);
          
          // Récupérer les aliments d'aujourd'hui
          const today = new Date().toISOString().split('T')[0];
          const foods = await getSelectedFoodsForDate(profileData.id, today);
          setTodayFoods(foods);
          setTodayFoodIds(foods.map(food => food.id));
        } else {
          toast.error('Aucun profil trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Effectuer la recherche
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        try {
          const results = await searchAliments(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          toast.error('Erreur lors de la recherche');
        }
      } else {
        setSearchResults([]);
      }
    };
    
    performSearch();
  }, [searchQuery]);
  
  const addFoodToPlate = async (food: Food) => {
    if (!profile) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    const alreadySelected = todayFoods.some(f => f.id === food.id);
    
    if (alreadySelected) {
      toast.error(`${food.nom} est déjà dans votre assiette`);
      return;
    }
    
    try {
      await addAlimentSelectionne(profile.id, food.id, today);
      
      // Mettre à jour l'UI
      setTodayFoods([...todayFoods, food]);
      setTodayFoodIds([...todayFoodIds, food.id]);
      
      toast.success(`${food.nom} ajouté à votre assiette`);
      setSearchOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'aliment:', error);
      toast.error('Erreur lors de l\'ajout de l\'aliment');
    }
  };
  
  const removeFoodFromPlate = async (food: Food) => {
    if (!profile) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await removeAlimentSelectionne(profile.id, food.id, today);
      
      // Mettre à jour l'UI
      const updatedFoods = todayFoods.filter(f => f.id !== food.id);
      setTodayFoods(updatedFoods);
      setTodayFoodIds(updatedFoods.map(f => f.id));
      
      toast.success(`${food.nom} retiré de votre assiette`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'aliment:', error);
      toast.error('Erreur lors de la suppression de l\'aliment');
    }
  };
  
  const clearPlate = async () => {
    if (!profile) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await clearAlimentsSelectionnesForDate(profile.id, today);
      
      // Mettre à jour l'UI
      setTodayFoods([]);
      setTodayFoodIds([]);
      
      toast.success("Votre assiette a été vidée");
    } catch (error) {
      console.error('Erreur lors du vidage de l\'assiette:', error);
      toast.error('Erreur lors du vidage de l\'assiette');
    }
  };
  
  const getNutrientInfo = (nutrientType: NutrientType) => {
    if (!profile) return { current: 0, target: 0, unit: 'g', label: nutrientType, color: 'bg-blue-500' };
    
    let currentValue = 0;
    
    if (nutrientType === 'omega_3_total') {
      currentValue = calculateTotalOmega3(todayFoodIds);
    } else {
      currentValue = calculateDailyIntake(todayFoodIds, nutrientType);
    }
    
    const recommendation = nutrientRecommendations.find(
      rec => rec.nutrient === nutrientType
    );
    
    const target = profile.objectifs[nutrientType];
    
    return {
      current: currentValue,
      target,
      recommendation: recommendation?.daily,
      unit: recommendation?.unit || 'g',
      label: recommendation?.label || nutrientType,
      color: recommendation?.color || 'bg-blue-500'
    };
  };
  
  const nutrientsToShow: NutrientType[] = [
    'glucides', 'proteines', 'lipides', 'fibres', 
    'vitamine_c', 'vitamine_d', 'fer', 'calcium', 
    'magnesium', 'omega_3_total'
  ];

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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mon assiette du jour</h1>
        <p className="text-gray-600">
          Suivez vos apports nutritionnels quotidiens en ajoutant les aliments consommés.
        </p>
      </div>
      
      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 text-gray-500 text-left"
          >
            <Search className="h-5 w-5 text-gray-400" />
            <span>Rechercher un aliment à ajouter...</span>
          </button>
          
          {todayFoods.length > 0 && (
            <button
              onClick={clearPlate}
              className="flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Vider l'assiette"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {searchOpen && (
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
                    onClick={() => setSearchOpen(false)}
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
                          onClick={() => addFoodToPlate(food)}
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
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-medium">
            Aliments consommés <span className="text-gray-500">({todayFoods.length})</span>
          </h2>
          
          {todayFoods.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium mb-2">Votre assiette est vide</h3>
              <p className="text-gray-500 mb-4">
                Commencez à ajouter des aliments pour suivre vos apports nutritionnels.
              </p>
              <button 
                onClick={() => setSearchOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-nutri-green-500 text-white rounded-lg hover:bg-nutri-green-600 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Ajouter un aliment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {todayFoods.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  variant="list"
                  onSelect={removeFoodFromPlate}
                  isSelected={true}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Mes apports du jour</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
            {nutrientsToShow.map(nutrient => {
              const info = getNutrientInfo(nutrient);
              return (
                <NutrientProgressBar
                  key={nutrient}
                  label={info.label}
                  current={info.current}
                  target={info.target}
                  recommendation={info.recommendation}
                  unit={info.unit}
                  color={info.color}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPlate;
