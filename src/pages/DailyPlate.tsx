
import React from 'react';
import { Search, Trash2, Plus } from 'lucide-react';
import { NutrientType } from '@/lib/types';
import { useDailyPlate } from '@/hooks/useDailyPlate';
import SearchFoodDialog from '@/components/daily-plate/SearchFoodDialog';
import FoodsList from '@/components/daily-plate/FoodsList';
import NutrientsSummary from '@/components/daily-plate/NutrientsSummary';

const DailyPlate = () => {
  const {
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
    getNutrientInfo
  } = useDailyPlate();

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
          {activeProfile 
            ? `Profil actif: ${activeProfile.prenom}` 
            : "Aucun profil sélectionné"
          }
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
        
        <SearchFoodDialog
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onAddFood={addFoodToPlate}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-medium">
            Aliments consommés <span className="text-gray-500">({todayFoods.length})</span>
          </h2>
          
          <FoodsList 
            foods={todayFoods}
            onRemoveFood={removeFoodFromPlate}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </div>
        
        <NutrientsSummary 
          nutrientsToShow={nutrientsToShow}
          getNutrientInfo={getNutrientInfo}
        />
      </div>
    </div>
  );
};

export default DailyPlate;
