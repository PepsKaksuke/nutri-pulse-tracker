
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/types';
import { fetchProfils } from '@/services/profilsService';
import { PlusIcon } from 'lucide-react';

const Profile = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await fetchProfils();
        setProfiles(data);
      } catch (err) {
        console.error('Erreur lors du chargement des profils:', err);
        setError('Impossible de charger les profils. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Chargement des profils...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
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
        <Link to="/profil/creer">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Nouveau profil
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">{profile.prenom}</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">Sexe:</span> {profile.sexe}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Poids:</span> {profile.poids} kg
              </div>
            </div>
            
            <h3 className="font-medium text-sm text-gray-500 mb-2">Objectifs quotidiens:</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div><span className="text-gray-500">Glucides:</span> {profile.objectifs.glucides}g</div>
              <div><span className="text-gray-500">Protéines:</span> {profile.objectifs.proteines}g</div>
              <div><span className="text-gray-500">Lipides:</span> {profile.objectifs.lipides}g</div>
              <div><span className="text-gray-500">Fibres:</span> {profile.objectifs.fibres}g</div>
              <div><span className="text-gray-500">Vit. C:</span> {profile.objectifs.vitamine_c}mg</div>
              <div><span className="text-gray-500">Vit. D:</span> {profile.objectifs.vitamine_d}μg</div>
              <div><span className="text-gray-500">Fer:</span> {profile.objectifs.fer}mg</div>
              <div><span className="text-gray-500">Calcium:</span> {profile.objectifs.calcium}mg</div>
              <div><span className="text-gray-500">Magnésium:</span> {profile.objectifs.magnesium}mg</div>
              <div><span className="text-gray-500">Oméga-3:</span> {profile.objectifs.omega_3_total}g</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
