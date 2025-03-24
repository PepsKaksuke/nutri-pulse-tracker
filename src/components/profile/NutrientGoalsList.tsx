
import React from 'react';
import { NutrientType, UserProfile } from '@/lib/types';
import { getNutrientData } from '@/lib/nutrientRecommendations';

interface NutrientGoalsListProps {
  profile: UserProfile;
  className?: string;
  nutrientsToShow?: NutrientType[];
}

// Objectifs nutritionnels par défaut (si non spécifiés)
const defaultNutrients: NutrientType[] = [
  'glucides', 'proteines', 'lipides', 'fibres', 
  'vitamine_c', 'fer', 'calcium', 'magnesium'
];

const NutrientGoalsList: React.FC<NutrientGoalsListProps> = ({ 
  profile, 
  className = '',
  nutrientsToShow = defaultNutrients
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {nutrientsToShow.map(nutrient => {
        const data = getNutrientData(nutrient);
        const value = profile.objectifs[nutrient] || 0;
        
        return (
          <div key={nutrient} className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{data.label}</span>
              <span className="text-gray-500">{value} {data.unit}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full" 
                style={{ 
                  width: `${Math.min(100, (value / data.daily) * 100)}%`, 
                  backgroundColor: data.color 
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutrientGoalsList;
