
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Food, NutrientType } from '@/lib/types';
import { useProfile } from '@/contexts/ProfileContext';
import { nutrientRecommendations } from '@/lib/dummyData';
import { 
  getSelectedFoodsForDate,
  addAlimentSelectionne,
  removeAlimentSelectionne,
  clearAlimentsSelectionnesForDate
} from '@/services/alimentsSelectionnesService';
import { searchAliments } from '@/services/alimentsService';

export const useDailyPlate = () => {
  const [todayFoods, setTodayFoods] = useState<Food[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayFoodIds, setTodayFoodIds] = useState<string[]>([]);
  
  const { activeProfile, activeProfileId } = useProfile();
  const navigate = useNavigate();
  
  // Redirect to profile selection if no active profile
  useEffect(() => {
    if (!loading && !activeProfileId) {
      toast.error("Veuillez sélectionner un profil pour accéder à votre assiette");
      navigate('/profil/selection');
    }
  }, [activeProfileId, loading, navigate]);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!activeProfileId) return;
      
      try {
        setLoading(true);
        
        // Get today's foods
        const today = new Date().toISOString().split('T')[0];
        const foods = await getSelectedFoodsForDate(activeProfileId, today);
        setTodayFoods(foods);
        setTodayFoodIds(foods.map(food => food.id));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [activeProfileId]);
  
  // Perform search
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
  
  const addFoodToPlate = async (food: Food, quantity: string = '100g') => {
    if (!activeProfileId) {
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
      await addAlimentSelectionne(activeProfileId, food.id, today, quantity);
      
      // Update UI
      setTodayFoods([...todayFoods, food]);
      setTodayFoodIds([...todayFoodIds, food.id]);
      
      toast.success(`${food.nom} (${quantity}) ajouté à votre assiette`);
      setSearchOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'aliment:', error);
      toast.error('Erreur lors de l\'ajout de l\'aliment');
    }
  };
  
  const removeFoodFromPlate = async (food: Food) => {
    if (!activeProfileId) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await removeAlimentSelectionne(activeProfileId, food.id, today);
      
      // Update UI
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
    if (!activeProfileId) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await clearAlimentsSelectionnesForDate(activeProfileId, today);
      
      // Update UI
      setTodayFoods([]);
      setTodayFoodIds([]);
      
      toast.success("Votre assiette a été vidée");
    } catch (error) {
      console.error('Erreur lors du vidage de l\'assiette:', error);
      toast.error('Erreur lors du vidage de l\'assiette');
    }
  };
  
  // Calculate total nutrients for today's foods
  const calculateNutrientTotal = (nutrientType: NutrientType): number => {
    return todayFoods.reduce((total, food) => {
      // For omega_3_total, calculate the sum of different omega-3s
      if (nutrientType === 'omega_3_total') {
        return total + (food.omega_3_ala + food.omega_3_epa + food.omega_3_dha);
      }
      
      // For other nutrients, directly use the value
      return total + (food[nutrientType] || 0);
    }, 0);
  };
  
  const getNutrientInfo = (nutrientType: NutrientType) => {
    if (!activeProfile) return { current: 0, target: 0, unit: 'g', label: nutrientType, color: 'bg-blue-500' };
    
    // Calculate current intake based on consumed foods
    const currentValue = calculateNutrientTotal(nutrientType);
    
    const recommendation = nutrientRecommendations.find(
      rec => rec.nutrient === nutrientType
    );
    
    const target = activeProfile.objectifs[nutrientType];
    
    return {
      current: currentValue,
      target,
      recommendation: recommendation?.daily,
      unit: recommendation?.unit || 'g',
      label: recommendation?.label || nutrientType,
      color: recommendation?.color || 'bg-blue-500'
    };
  };
  
  return {
    todayFoods,
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    activeProfile,
    addFoodToPlate,
    removeFoodFromPlate,
    clearPlate,
    getNutrientInfo,
    todayFoodIds
  };
};
