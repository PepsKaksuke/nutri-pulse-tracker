
import React from 'react';
import { UserProfile } from '@/lib/types';
import NutrientProgressBar from '@/components/ui-custom/NutrientProgressBar';
import { 
  Apple, 
  BarChart2, 
  Coffee, 
  Droplet, 
  Fish, 
  Leaf, 
  Sun, 
  Wheat 
} from 'lucide-react';

type NutrientGoalsListProps = {
  profile: UserProfile;
  className?: string;
};

// Define recommended daily values according to general health guidelines
const recommendedValues = {
  glucides: 275, // g
  proteines: 50, // g
  lipides: 70, // g
  fibres: 25, // g
  vitamine_c: 80, // mg
  vitamine_d: 15, // µg
  fer: 14, // mg - average between male and female
  calcium: 1000, // mg
  magnesium: 375, // mg - average between male and female
  omega_3_total: 1.6, // g
};

// Define colors for different nutrient types
const nutrientColors = {
  macronutrients: "bg-blue-400",
  vitamins: "bg-green-400",
  minerals: "bg-amber-400",
  fats: "bg-purple-400",
  fiber: "bg-orange-400",
};

// Define icons for each nutrient
const nutrientIcons = {
  glucides: <Wheat className="h-4 w-4" />,
  proteines: <Fish className="h-4 w-4" />,
  lipides: <Droplet className="h-4 w-4" />,
  fibres: <Leaf className="h-4 w-4" />,
  vitamine_c: <Apple className="h-4 w-4" />,
  vitamine_d: <Sun className="h-4 w-4" />,
  fer: <BarChart2 className="h-4 w-4" />,
  calcium: <Coffee className="h-4 w-4" />,
  magnesium: <Coffee className="h-4 w-4" />,
  omega_3_total: <Fish className="h-4 w-4" />,
};

export const NutrientGoalsList = ({ profile, className }: NutrientGoalsListProps) => {
  if (!profile) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Macronutriments</h3>
        <NutrientProgressBar 
          label="Glucides" 
          current={profile.objectifs.glucides}
          target={profile.objectifs.glucides}
          recommendation={recommendedValues.glucides}
          unit="g"
          color={nutrientColors.macronutrients}
          icon={nutrientIcons.glucides}
        />
        <NutrientProgressBar 
          label="Protéines" 
          current={profile.objectifs.proteines}
          target={profile.objectifs.proteines}
          recommendation={recommendedValues.proteines}
          unit="g"
          color={nutrientColors.macronutrients}
          icon={nutrientIcons.proteines}
        />
        <NutrientProgressBar 
          label="Lipides" 
          current={profile.objectifs.lipides}
          target={profile.objectifs.lipides}
          recommendation={recommendedValues.lipides}
          unit="g"
          color={nutrientColors.macronutrients}
          icon={nutrientIcons.lipides}
        />
        <NutrientProgressBar 
          label="Fibres" 
          current={profile.objectifs.fibres}
          target={profile.objectifs.fibres}
          recommendation={recommendedValues.fibres}
          unit="g"
          color={nutrientColors.fiber}
          icon={nutrientIcons.fibres}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Vitamines</h3>
        <NutrientProgressBar 
          label="Vitamine C" 
          current={profile.objectifs.vitamine_c}
          target={profile.objectifs.vitamine_c}
          recommendation={recommendedValues.vitamine_c}
          unit="mg"
          color={nutrientColors.vitamins}
          icon={nutrientIcons.vitamine_c}
        />
        <NutrientProgressBar 
          label="Vitamine D" 
          current={profile.objectifs.vitamine_d}
          target={profile.objectifs.vitamine_d}
          recommendation={recommendedValues.vitamine_d}
          unit="µg"
          color={nutrientColors.vitamins}
          icon={nutrientIcons.vitamine_d}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Minéraux</h3>
        <NutrientProgressBar 
          label="Fer" 
          current={profile.objectifs.fer}
          target={profile.objectifs.fer}
          recommendation={recommendedValues.fer}
          unit="mg"
          color={nutrientColors.minerals}
          icon={nutrientIcons.fer}
        />
        <NutrientProgressBar 
          label="Calcium" 
          current={profile.objectifs.calcium}
          target={profile.objectifs.calcium}
          recommendation={recommendedValues.calcium}
          unit="mg"
          color={nutrientColors.minerals}
          icon={nutrientIcons.calcium}
        />
        <NutrientProgressBar 
          label="Magnésium" 
          current={profile.objectifs.magnesium}
          target={profile.objectifs.magnesium}
          recommendation={recommendedValues.magnesium}
          unit="mg"
          color={nutrientColors.minerals}
          icon={nutrientIcons.magnesium}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Acides gras essentiels</h3>
        <NutrientProgressBar 
          label="Oméga-3" 
          current={profile.objectifs.omega_3_total}
          target={profile.objectifs.omega_3_total}
          recommendation={recommendedValues.omega_3_total}
          unit="g"
          color={nutrientColors.fats}
          icon={nutrientIcons.omega_3_total}
        />
      </div>
    </div>
  );
};

export default NutrientGoalsList;
