
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { Food } from '@/lib/types';
import { cn } from '@/lib/utils';
import { HealthBadge } from './HealthBadge';
import { SeasonIcon } from './SeasonIcon';

interface FoodCardProps {
  food: Food;
  isSelected?: boolean;
  onSelect?: (food: Food) => void;
  onClick?: () => void; // Add onClick prop
  className?: string;
  variant?: 'default' | 'compact' | 'list';
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  isSelected = false,
  onSelect,
  onClick,
  className,
  variant = 'default'
}) => {
  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(food);
    }
  };

  // Variante compacte (pour la liste A-Z et l'assiette du jour)
  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          "relative flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-all duration-300",
          className
        )}
        onClick={onClick} // Add onClick handler
      >
        <img 
          src={food.image_url} 
          alt={food.nom} 
          className="w-12 h-12 object-cover rounded-md"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{food.nom}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{food.categorie}</span>
            {food.saisons.slice(0, 2).map(season => (
              <SeasonIcon key={season} season={season} size={14} />
            ))}
          </div>
        </div>
        
        {onSelect && (
          <button 
            onClick={handleSelectClick}
            className="shrink-0 transition-transform active:scale-95"
            aria-label={isSelected ? "Retirer de l'assiette" : "Ajouter à l'assiette"}
          >
            {isSelected ? (
              <CheckCircle className="text-nutri-green-500 h-6 w-6" />
            ) : (
              <PlusCircle className="text-gray-400 hover:text-nutri-green-500 h-6 w-6" />
            )}
          </button>
        )}
      </div>
    );
  }
  
  // Variante liste (pour les résultats de recherche)
  if (variant === 'list') {
    return (
      <div 
        className={cn(
          "relative flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow transition-all duration-300",
          className
        )}
        onClick={onClick} // Add onClick handler
      >
        <img 
          src={food.image_url} 
          alt={food.nom} 
          className="w-16 h-16 object-cover rounded-md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{food.nom}</h3>
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{food.categorie}</span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-1">
            {food.saisons.slice(0, 3).map(season => (
              <SeasonIcon key={season} season={season} size={14} />
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {food.proprietes_sante.slice(0, 2).map(property => (
              <HealthBadge key={property} property={property} size="sm" />
            ))}
            {food.proprietes_sante.length > 2 && (
              <span className="text-xs text-muted-foreground">+{food.proprietes_sante.length - 2}</span>
            )}
          </div>
        </div>
        
        {onSelect && (
          <button 
            onClick={handleSelectClick}
            className="shrink-0 transition-transform active:scale-95"
            aria-label={isSelected ? "Retirer de l'assiette" : "Ajouter à l'assiette"}
          >
            {isSelected ? (
              <CheckCircle className="text-nutri-green-500 h-6 w-6" />
            ) : (
              <PlusCircle className="text-gray-400 hover:text-nutri-green-500 h-6 w-6" />
            )}
          </button>
        )}
      </div>
    );
  }
  
  // Variante par défaut (carte standard)
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group",
        className
      )}
      onClick={onClick} // Add onClick handler
    >
      {/* Image de l'aliment avec overlay gradient */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={food.image_url} 
          alt={food.nom} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />
        
        {/* Badge de catégorie et icônes de saison */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
          {food.categorie}
        </div>
        
        <div className="absolute top-2 right-2 flex gap-1">
          {food.saisons.map(season => (
            <div key={season} className="bg-white/80 backdrop-blur-sm p-1 rounded-full">
              <SeasonIcon season={season} />
            </div>
          ))}
        </div>
        
        {/* Bouton d'ajout */}
        {onSelect && (
          <button 
            onClick={handleSelectClick}
            className="absolute right-2 bottom-2 p-1 rounded-full bg-white shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label={isSelected ? "Retirer de l'assiette" : "Ajouter à l'assiette"}
          >
            {isSelected ? (
              <CheckCircle className="text-nutri-green-500 h-6 w-6" />
            ) : (
              <PlusCircle className="text-gray-400 hover:text-nutri-green-500 h-6 w-6" />
            )}
          </button>
        )}
      </div>
      
      {/* Contenu */}
      <div className="p-3">
        <Link to={`/aliment/${food.id}`}>
          <h3 className="font-medium text-lg mb-2">{food.nom}</h3>
        </Link>
        
        {/* Macronutriments */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-1 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Glucides</p>
            <p className="font-medium">{food.glucides}g</p>
          </div>
          <div className="text-center p-1 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Protéines</p>
            <p className="font-medium">{food.proteines}g</p>
          </div>
          <div className="text-center p-1 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Lipides</p>
            <p className="font-medium">{food.lipides}g</p>
          </div>
        </div>
        
        {/* Badges des bienfaits santé */}
        <div className="flex flex-wrap gap-1 mt-3">
          {food.proprietes_sante.slice(0, 2).map(property => (
            <HealthBadge key={property} property={property} size="sm" />
          ))}
          {food.proprietes_sante.length > 2 && (
            <span className="text-xs text-muted-foreground">+{food.proprietes_sante.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
