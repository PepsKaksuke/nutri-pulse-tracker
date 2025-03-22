
import React from 'react';
import { cn } from '@/lib/utils';
import { HealthProperty } from '@/lib/types';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Activity, 
  Atom, 
  Shield, 
  Dumbbell 
} from 'lucide-react';

interface HealthBadgeProps {
  property: HealthProperty;
  className?: string;
  variant?: 'default' | 'outline' | 'pill';
  size?: 'sm' | 'md' | 'lg';
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ 
  property, 
  className,
  variant = 'default',
  size = 'md'
}) => {
  // Configuration des badges par propriété
  const badgeConfig: Record<HealthProperty, { 
    icon: React.ReactNode, 
    color: string, 
    bgColor: string,
    borderColor: string
  }> = {
    'Antioxydant': { 
      icon: <Sparkles size={size === 'sm' ? 12 : 14} />, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    'Anti-inflammatoire': { 
      icon: <Activity size={size === 'sm' ? 12 : 14} />, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    'Santé intestinale': { 
      icon: <Atom size={size === 'sm' ? 12 : 14} />, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    'Santé cérébrale': { 
      icon: <Brain size={size === 'sm' ? 12 : 14} />, 
      color: 'text-violet-600', 
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    'Santé cardiaque': { 
      icon: <Heart size={size === 'sm' ? 12 : 14} />, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    'Système immunitaire': { 
      icon: <Shield size={size === 'sm' ? 12 : 14} />, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    'Santé osseuse': { 
      icon: <Dumbbell size={size === 'sm' ? 12 : 14} />, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    'Énergie': { 
      icon: <Activity size={size === 'sm' ? 12 : 14} />, 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    'Digestion': { 
      icon: <Atom size={size === 'sm' ? 12 : 14} />, 
      color: 'text-teal-600', 
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  };

  const config = badgeConfig[property];
  
  // Tailles
  const sizeClasses = {
    'sm': 'text-xs px-1.5 py-0.5 gap-1',
    'md': 'text-xs px-2 py-0.5 gap-1.5',
    'lg': 'text-sm px-2.5 py-1 gap-2'
  };

  // Variantes
  const variantClasses = {
    'default': `${config.bgColor} ${config.color}`,
    'outline': `bg-transparent border ${config.borderColor} ${config.color}`,
    'pill': `${config.bgColor} ${config.color} rounded-full`
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center font-medium rounded transition-all", 
        sizeClasses[size], 
        variantClasses[variant],
        className
      )}
    >
      <span className="shrink-0">{config.icon}</span>
      <span>{property}</span>
    </div>
  );
};

export default HealthBadge;
