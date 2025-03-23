
import React from 'react';
import { NutrientType } from '@/lib/types';
import NutrientProgressBar from '@/components/ui-custom/NutrientProgressBar';

interface NutrientInfo {
  current: number;
  target: number;
  recommendation?: number;
  unit: string;
  label: string;
  color: string;
}

interface NutrientsSummaryProps {
  nutrientsToShow: NutrientType[];
  getNutrientInfo: (nutrientType: NutrientType) => NutrientInfo;
}

const NutrientsSummary: React.FC<NutrientsSummaryProps> = ({ 
  nutrientsToShow, 
  getNutrientInfo 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Mes apports du jour</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
        {nutrientsToShow.map(nutrient => {
          const info = getNutrientInfo(nutrient);
          return (
            <NutrientProgressBar
              key={nutrient}
              label={info.label}
              current={info.current}
              target={info.target}
              recommendation={info.recommendation}
              unit={info.unit}
              color={info.color}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NutrientsSummary;
