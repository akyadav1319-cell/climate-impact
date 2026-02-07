import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Card, CardContent } from './ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  tooltip?: string;
  suffix?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  tooltip,
  suffix,
  className = '',
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`transition-all hover:shadow-lg cursor-default ${className}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{title}</p>
                  <motion.div
                    className="text-3xl font-semibold text-foreground mb-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {value}
                    {suffix && <span className="text-xl ml-1">{suffix}</span>}
                  </motion.div>
                  {change && (
                    <p className={`text-sm ${changeColors[changeType]}`}>
                      {change}
                    </p>
                  )}
                </div>
                {Icon && (
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
