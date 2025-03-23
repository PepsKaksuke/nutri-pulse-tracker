
import React, { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProfilById } from '@/services/profilsService';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';

const EditProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshProfiles } = useProfile();
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        toast.error("ID de profil non spécifié");
        navigate('/profil');
        return;
      }
      
      try {
        const profileData = await fetchProfilById(id);
        if (!profileData) {
          toast.error("Profil non trouvé");
          navigate('/profil');
          return;
        }
        
        setProfile(profileData);
        
        // Call refreshProfiles but we don't need to use the returned value
        await refreshProfiles();
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast.error("Erreur lors du chargement du profil");
        navigate('/profil');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [id, navigate, refreshProfiles]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Modifier votre profil</h1>
          <p className="text-muted-foreground">
            Mettez à jour les informations ci-dessous pour modifier votre profil nutritionnel.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {profile && <ProfileForm initialData={profile} isEditing={true} />}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
