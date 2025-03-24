
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/lib/types';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { PlusIcon, RefreshCw } from 'lucide-react';

const ProfileSelection = () => {
  const { profiles, setActiveProfileId, loading, refreshProfiles, error } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Reload profiles when the page is visited
    refreshProfiles();
  }, [refreshProfiles]);

  const handleSelectProfile = (profile: UserProfile) => {
    setActiveProfileId(profile.id);
    navigate('/');
  };

  const handleRefresh = async () => {
    await refreshProfiles();
  };

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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Sélectionner un profil</h1>
          <p className="text-muted-foreground">
            Choisissez un profil pour personnaliser votre expérience nutritionnelle.
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <h2 className="text-2xl font-semibold mb-4">Aucun profil trouvé</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore créé de profil nutritionnel. Créez-en un pour commencer à suivre vos objectifs.
            </p>
            <Button onClick={() => navigate('/profil/creer')}>
              <PlusIcon className="mr-2 h-4 w-4" /> Créer un profil
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <div 
                key={profile.id} 
                className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectProfile(profile)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{profile.prenom}</h2>
                    <div className="text-sm text-gray-500 mt-1">
                      {profile.sexe}, {profile.poids} kg
                    </div>
                  </div>
                  <Button onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProfile(profile);
                  }}>
                    Sélectionner
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/profil/creer')}>
                <PlusIcon className="mr-2 h-4 w-4" /> Créer un nouveau profil
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelection;
