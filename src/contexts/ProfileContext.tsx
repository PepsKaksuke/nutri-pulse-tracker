
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProfils } from '@/services/profilsService';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

type ProfileContextType = {
  activeProfileId: string | null;
  activeProfile: UserProfile | null;
  setActiveProfileId: (id: string | null) => void;
  loading: boolean;
  profiles: UserProfile[];
  refreshProfiles: () => Promise<UserProfile[]>;
  error: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastErrorTime, setLastErrorTime] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const refreshProfiles = async () => {
    try {
      // Reset error state when attempting to refresh
      setError(false);
      const data = await fetchProfils();
      setProfiles(data);
      return data;
    } catch (err) {
      console.error('Erreur lors du chargement des profils:', err);
      
      // Set error state
      setError(true);
      
      // Avoid showing too many toasts
      const now = Date.now();
      if (now - lastErrorTime > 5000) { // Only show toast every 5 seconds
        toast.error('Impossible de charger les profils');
        setLastErrorTime(now);
      }
      
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
            
            // Only redirect if we're not already on a profile-related page
            const isProfilePage = location.pathname.includes('/profil');
            
            if (!isProfilePage) {
              // If there are profiles, redirect to profile selection
              if (profilesData.length > 0) {
                navigate('/profil');
              } else {
                navigate('/profil/creer');
              }
            }
          }
        } else if (profilesData.length === 0) {
          // Only redirect to create profile if we're not already there
          const isCreateProfilePage = location.pathname === '/profil/creer';
          if (!isCreateProfilePage) {
            navigate('/profil/creer');
          }
        } else if (!location.pathname.includes('/profil')) {
          // Only redirect to profile selection if we're not on any profile-related page
          navigate('/profil');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du contexte de profil:', error);
        setError(true);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    if (!initialLoadComplete) {
      loadData();
    }
  }, [navigate, location.pathname, initialLoadComplete]);

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
        error,
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
