
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import FoodCard from '@/components/ui-custom/FoodCard';
import HealthBadge from '@/components/ui-custom/HealthBadge';
import { Food, FoodCategory, HealthProperty, Season, SelectedFood } from '@/lib/types';
import { toast } from 'sonner';
import { 
  fetchAliments,
  searchAliments,
  filterAlimentsByCategory,
  filterAlimentsByHealthProperty,
  filterAlimentsBySeason
} from '@/services/alimentsService';
import { 
  fetchAlimentsSelectionnes,
  addAlimentSelectionne,
  removeAlimentSelectionne
} from '@/services/alimentsSelectionnesService';
import { fetchProfilById } from '@/services/profilsService';

const Index = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as FoodCategory[],
    healthProperties: [] as HealthProperty[],
    seasons: [] as Season[]
  });
  const [loading, setLoading] = useState(true);
  const [profilId, setProfilId] = useState<string | null>(null);

  // Récupérer les données au chargement
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Récupérer le premier profil utilisateur comme profil actif
        const profils = await fetchProfilById("1");
        if (profils) {
          setProfilId(profils.id);
          
          // Récupérer les aliments sélectionnés par ce profil
          const selected = await fetchAlimentsSelectionnes(profils.id);
          setSelectedFoods(selected);
        }
        
        // Récupérer tous les aliments
        const allFoods = await fetchAliments();
        setFoods(allFoods);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  // Catégories disponibles
  const categories: FoodCategory[] = [
    'Fruit', 'Légume', 'Poisson', 'Viande', 'Noix', 'Céréales', 'Légumineuse'
  ];

  // Propriétés santé
  const healthProperties: HealthProperty[] = [
    'Anti-inflammatoire', 'Antioxydant', 'Santé intestinale', 
    'Santé cérébrale', 'Santé cardiaque', 'Système immunitaire'
  ];

  // Saisons
  const seasons: Season[] = [
    'Printemps', 'Été', 'Automne', 'Hiver', "Toute l'année"
  ];

  // Recherche de foods
  useEffect(() => {
    const applyFilters = async () => {
      try {
        // Recherche par mot-clé
        let filteredFoods = await searchAliments(searchQuery);
        
        // Appliquer les filtres
        if (filters.categories.length > 0) {
          filteredFoods = filteredFoods.filter(food => 
            filters.categories.includes(food.categorie)
          );
        }
        
        if (filters.healthProperties.length > 0) {
          filteredFoods = filteredFoods.filter(food => 
            food.proprietes_sante.some(prop => filters.healthProperties.includes(prop))
          );
        }
        
        if (filters.seasons.length > 0) {
          filteredFoods = filteredFoods.filter(food => 
            food.saisons.some(season => filters.seasons.includes(season))
          );
        }
        
        setFoods(filteredFoods);
      } catch (error) {
        console.error('Erreur lors de l\'application des filtres:', error);
        toast.error('Erreur lors de la recherche');
      }
    };
    
    applyFilters();
  }, [searchQuery, filters]);

  // Vérifier si un aliment est dans la sélection du jour
  const isSelected = (foodId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedFoods.some(sf => 
      sf.aliment_id === foodId && sf.date_selection === today
    );
  };

  // Gérer la sélection d'un aliment
  const handleSelectFood = async (food: Food) => {
    if (!profilId) {
      toast.error('Aucun profil utilisateur actif');
      return;
    }
    
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

  // Ajouter ou retirer un filtre
  const toggleFilter = <T extends string>(
    type: 'categories' | 'healthProperties' | 'seasons',
    value: T
  ) => {
    setFilters(prev => {
      const currentFilters = prev[type] as T[];
      const exists = currentFilters.includes(value);
      
      return {
        ...prev,
        [type]: exists 
          ? currentFilters.filter(item => item !== value)
          : [...currentFilters, value]
      };
    });
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      categories: [],
      healthProperties: [],
      seasons: []
    });
    setSearchQuery('');
  };

  // Compter le nombre total de filtres actifs
  const activeFilterCount = 
    filters.categories.length + 
    filters.healthProperties.length + 
    filters.seasons.length;

  return (
    <div className="container mx-auto px-4 pb-24 md:pb-10">
      {/* Hero section */}
      <div className="text-center py-8 md:py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Découvrez la composition nutritionnelle détaillée des aliments
        </h1>
        <p className="text-gray-600 mb-8">
          Explorez les bienfaits santé et les valeurs nutritives des aliments pour mieux comprendre ce que vous mangez.
        </p>
        
        {/* Barre de recherche principale */}
        <div className="relative w-full max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un aliment par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 shadow-sm focus:border-nutri-green-500 focus:ring focus:ring-nutri-green-200 focus:ring-opacity-50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtres Desktop */}
        <div className="hidden md:block w-64 space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Filtres</h2>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="text-xs text-nutri-green-600 hover:underline"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            
            {/* Catégories */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleFilter('categories', category)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-nutri-green-100 text-nutri-green-800 border border-nutri-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Propriétés santé */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Propriétés santé</h3>
              <div className="space-y-1.5">
                {healthProperties.map(property => (
                  <button
                    key={property}
                    onClick={() => toggleFilter('healthProperties', property)}
                    className="w-full text-left"
                  >
                    <HealthBadge 
                      property={property} 
                      variant={filters.healthProperties.includes(property) ? 'default' : 'outline'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Saisons */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Saisons</h3>
              <div className="flex flex-wrap gap-2">
                {seasons.map(season => (
                  <button
                    key={season}
                    onClick={() => toggleFilter('seasons', season)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filters.seasons.includes(season)
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          {/* Bouton de filtre mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-nutri-green-100 text-nutri-green-800 text-xs font-medium rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="text-sm text-nutri-green-600"
                >
                  Réinitialiser
                </button>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {foods.length} aliment{foods.length > 1 ? 's' : ''} trouvé{foods.length > 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Résultats */}
          {foods.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">Aucun aliment trouvé</h3>
              <p className="text-gray-500 mb-4">
                Essayez d'autres termes de recherche ou de modifier vos filtres.
              </p>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-nutri-green-500 text-white rounded-lg hover:bg-nutri-green-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foods.map(food => (
                <FoodCard
                  key={food.id}
                  food={food}
                  isSelected={isSelected(food.id)}
                  onSelect={handleSelectFood}
                  className="animate-fade-in"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de filtres mobile */}
      {isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Filtres</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Catégories */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Catégories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleFilter('categories', category)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        filters.categories.includes(category)
                          ? 'bg-nutri-green-100 text-nutri-green-800 border border-nutri-green-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Propriétés santé */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Propriétés santé</h3>
                <div className="grid grid-cols-2 gap-2">
                  {healthProperties.map(property => (
                    <button
                      key={property}
                      onClick={() => toggleFilter('healthProperties', property)}
                      className="text-left"
                    >
                      <HealthBadge 
                        property={property} 
                        variant={filters.healthProperties.includes(property) ? 'default' : 'outline'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Saisons */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Saisons</h3>
                <div className="flex flex-wrap gap-2">
                  {seasons.map(season => (
                    <button
                      key={season}
                      onClick={() => toggleFilter('seasons', season)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        filters.seasons.includes(season)
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex gap-3">
              <button 
                onClick={resetFilters}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-4 py-2 bg-nutri-green-500 text-white rounded-lg hover:bg-nutri-green-600 transition-colors"
              >
                Appliquer ({foods.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
