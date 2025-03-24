
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export type NutrientMode = 'macro' | 'micro';

interface NutrientModeSwitchProps {
  mode: NutrientMode;
  onChange: (mode: NutrientMode) => void;
  className?: string;
}

const NutrientsModeSwitch: React.FC<NutrientModeSwitchProps> = ({
  mode,
  onChange,
  className = '',
}) => {
  const handleToggle = () => {
    onChange(mode === 'macro' ? 'micro' : 'macro');
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex flex-col space-y-1 items-center">
        <Label htmlFor="nutrient-mode" className="text-xs font-medium mb-1">
          Mode d'affichage:
        </Label>
        <div className="flex items-center justify-between space-x-2 px-2 py-1 bg-gray-100 rounded-full">
          <span className={`text-xs py-1 px-3 rounded-full transition-colors ${mode === 'macro' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
            Macro
          </span>
          <Switch
            id="nutrient-mode"
            checked={mode === 'micro'}
            onCheckedChange={handleToggle}
          />
          <span className={`text-xs py-1 px-3 rounded-full transition-colors ${mode === 'micro' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>
            Micro
          </span>
        </div>
      </div>
    </div>
  );
};

export default NutrientsModeSwitch;
