import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, TrendingUp, DollarSign } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface CostBenefitWidgetProps {
  policies: {
    evAdoption: number;
    renewableEnergy: number;
    treePlantation: number;
    co2Reduction: number;
  };
}

const POLICY_COSTS = {
  evAdoption: 500,
  renewableEnergy: 600,
  treePlantation: 200,
  co2Reduction: 300,
};

// Carbon reduction efficiency factors (MtCO2 per billion dollars)
const CARBON_EFFICIENCY = {
  evAdoption: 85, // High efficiency
  renewableEnergy: 120, // Highest efficiency
  treePlantation: 65, // Moderate efficiency
  co2Reduction: 95, // High efficiency
};

export function CostBenefitWidget({ policies }: CostBenefitWidgetProps) {
  // Calculate costs and carbon reduction
  const evCost = (policies.evAdoption * POLICY_COSTS.evAdoption) / 1000;
  const energyCost = (policies.renewableEnergy * POLICY_COSTS.renewableEnergy) / 1000;
  const reforestationCost = (policies.treePlantation * POLICY_COSTS.treePlantation) / 1000;
  const emissionsCost = (policies.co2Reduction * POLICY_COSTS.co2Reduction) / 1000;

  // Calculate carbon reduction potential (MtCO2)
  const evReduction = evCost * CARBON_EFFICIENCY.evAdoption;
  const energyReduction = energyCost * CARBON_EFFICIENCY.renewableEnergy;
  const reforestationReduction = reforestationCost * CARBON_EFFICIENCY.treePlantation;
  const emissionsReduction = emissionsCost * CARBON_EFFICIENCY.co2Reduction;

  const data = [
    {
      category: 'Electric Vehicles',
      categoryShort: 'EV Programs',
      cost: Number(evCost.toFixed(2)),
      carbonReduction: Number(evReduction.toFixed(1)),
      efficiency: evCost > 0 ? Number((evReduction / evCost).toFixed(1)) : 0,
    },
    {
      category: 'Renewable Energy',
      categoryShort: 'Clean Energy',
      cost: Number(energyCost.toFixed(2)),
      carbonReduction: Number(energyReduction.toFixed(1)),
      efficiency: energyCost > 0 ? Number((energyReduction / energyCost).toFixed(1)) : 0,
    },
    {
      category: 'Reforestation',
      categoryShort: 'Conservation',
      cost: Number(reforestationCost.toFixed(2)),
      carbonReduction: Number(reforestationReduction.toFixed(1)),
      efficiency: reforestationCost > 0 ? Number((reforestationReduction / reforestationCost).toFixed(1)) : 0,
    },
    {
      category: 'Tax Credits',
      categoryShort: 'Emission Tax',
      cost: Number(emissionsCost.toFixed(2)),
      carbonReduction: Number(emissionsReduction.toFixed(1)),
      efficiency: emissionsCost > 0 ? Number((emissionsReduction / emissionsCost).toFixed(1)) : 0,
    },
  ];

  const hasData = data.some(item => item.cost > 0);

  const maxCost = Math.max(...data.map(d => d.cost), 1);
  const maxReduction = Math.max(...data.map(d => d.carbonReduction), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-primary rounded p-3 shadow-lg">
          <p className="font-bold text-xs text-primary uppercase mb-2">{data.category}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground font-semibold">Economic Cost:</span>
              <span className="text-xs font-bold text-secondary">${data.cost}B</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground font-semibold">Carbon Reduction:</span>
              <span className="text-xs font-bold text-success">{data.carbonReduction} MtCO₂</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground font-semibold">Efficiency:</span>
              <span className="text-xs font-bold text-primary">{data.efficiency} MtCO₂/$B</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 border-border shadow-lg">
      <CardHeader className="bg-primary/5 border-b-2 border-primary pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" strokeWidth={2.5} />
            <CardTitle className="text-sm uppercase tracking-wide font-bold">
              Cost-Benefit Efficiency Index
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
                  Comparative analysis measuring economic investment versus projected carbon emission 
                  reduction potential. Data sourced from EPA Climate Impact Models and Treasury projections.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          Economic Cost vs. Carbon Reduction Potential by Policy Sector
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {hasData ? (
          <div className="space-y-6">
            {/* Dual-Axis Chart */}
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart 
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#CBD5E1" 
                  strokeWidth={1}
                  vertical={false}
                />
                <XAxis 
                  dataKey="categoryShort" 
                  stroke="#0A192F"
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                  tickLine={{ stroke: '#475569' }}
                  angle={0}
                  textAnchor="middle"
                  height={60}
                />
                
                {/* Left Y-Axis for Cost */}
                <YAxis 
                  yAxisId="left"
                  stroke="#475569"
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{ 
                    value: 'Economic Cost ($ Billion)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { 
                      fill: '#475569', 
                      fontSize: 11, 
                      fontWeight: 700,
                      textAnchor: 'middle'
                    }
                  }}
                  domain={[0, maxCost * 1.1]}
                />
                
                {/* Right Y-Axis for Carbon Reduction */}
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#047857"
                  tick={{ fill: '#047857', fontSize: 11, fontWeight: 600 }}
                  tickLine={{ stroke: '#047857' }}
                  label={{ 
                    value: 'Carbon Reduction (MtCO₂)', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { 
                      fill: '#047857', 
                      fontSize: 11, 
                      fontWeight: 700,
                      textAnchor: 'middle'
                    }
                  }}
                  domain={[0, maxReduction * 1.1]}
                />
                
                <RechartsTooltip content={<CustomTooltip />} />
                
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '11px', 
                    fontWeight: 600,
                    paddingTop: '20px'
                  }}
                  iconType="rect"
                />
                
                {/* Cost Bars */}
                <Bar 
                  yAxisId="left"
                  dataKey="cost" 
                  fill="#475569" 
                  name="Economic Cost ($B)"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
                
                {/* Carbon Reduction Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="carbonReduction"
                  stroke="#047857"
                  strokeWidth={3}
                  name="Carbon Reduction (MtCO₂)"
                  dot={{ 
                    fill: '#047857', 
                    r: 6,
                    strokeWidth: 2,
                    stroke: '#ffffff'
                  }}
                  activeDot={{ r: 8 }}
                />
              </ComposedChart>
            </ResponsiveContainer>

            {/* Efficiency Analysis Table */}
            <div className="border-t-2 border-border pt-4">
              <div className="mb-3 pb-2 border-b border-border">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wide">
                  Cost-Effectiveness Rankings
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                  Carbon reduction per billion dollars invested (MtCO₂/$B)
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {data
                  .filter(item => item.cost > 0)
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .map((item, index) => {
                    const rank = index + 1;
                    const isTopRank = rank === 1;
                    const medalColor = rank === 1 ? 'text-warning' : rank === 2 ? 'text-secondary' : 'text-muted-foreground';
                    
                    return (
                      <div 
                        key={item.category}
                        className={`p-3 rounded border-2 ${
                          isTopRank 
                            ? 'border-warning bg-warning/5' 
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`text-lg font-bold ${medalColor}`}>
                            #{rank}
                          </div>
                          <div className="text-[10px] font-bold text-primary uppercase leading-tight">
                            {item.categoryShort}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                              Efficiency:
                            </span>
                            <span className={`text-xs font-bold ${isTopRank ? 'text-success' : 'text-foreground'}`}>
                              {item.efficiency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                              Cost:
                            </span>
                            <span className="text-[10px] font-bold text-secondary">
                              ${item.cost}B
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                              Impact:
                            </span>
                            <span className="text-[10px] font-bold text-success">
                              {item.carbonReduction} Mt
                            </span>
                          </div>
                        </div>
                        
                        {isTopRank && (
                          <div className="mt-2 pt-2 border-t border-warning/30">
                            <p className="text-[9px] text-warning font-bold uppercase text-center">
                              Most Efficient
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Summary Insights */}
              <div className="mt-4 p-3 bg-primary/5 rounded border border-primary/30">
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-wide mb-2">
                  Strategic Insights
                </h5>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <span className="text-muted-foreground font-semibold">Total Investment:</span>
                    <span className="ml-2 font-bold text-foreground">
                      ${data.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}B
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold">Total Reduction:</span>
                    <span className="ml-2 font-bold text-success">
                      {data.reduce((sum, item) => sum + item.carbonReduction, 0).toFixed(1)} MtCO₂
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold">Portfolio Efficiency:</span>
                    <span className="ml-2 font-bold text-primary">
                      {data.reduce((sum, item) => sum + item.cost, 0) > 0 
                        ? (data.reduce((sum, item) => sum + item.carbonReduction, 0) / 
                           data.reduce((sum, item) => sum + item.cost, 0)).toFixed(1)
                        : 0} MtCO₂/$B
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold">Active Policies:</span>
                    <span className="ml-2 font-bold text-foreground">
                      {data.filter(item => item.cost > 0).length}/4 Sectors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[340px] flex flex-col items-center justify-center text-center">
            <TrendingUp className="size-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No Cost-Benefit Data</p>
            <p className="text-xs text-muted-foreground mt-1">Configure policy parameters to analyze efficiency</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
