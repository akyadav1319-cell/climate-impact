import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, DollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface FiscalAllocationWidgetProps {
  policies: {
    evAdoption: number;
    renewableEnergy: number;
    treePlantation: number;
    co2Reduction: number;
  };
  totalBudget: number;
}

const POLICY_COSTS = {
  evAdoption: 500,
  renewableEnergy: 600,
  treePlantation: 200,
  co2Reduction: 300,
};

const SECTOR_COLORS = {
  ev: '#0891B2', // Teal
  energy: '#C5A059', // Gold
  reforestation: '#7C3AED', // Indigo
  emissions: '#DB2777', // Rose
};

export function FiscalAllocationWidget({ policies, totalBudget }: FiscalAllocationWidgetProps) {
  // Calculate spending per sector
  const evSpend = (policies.evAdoption * POLICY_COSTS.evAdoption) / 1000;
  const energySpend = (policies.renewableEnergy * POLICY_COSTS.renewableEnergy) / 1000;
  const reforestationSpend = (policies.treePlantation * POLICY_COSTS.treePlantation) / 1000;
  const emissionsSpend = (policies.co2Reduction * POLICY_COSTS.co2Reduction) / 1000;

  const totalSpend = evSpend + energySpend + reforestationSpend + emissionsSpend;
  const allocationPercentage = (totalSpend / totalBudget) * 100;

  const data = [
    { 
      name: 'Electric Vehicle Programs', 
      value: evSpend, 
      color: SECTOR_COLORS.ev,
      percentage: totalSpend > 0 ? ((evSpend / totalSpend) * 100).toFixed(1) : 0
    },
    { 
      name: 'Renewable Energy Infrastructure', 
      value: energySpend, 
      color: SECTOR_COLORS.energy,
      percentage: totalSpend > 0 ? ((energySpend / totalSpend) * 100).toFixed(1) : 0
    },
    { 
      name: 'Reforestation & Conservation', 
      value: reforestationSpend, 
      color: SECTOR_COLORS.reforestation,
      percentage: totalSpend > 0 ? ((reforestationSpend / totalSpend) * 100).toFixed(1) : 0
    },
    { 
      name: 'Emission Reduction Tax Credits', 
      value: emissionsSpend, 
      color: SECTOR_COLORS.emissions,
      percentage: totalSpend > 0 ? ((emissionsSpend / totalSpend) * 100).toFixed(1) : 0
    },
  ].filter(item => item.value > 0);

  const CustomLegend = () => (
    <div className="space-y-2">
      {data.map((entry, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/30 transition-colors border-b border-border last:border-0"
        >
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="size-4 rounded-sm flex-shrink-0 border border-border" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs font-semibold text-foreground leading-tight">
              {entry.name}
            </span>
          </div>
          <div className="flex flex-col items-end ml-4">
            <span className="text-sm font-bold text-foreground whitespace-nowrap">
              ${entry.value.toFixed(2)}B
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {entry.percentage}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader className="bg-primary/5 border-b-2 border-primary pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" strokeWidth={2.5} />
            <CardTitle className="text-sm uppercase tracking-wide font-bold">
              Fiscal Allocation Breakdown
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="size-5 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
                  <Info className="size-3 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs leading-relaxed">
                  Real-time analysis of national budget distribution across primary climate policy sectors. 
                  Data aggregated from Treasury Department allocations.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          National Climate Budget Distribution by Sector
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {totalSpend > 0 ? (
          <div className="grid grid-cols-5 gap-6">
            {/* Donut Chart */}
            <div className="col-span-3 relative">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #0A192F',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '8px 12px',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}B`, 'Allocated']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary" style={{ lineHeight: 1 }}>
                    {allocationPercentage.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                    Allocated
                  </div>
                  <div className="text-sm font-bold text-foreground mt-2">
                    ${totalSpend.toFixed(2)}B
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    of ${totalBudget}B Total
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="col-span-2 flex flex-col">
              <div className="mb-4 pb-3 border-b-2 border-border">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                  Sector Breakdown
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Budget allocation by category
                </p>
              </div>
              <CustomLegend />
              
              {/* Summary Stats */}
              <div className="mt-auto pt-4 border-t-2 border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Active Sectors:</span>
                  <span className="font-bold text-foreground">{data.length}/4</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Remaining Budget:</span>
                  <span className={`font-bold ${totalBudget - totalSpend < 0 ? 'text-destructive' : 'text-success'}`}>
                    ${(totalBudget - totalSpend).toFixed(2)}B
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[280px] flex flex-col items-center justify-center text-center">
            <DollarSign className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No Budget Allocation</p>
            <p className="text-xs text-muted-foreground mt-1">Configure policy parameters to view distribution</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
