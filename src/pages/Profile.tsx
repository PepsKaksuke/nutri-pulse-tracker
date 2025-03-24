
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, UserIcon, RefreshCw } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { toast } from 'sonner';
import NutrientGoalsList from '@/components/profile/NutrientGoalsList';
import NutrientsModeSwitch, { NutrientMode } from '@/components/ui-custom/NutrientsModeSwitch';
import { NutrientType } from '@/lib/types';

const Profile = () => {
  const { profiles, loading, refreshProfiles, activeProfileId, setActiveProfileId, error } = useProfile();
  const [nutrientMode, setNutrientMode] = useState<NutrientMode>('macro');
  const navigate = useNavigate();

  useEffect(() => {
    const initialLoad = async () => {
      await refreshProfiles();
    };
    initialLoad();
  }, [refreshProfiles]);

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    toast.success("Profil activé avec succès");
  };

  const handleRefresh = async () => {
    toast.info("Tentative de reconnexion...");
    await refreshProfiles();
  };

  // Définir les nutriments à afficher en fonction du mode
  const macroNutrients: NutrientType[] = [
    'glucides', 'proteines', 'lipides', 'fibres', 'omega_3_total'
  ];
  
  const microNutrients: NutrientType[] = [
    'vitamine_c', 'vitamine_d', 'fer', 'calcium', 'magnesium'
  ];

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-2xl font-semibold mb-4">Problème de connexion</h2>
          <p className="text-gray-600 mb-6">
            Impossible de se connecter à la base de données. Veuillez vérifier votre connexion internet et réessayer.
          </p>
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Chargement des profils...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-2xl font-semibold mb-4">Aucun profil trouvé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore créé de profil nutritionnel. Créez-en un pour commencer à suivre vos objectifs.
          </p>
          <Link to="/profil/creer">
            <Button className="w-full">
              <PlusIcon className="mr-2 h-4 w-4" /> Créer un profil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Affichage des profils existants et de leurs détails
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vos profils</h1>
        <div className="flex items-center gap-4">
          <NutrientsModeSwitch 
            mode={nutrientMode} 
            onChange={setNutrientMode}
          />
          <Link to="/profil/creer">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Nouveau profil
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div 
            key={profile.id} 
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              activeProfileId === profile.id ? 'ring-2 ring-nutri-green-500 ring-offset-2' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{profile.prenom}</h2>
              <div className="flex space-x-2">
                {activeProfileId === profile.id ? (
                  <div className="bg-nutri-green-100 text-nutri-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Actif
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSelectProfile(profile.id)}
                  >
                    <UserIcon className="h-4 w-4 mr-1" />
                    Activer
                  </Button>
                )}
                <Link to={`/profil/modifier/${profile.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">Sexe:</span> {profile.sexe}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Poids:</span> {profile.poids} kg
              </div>
            </div>
            
            <h3 className="font-medium text-sm text-gray-500 mb-2">Objectifs quotidiens:</h3>
            
            {/* Afficher les objectifs nutritionnels avec les barres de progression */}
            <NutrientGoalsList 
              profile={profile} 
              className="mt-4" 
              nutrientsToShow={nutrientMode === 'macro' ? macroNutrients : microNutrients}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
