
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface NutrientProgressBarProps {
  label: string;
  current: number;
  target: number;
  recommendation?: number;
  unit: string;
  color?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({
  label,
  current,
  target,
  recommendation,
  unit,
  color = 'bg-nutri-green-400',
  icon,
  className
}) => {
  // Calcul du pourcentage (limité à 100% pour l'affichage)
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
        <div className="flex items-center text-sm font-medium">
          {icon && <span className="mr-1.5 text-muted-foreground">{icon}</span>}
          {label}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatNumber(current)} / {formatNumber(target)} {unit}
          {recommendation && recommendation !== target && (
            <span className="ml-1 text-muted-foreground/60">
              (recommandé: {formatNumber(recommendation)} {unit})
            </span>
          )}
        </div>
      </div>
      
      <div className="relative h-2 w-full">
        <Progress 
          value={percentage} 
          className="h-2 bg-muted"
          indicatorClassName={cn("transition-all duration-500 ease-in-out", color)}
        />
        
        {/* Indicateur de recommandation si fourni */}
        {recommendation && target !== recommendation && (
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
        {percentage}% de l'objectif
      </div>
    </div>
  );
};

export default NutrientProgressBar;
