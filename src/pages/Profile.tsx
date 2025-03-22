
import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X } from 'lucide-react';
import NutrientProgressBar from '@/components/ui-custom/NutrientProgressBar';
import { 
  nutrientRecommendations, 
  calculateDailyIntake,
  calculateTotalOmega3
} from '@/lib/dummyData';
import { NutrientType, UserProfile } from '@/lib/types';
import { toast } from 'sonner';
import { fetchProfilById, updateProfil } from '@/services/profilsService';
import { getSelectedFoodsForDate } from '@/services/alimentsSelectionnesService';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayFoodIds, setTodayFoodIds] = useState<string[]>([]);
  
  // Charger les données du profil
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Récupérer le premier profil utilisateur
        const profilData = await fetchProfilById("1");
        
        if (profilData) {
          setProfile(profilData);
          setFormData(profilData);
          
          // Récupérer les aliments sélectionnés aujourd'hui
          const today = new Date().toISOString().split('T')[0];
          const todayFoods = await getSelectedFoodsForDate(profilData.id, today);
          setTodayFoodIds(todayFoods.map(food => food.id));
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
  
  const startEditing = () => {
    if (profile) {
      setFormData({ ...profile });
      setIsEditing(true);
    }
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    
    if (name.startsWith('objectifs.')) {
      const nutrientName = name.split('.')[1] as NutrientType;
      setFormData({
        ...formData,
        objectifs: {
          ...formData.objectifs,
          [nutrientName]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'poids' ? parseFloat(value) || 0 : value
      });
    }
  };
  
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    try {
      const updatedProfile = await updateProfil(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
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

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <p>Aucun profil trouvé.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-24 md:pb-10 pt-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-nutri-green-100 p-3 rounded-full">
            <User className="h-8 w-8 text-nutri-green-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{profile.prenom}</h1>
            <p className="text-gray-600">{profile.sexe}, {profile.poids} kg</p>
          </div>
        </div>
        
        <button
          onClick={startEditing}
          className="mt-4 md:mt-0 flex items-center gap-1.5 px-3 py-2 bg-white text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Edit className="h-4 w-4" />
          Modifier mon profil
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">
            {isEditing ? "Modifier mon profil" : "Mes objectifs nutritionnels"}
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            {isEditing ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nutri-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">
                      Sexe
                    </label>
                    <select
                      id="sexe"
                      name="sexe"
                      value={formData.sexe}
                      onChange={handleFormChange as any}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nutri-green-500 focus:border-transparent"
                    >
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="poids" className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      id="poids"
                      name="poids"
                      value={formData.poids}
                      onChange={handleFormChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nutri-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <h3 className="text-md font-medium text-gray-900 mb-3">Objectifs nutritionnels quotidiens</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nutrientsToShow.map(nutrient => {
                    const rec = nutrientRecommendations.find(r => r.nutrient === nutrient);
                    return (
                      <div key={nutrient}>
                        <label htmlFor={`objectif-${nutrient}`} className="block text-sm font-medium text-gray-700 mb-1">
                          {rec?.label || nutrient} ({rec?.unit || 'g'})
                        </label>
                        <input
                          type="number"
                          id={`objectif-${nutrient}`}
                          name={`objectifs.${nutrient}`}
                          value={formData.objectifs[nutrient]}
                          onChange={handleFormChange}
                          min="0"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nutri-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-nutri-green-500 text-white rounded-md hover:bg-nutri-green-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nutrientsToShow.map(nutrient => {
                    const rec = nutrientRecommendations.find(r => r.nutrient === nutrient);
                    return (
                      <div 
                        key={nutrient}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <p className="text-sm text-gray-500 mb-1">{rec?.label || nutrient}</p>
                        <div className="flex items-end justify-between">
                          <p className="text-lg font-medium">
                            {profile.objectifs[nutrient]} <span className="text-sm">{rec?.unit || 'g'}</span>
                          </p>
                          {rec && (
                            <p className="text-xs text-gray-500">
                              Recommandation: {rec.daily} {rec.unit}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Ces objectifs sont personnalisés en fonction de votre profil et peuvent être modifiés à tout moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
