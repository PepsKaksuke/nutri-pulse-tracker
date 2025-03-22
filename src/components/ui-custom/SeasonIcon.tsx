
import React from 'react';
import { 
  Sun, 
  Snowflake, 
  Flower, 
  Leaf, 
  CalendarDays 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Season } from '@/lib/types';

interface SeasonIconProps {
  season: Season;
  className?: string;
  size?: number;
}

export const SeasonIcon: React.FC<SeasonIconProps> = ({ 
  season, 
  className, 
  size = 16 
}) => {
  let icon;
  let color;

  switch (season) {
    case 'Printemps':
      icon = <Flower size={size} />;
      color = 'text-pink-400';
      break;
    case 'Été':
      icon = <Sun size={size} />;
      color = 'text-amber-400';
      break;
    case 'Automne':
      icon = <Leaf size={size} />;
      color = 'text-orange-500';
      break;
    case 'Hiver':
      icon = <Snowflake size={size} />;
      color = 'text-blue-400';
      break;
    case "Toute l'année":
      icon = <CalendarDays size={size} />;
      color = 'text-purple-400';
      break;
    default:
      icon = <CalendarDays size={size} />;
      color = 'text-gray-400';
  }

  return (
    <div className={cn("inline-flex items-center justify-center transition-all duration-300", color, className)}>
      {icon}
    </div>
  );
};

export default SeasonIcon;
