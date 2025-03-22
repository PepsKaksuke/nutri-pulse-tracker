
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, PlusCircle, CheckCircle } from 'lucide-react';
import HealthBadge from '@/components/ui-custom/HealthBadge';
import SeasonIcon from '@/components/ui-custom/SeasonIcon';
import { Food, SelectedFood } from '@/lib/types';
import { toast } from 'sonner';
import { fetchAlimentById } from '@/services/alimentsService';
import { 
  fetchAlimentsSelectionnes, 
  addAlimentSelectionne, 
  removeAlimentSelectionne 
} from '@/services/alimentsSelectionnesService';

const FoodDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilId, setProfilId] = useState<string>("1"); // Profil par défaut pour le moment

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Récupérer les détails de l'aliment
        const foodData = await fetchAlimentById(id);
        if (foodData) {
          setFood(foodData);
          
          // Récupérer les aliments sélectionnés
          const selected = await fetchAlimentsSelectionnes(profilId);
          setSelectedFoods(selected);
          
          // Vérifier si cet aliment est déjà sélectionné aujourd'hui
          const today = new Date().toISOString().split('T')[0];
          const alreadySelected = selected.some(sf => 
            sf.aliment_id === foodData.id && sf.date_selection === today
          );
          setIsSelected(alreadySelected);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, profilId]);

  useEffect(() => {
    if (!loading && !food) {
      toast.error("Cet aliment n'existe pas");
      navigate('/');
    }
  }, [food, loading, navigate]);

  const toggleSelection = async () => {
    if (!food) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      if (isSelected) {
        await removeAlimentSelectionne(profilId, food.id, today);
        const updatedSelection = selectedFoods.filter(sf => 
          !(sf.aliment_id === food.id && sf.date_selection === today)
        );
        setSelectedFoods(updatedSelection);
        setIsSelected(false);
        toast.success(`${food.nom} retiré de votre assiette`);
      } else {
        const newSelectedFood = await addAlimentSelectionne(profilId, food.id, today);
        setSelectedFoods([...selectedFoods, newSelectedFood]);
        setIsSelected(true);
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

  if (!food) {
    return null;
  }

  const totalMacros = food.glucides + food.proteines + food.lipides;
  const glucidesPercent = Math.round((food.glucides / totalMacros) * 100) || 0;
  const proteinesPercent = Math.round((food.proteines / totalMacros) * 100) || 0;
  const lipidesPercent = Math.round((food.lipides / totalMacros) * 100) || 0;

  const omega3Total = food.omega_3_epa + food.omega_3_dha + food.omega_3_ala;

  return (
    <div className="container mx-auto px-4 pb-24 md:pb-10 pt-6 animate-fade-in">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-nutri-green-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="relative w-full h-56 md:h-72 overflow-hidden rounded-2xl mb-6">
        <img
          src={food.image_url}
          alt={food.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-sm mb-2">
                {food.categorie}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{food.nom}</h1>
            </div>
            <div className="flex gap-1">
              {food.saisons.map(season => (
                <div key={season} className="bg-white/20 backdrop-blur-sm p-1.5 rounded-full">
                  <SeasonIcon season={season} size={18} className="text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Heart className="text-red-500 h-5 w-5" />
              <h2 className="text-lg font-medium">Bienfaits pour la santé</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {food.proprietes_sante.map(property => (
                  <HealthBadge key={property} property={property} />
                ))}
              </div>
              <p className="text-gray-700">
                {food.description || 
                  `${food.nom} est particulièrement ${food.proprietes_sante.join(', ').toLowerCase()}.`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium">Composition nutritionnelle</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Macronutriments</h3>
                
                <div className="mb-4">
                  <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-400 flex items-center justify-center text-xs text-white"
                      style={{ width: `${glucidesPercent}%` }}
                    >
                      {glucidesPercent}%
                    </div>
                    <div 
                      className="h-full bg-red-400 flex items-center justify-center text-xs text-white"
                      style={{ width: `${proteinesPercent}%` }}
                    >
                      {proteinesPercent}%
                    </div>
                    <div 
                      className="h-full bg-yellow-400 flex items-center justify-center text-xs text-white"
                      style={{ width: `${lipidesPercent}%` }}
                    >
                      {lipidesPercent}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span>Glucides: {food.glucides}g</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Protéines: {food.proteines}g</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span>Lipides: {food.lipides}g</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Détail des lipides</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Saturés</p>
                      <p className="font-medium">{food.lipides_satures}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Mono-insaturés</p>
                      <p className="font-medium">{food.mono_insatures}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Poly-insaturés</p>
                      <p className="font-medium">{food.poly_insatures}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ratio Ω-3/Ω-6</p>
                      <p className="font-medium">{food.ratio_omega3_omega6}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Acides gras Oméga-3</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">EPA</p>
                      <p className="font-medium">{food.omega_3_epa}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">DHA</p>
                      <p className="font-medium">{food.omega_3_dha}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ALA</p>
                      <p className="font-medium">{food.omega_3_ala}g</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-blue-100">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">Total Oméga-3</p>
                      <p className="font-medium text-sm">{omega3Total.toFixed(2)}g</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Fibres</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500">Fibres alimentaires</p>
                    <p className="font-medium">{food.fibres}g</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Vitamines</h3>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-500">Vitamine C</p>
                    <p className="font-medium">{food.vitamine_c}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vitamine D</p>
                    <p className="font-medium">{food.vitamine_d}µg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vitamine B6</p>
                    <p className="font-medium">{food.vitamine_b6}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vitamine B9 (Folate)</p>
                    <p className="font-medium">{food.vitamine_b9}µg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vitamine B12</p>
                    <p className="font-medium">{food.vitamine_b12}µg</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Minéraux</h3>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-gray-500">Fer</p>
                    <p className="font-medium">{food.fer}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Calcium</p>
                    <p className="font-medium">{food.calcium}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Magnésium</p>
                    <p className="font-medium">{food.magnesium}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Zinc</p>
                    <p className="font-medium">{food.zinc}mg</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sélénium</p>
                    <p className="font-medium">{food.selenium}µg</p>
                  </div>
                </div>
              </div>
              
              {food.composes_bioactifs.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Composés bioactifs</h3>
                  <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg">
                    {food.composes_bioactifs.map((compose, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-white rounded-full text-xs border border-gray-200">
                        {compose}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h3 className="text-lg font-medium mb-4">Ajouter à mon assiette</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ajoutez cet aliment à votre assiette du jour pour suivre vos apports nutritionnels.
            </p>
            <button
              onClick={toggleSelection}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isSelected
                  ? "bg-nutri-green-100 text-nutri-green-800 border border-nutri-green-200 hover:bg-nutri-green-200"
                  : "bg-nutri-green-500 text-white hover:bg-nutri-green-600"
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Déjà dans mon assiette
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  Ajouter à mon assiette
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium">Saisonnalité</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {['Printemps', 'Été', 'Automne', 'Hiver'].map((season) => {
                  const isSeason = food.saisons.includes(season as any);
                  return (
                    <div 
                      key={season}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        isSeason ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <SeasonIcon 
                        season={season as any} 
                        className={isSeason ? '' : 'opacity-50'}
                      />
                      <span className="text-sm font-medium">{season}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
