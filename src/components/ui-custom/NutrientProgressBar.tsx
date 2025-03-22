
import React from 'react';
import { cn } from '@/lib/utils';

interface NutrientProgressBarProps {
  label: string;
  current: number;
  target: number;
  recommendation?: number;
  unit: string;
  color?: string;
  className?: string;
}

export const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({
  label,
  current,
  target,
  recommendation,
  unit,
  color = 'bg-nutri-green-400',
  className
}) => {
  // Calcul du pourcentage (limité à 100%)
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  // Formatage des nombres selon l'unité
  const formatNumber = (num: number) => {
    if (unit === 'g' && num < 10) {
      return num.toFixed(1);
    }
    return Math.round(num);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          {formatNumber(current)}/{formatNumber(target)} {unit}
        </div>
      </div>
      
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div 
          className={cn("h-full transition-all duration-500 ease-in-out", color)}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Indicateur de recommandation si fourni */}
        {recommendation && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
            style={{ 
              left: `${Math.min((recommendation / target) * 100, 100)}%`,
              opacity: 0.5
            }}
          />
        )}
      </div>
      
      {/* Pourcentage */}
      <div className="text-xs text-right text-muted-foreground">
        {percentage}%
        {recommendation && (
          <span className="ml-2 text-xs text-muted-foreground">
            (Recommandation: {formatNumber(recommendation)} {unit})
          </span>
        )}
      </div>
    </div>
  );
};

export default NutrientProgressBar;
