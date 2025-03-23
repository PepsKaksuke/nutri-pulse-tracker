
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ isSubmitting, isEditing }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/profil')}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer mon profil'}
      </Button>
    </div>
  );
};

export default FormActions;
