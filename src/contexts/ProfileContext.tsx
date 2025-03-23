
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfils } from '@/services/profilsService';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

type ProfileContextType = {
  activeProfileId: string | null;
  activeProfile: UserProfile | null;
  setActiveProfileId: (id: string | null) => void;
  loading: boolean;
  profiles: UserProfile[];
  refreshProfiles: () => Promise<UserProfile[]>; // Changed return type from void to UserProfile[]
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshProfiles = async () => {
    try {
      const data = await fetchProfils();
      setProfiles(data);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des profils:', err);
      toast.error('Impossible de charger les profils');
      return [];
    }
  };

  // Load profiles and check for stored profile ID on initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get stored profile ID
        const storedProfileId = localStorage.getItem('activeProfileId');
        
        // Load all profiles
        const profilesData = await refreshProfiles();
        
        if (storedProfileId) {
          // Check if the stored profile exists in the loaded profiles
          const profileExists = profilesData.some(p => p.id === storedProfileId);
          
          if (profileExists) {
            setActiveProfileId(storedProfileId);
          } else {
            // If stored profile doesn't exist, clear the invalid ID
            localStorage.removeItem('activeProfileId');
            
            // If there are profiles, redirect to profile selection
            if (profilesData.length > 0) {
              navigate('/profil');
            } else {
              navigate('/profil/creer');
            }
          }
        } else if (profilesData.length === 0) {
          // If no profiles exist, redirect to create profile
          navigate('/profil/creer');
        } else {
          // If no stored profile but profiles exist, redirect to profile selection
          navigate('/profil');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du contexte de profil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Update active profile when activeProfileId changes
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('activeProfileId', activeProfileId);
      const profile = profiles.find(p => p.id === activeProfileId) || null;
      setActiveProfile(profile);
    } else {
      localStorage.removeItem('activeProfileId');
      setActiveProfile(null);
    }
  }, [activeProfileId, profiles]);

  return (
    <ProfileContext.Provider
      value={{
        activeProfileId,
        activeProfile,
        setActiveProfileId,
        loading,
        profiles,
        refreshProfiles,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
