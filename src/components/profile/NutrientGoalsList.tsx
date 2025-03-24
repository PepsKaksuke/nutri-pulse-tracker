
import React, { useState, useEffect } from 'react';
import { UserProfile, Food, NutrientType } from '@/lib/types';
import NutrientProgressBar from '@/components/ui-custom/NutrientProgressBar';
import { cn } from '@/lib/utils';
import { nutrientRecommendations } from '@/lib/dummyData';
import { getSelectedFoodsForDate } from '@/services/alimentsSelectionnesService';

interface NutrientGoalsListProps {
  profile: UserProfile;
  className?: string;
}

const NutrientGoalsList: React.FC<NutrientGoalsListProps> = ({ profile, className }) => {
  const [todayFoods, setTodayFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  // Load today's foods for this profile
  useEffect(() => {
    const loadTodayFoods = async () => {
      try {
        setLoading(true);
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const foods = await getSelectedFoodsForDate(profile.id, today);
        setTodayFoods(foods);
      } catch (error) {
        console.error("Error loading today's foods:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTodayFoods();
  }, [profile.id]);

  // Calculate total nutrients from today's foods
  const calculateNutrientTotal = (nutrientType: NutrientType): number => {
    return todayFoods.reduce((total, food) => {
      // For omega_3_total, calculate the sum of different omega-3s
      if (nutrientType === 'omega_3_total') {
        return total + (food.omega_3_ala + food.omega_3_epa + food.omega_3_dha);
      }
      
      // For other nutrients, directly use the value
      return total + (food[nutrientType] || 0);
    }, 0);
  };

  const nutrientsList: NutrientType[] = [
    'glucides', 'proteines', 'lipides', 'fibres', 
    'vitamine_c', 'vitamine_d', 'fer', 'calcium', 
    'magnesium', 'omega_3_total'
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        nutrientsList.map(nutrient => {
          const recommendation = nutrientRecommendations.find(
            rec => rec.nutrient === nutrient
          );
          
          const current = calculateNutrientTotal(nutrient);
          const target = profile.objectifs[nutrient];
          
          return (
            <NutrientProgressBar
              key={nutrient}
              label={recommendation?.label || nutrient}
              current={current}
              target={target}
              recommendation={recommendation?.daily}
              unit={recommendation?.unit || 'g'}
              color={recommendation?.color || 'bg-blue-500'}
            />
          );
        })
      )}
    </div>
  );
};

export default NutrientGoalsList;
