import { useState } from 'react';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface PolicyLeverProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  category?: 'critical' | 'standard' | 'optional';
}

export function PolicyLever({
  label,
  value,
  onChange,
  tooltip = '',
  unit = '%',
  min = 0,
  max = 100,
  step = 1,
  category = 'standard',
}: PolicyLeverProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const numVal = Number(val);
    if (!isNaN(numVal) && numVal >= min && numVal <= max) {
      onChange(numVal);
    }
  };

  const handleInputBlur = () => {
    const numVal = Number(inputValue);
    if (isNaN(numVal) || numVal < min || numVal > max) {
      setInputValue(value.toString());
    }
  };

  const getStatusColor = () => {
    if (value >= 70) return 'text-success';
    if (value >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusIcon = () => {
    if (value >= 70) return <TrendingUp className="size-3 text-success" />;
    if (value >= 40) return <Info className="size-3 text-warning" />;
    return <AlertTriangle className="size-3 text-destructive" />;
  };

  return (
    <div className="space-y-2 p-4 border border-border rounded bg-card/50 hover:bg-card transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {label}
          </span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="size-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className="w-16 px-2 py-1 text-right text-sm font-bold bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground font-semibold">{unit}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-muted rounded appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, #0A192F 0%, #0A192F ${value}%, #E2E8F0 ${value}%, #E2E8F0 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Min: {min}{unit}</span>
          <span className={getStatusColor()}>
            {value >= 70 ? 'HIGH IMPACT' : value >= 40 ? 'MODERATE' : 'LOW IMPACT'}
          </span>
          <span>Max: {max}{unit}</span>
        </div>
      </div>

      {category === 'critical' && value < 50 && (
        <div className="mt-2 px-2 py-1 bg-warning/10 border border-warning rounded">
          <p className="text-xs text-warning font-semibold">⚠ Critical policy below threshold</p>
        </div>
      )}
    </div>
  );
}
