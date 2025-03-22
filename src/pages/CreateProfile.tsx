
import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';

const CreateProfile = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Créer votre profil</h1>
          <p className="text-muted-foreground">
            Remplissez les informations ci-dessous pour créer votre profil nutritionnel personnalisé.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
