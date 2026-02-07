import { useState, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { DashboardLayout } from '../components/DashboardLayout';
import { MetricCard } from '../components/MetricCard';
import { PolicyLever } from '../components/PolicyLever';
import { FiscalAllocationWidget } from '../components/FiscalAllocationWidget';
import { CostBenefitWidget } from '../components/CostBenefitWidget';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import {
  TrendingDown,
  TrendingUp,
  Leaf,
  Zap,
  Car,
  DollarSign,
  Users,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  Calendar,
  FileText,
  Upload,
  Image as ImageIcon,
  Shield,
  BarChart3,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const POLICY_COSTS = {
  evAdoption: 500,
  co2Reduction: 300,
  treePlantation: 200,
  renewableEnergy: 600,
  publicTransport: 400,
  industrialControls: 350,
  greenBuilding: 250,
  wasteManagement: 150,
};

const CHART_COLORS = {
  primary: '#3B82F6', // Steel Blue
  success: '#047857', // Emerald Green
  destructive: '#B91C1C', // Deep Red
  warning: '#C5A059', // Gold
  secondary: '#475569', // Slate Gray
  purple: '#7C3AED',
  cyan: '#0891B2',
};

type TimelineDuration = 'short' | 'mid' | 'long';

export function DashboardPage2() {
  const { policies, setPolicies, chartData, setChartData, setIsGenerated } = useSimulation();
  const [isRunning, setIsRunning] = useState(false);
  const [timelineDuration, setTimelineDuration] = useState<TimelineDuration>('mid');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [totalBudget, setTotalBudget] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateSpentBudget = () => {
    let total = 0;
    Object.entries(policies).forEach(([key, value]) => {
      total += (value * POLICY_COSTS[key as keyof typeof POLICY_COSTS]) / 1000;
    });
    return total;
  };

  const spentBudget = calculateSpentBudget();
  const remainingBudget = totalBudget - spentBudget;
  const budgetPercentage = (spentBudget / totalBudget) * 100;

  const handlePolicyChange = (policy: keyof typeof policies, value: number) => {
    setPolicies({ ...policies, [policy]: value });
  };

  const handleRun = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const years = ['2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036'];
      const data = years.map((year, index) => {
        const growthFactor = index / 10;
        return {
          year,
          co2Emissions: Math.max(100 - (policies.co2Reduction * growthFactor * 0.9), 10),
          airQuality: 50 + (policies.co2Reduction + policies.evAdoption + policies.treePlantation) / 3 * growthFactor * 0.6,
          evAdoption: policies.evAdoption * growthFactor,
          renewableEnergy: policies.renewableEnergy * growthFactor,
          treeCover: 30 + (policies.treePlantation * growthFactor * 0.8),
          publicTransportUsage: 25 + (policies.publicTransport * growthFactor * 0.7),
          greenJobs: (spentBudget * 2.5 * growthFactor) * 10,
          temperature: 1.5 - (Object.values(policies).reduce((a, b) => a + b, 0) / 800 * growthFactor * 0.4),
        };
      });
      setChartData(data);
      setIsGenerated(true);
      setIsRunning(false);
    }, 2000);
  };

  const handleReset = () => {
    setPolicies({
      evAdoption: 0,
      co2Reduction: 0,
      treePlantation: 0,
      renewableEnergy: 0,
      publicTransport: 0,
      industrialControls: 0,
      greenBuilding: 0,
      wasteManagement: 0,
    });
  };

  const handleExport = () => {
    const data = {
      policies,
      chartData,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-simulation-${Date.now()}.json`;
    a.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentMetrics = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const totalPolicyStrength = Object.values(policies).reduce((a, b) => a + b, 0) / 8;

  const policyDistribution = [
    { name: 'EV Adoption', value: policies.evAdoption, color: CHART_COLORS.primary },
    { name: 'CO₂ Reduction', value: policies.co2Reduction, color: CHART_COLORS.success },
    { name: 'Tree Plantation', value: policies.treePlantation, color: CHART_COLORS.warning },
    { name: 'Renewable Energy', value: policies.renewableEnergy, color: CHART_COLORS.purple },
    { name: 'Public Transport', value: policies.publicTransport, color: CHART_COLORS.cyan },
    { name: 'Industrial Controls', value: policies.industrialControls, color: CHART_COLORS.secondary },
    { name: 'Green Building', value: policies.greenBuilding, color: '#10b981' },
    { name: 'Waste Management', value: policies.wasteManagement, color: '#06b6d4' },
  ].filter(item => item.value > 0);

  const getTimelineInfo = () => {
    switch (timelineDuration) {
      case 'short':
        return { label: '1 Year', description: 'Immediate policy effects', years: 1 };
      case 'mid':
        return { label: '5 Years', description: 'Infrastructure development phase', years: 5 };
      case 'long':
        return { label: '10 Years', description: 'Long-term ecological transformation', years: 10 };
    }
  };

  const timelineInfo = getTimelineInfo();

  const sidebar = (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b-2 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Policy Control Center</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Adjust implementation parameters for national climate policy simulation
        </p>
      </div>

      {/* Budget Configuration */}
      <Card className="border-2 border-primary shadow-md">
        <CardHeader className="pb-3 bg-primary/5">
          <div className="flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            <CardTitle className="text-sm uppercase tracking-wide">Budget Allocation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Total Available Budget</label>
              <Badge variant="default" className="bg-primary">
                ${totalBudget}B USD
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="flex-1 h-2 bg-muted rounded appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, #0A192F 0%, #0A192F ${(totalBudget / 500) * 100}%, #E2E8F0 ${(totalBudget / 500) * 100}%, #E2E8F0 100%)`,
                }}
              />
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                min="10"
                max="500"
                step="10"
                className="w-20 px-2 py-1 text-right text-sm font-bold bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="border-t-2 border-border pt-3 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Allocated:</span>
              <span className="font-bold text-foreground">${spentBudget.toFixed(2)}B</span>
            </div>
            <Progress 
              value={Math.min(budgetPercentage, 100)} 
              className="h-3 bg-muted"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-semibold">Remaining:</span>
              <span className={`font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-success'}`}>
                ${remainingBudget.toFixed(2)}B
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Utilization Rate:</span>
              <span className="font-semibold">{budgetPercentage.toFixed(1)}%</span>
            </div>
          </div>
          
          {remainingBudget < 0 && (
            <div className="flex items-start gap-2 text-xs bg-warning/10 border-l-4 border-warning p-3 rounded">
              <AlertCircle className="size-4 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-warning">BUDGET EXCEEDED</p>
                <p className="text-warning/80">Reduce policy levels or increase total budget allocation</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policy Implementation Levers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <BarChart3 className="size-4 text-primary" />
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide">
            Policy Implementation Levers
          </h3>
        </div>
        
        <PolicyLever
          label="EV Adoption Rate"
          value={policies.evAdoption}
          onChange={(v) => handlePolicyChange('evAdoption', v)}
          tooltip="Electric vehicle adoption incentives and infrastructure development programs"
          category="critical"
        />

        <PolicyLever
          label="CO₂ Emission Targets"
          value={policies.co2Reduction}
          onChange={(v) => handlePolicyChange('co2Reduction', v)}
          tooltip="Carbon pricing mechanisms and industrial emission reduction mandates"
          category="critical"
        />

        <PolicyLever
          label="Reforestation Programs"
          value={policies.treePlantation}
          onChange={(v) => handlePolicyChange('treePlantation', v)}
          tooltip="Large-scale tree plantation and urban greening initiatives"
          category="standard"
        />

        <PolicyLever
          label="Renewable Energy"
          value={policies.renewableEnergy}
          onChange={(v) => handlePolicyChange('renewableEnergy', v)}
          tooltip="Solar, wind, and hydroelectric power infrastructure investment"
          category="critical"
        />

        <PolicyLever
          label="Public Transport"
          value={policies.publicTransport}
          onChange={(v) => handlePolicyChange('publicTransport', v)}
          tooltip="Mass transit expansion and modernization programs"
          category="standard"
        />

        <PolicyLever
          label="Industrial Controls"
          value={policies.industrialControls}
          onChange={(v) => handlePolicyChange('industrialControls', v)}
          tooltip="Environmental compliance standards for manufacturing sectors"
          category="standard"
        />

        <PolicyLever
          label="Green Building Standards"
          value={policies.greenBuilding}
          onChange={(v) => handlePolicyChange('greenBuilding', v)}
          tooltip="Energy-efficient construction codes and retrofit requirements"
          category="optional"
        />

        <PolicyLever
          label="Waste Management"
          value={policies.wasteManagement}
          onChange={(v) => handlePolicyChange('wasteManagement', v)}
          tooltip="Recycling programs and landfill reduction strategies"
          category="optional"
        />
      </div>

      {/* Quick Deployment Scenarios */}
      <Card className="border border-secondary">
        <CardHeader className="p-4 bg-secondary/5">
          <CardTitle className="text-xs uppercase tracking-wide">Deployment Presets</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <button
            onClick={() => {
              setPolicies({
                evAdoption: 40,
                co2Reduction: 50,
                treePlantation: 30,
                renewableEnergy: 60,
                publicTransport: 35,
                industrialControls: 45,
                greenBuilding: 25,
                wasteManagement: 20,
              });
            }}
            className="w-full p-3 text-left text-sm rounded border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="font-bold text-primary">MODERATE DEPLOYMENT</div>
            <div className="text-xs text-muted-foreground">Balanced implementation across all sectors</div>
          </button>
          <button
            onClick={() => {
              setPolicies({
                evAdoption: 80,
                co2Reduction: 90,
                treePlantation: 70,
                renewableEnergy: 95,
                publicTransport: 75,
                industrialControls: 85,
                greenBuilding: 60,
                wasteManagement: 50,
              });
            }}
            className="w-full p-3 text-left text-sm rounded border-2 border-success/30 hover:border-success hover:bg-success/5 transition-all"
          >
            <div className="font-bold text-success">AGGRESSIVE DEPLOYMENT</div>
            <div className="text-xs text-muted-foreground">Maximum impact policy configuration</div>
          </button>
        </CardContent>
      </Card>
    </div>
  );

  const rightPanel = (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b-2 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-primary uppercase tracking-wide">Performance Metrics</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time impact assessment and key indicators
        </p>
      </div>

      <MetricCard
        title="Budget Utilization"
        value={budgetPercentage.toFixed(1)}
        suffix="%"
        change={remainingBudget < 0 ? `Over by $${Math.abs(remainingBudget).toFixed(1)}B` : `$${remainingBudget.toFixed(1)}B available`}
        changeType={remainingBudget < 0 ? 'negative' : 'positive'}
        icon={DollarSign}
        tooltip={`Allocated: $${spentBudget.toFixed(1)}B of $${totalBudget}B total budget`}
      />

      <MetricCard
        title="Policy Implementation Index"
        value={totalPolicyStrength.toFixed(1)}
        suffix="%"
        change={totalPolicyStrength > 60 ? 'High Impact Configuration' : totalPolicyStrength > 30 ? 'Moderate Configuration' : 'Low Impact Configuration'}
        changeType={totalPolicyStrength > 60 ? 'positive' : totalPolicyStrength > 30 ? 'neutral' : 'negative'}
        icon={Target}
        tooltip="Aggregate policy strength across all implementation areas"
      />

      {currentMetrics && (
        <>
          <MetricCard
            title="Emissions Reduction"
            value={`-${(100 - currentMetrics.co2Emissions).toFixed(1)}`}
            suffix="%"
            change="vs. 2026 baseline"
            changeType="positive"
            icon={TrendingDown}
            tooltip="Projected carbon emission reduction by target year"
          />

          <MetricCard
            title="Air Quality Index"
            value={currentMetrics.airQuality.toFixed(0)}
            change={`+${(currentMetrics.airQuality - 50).toFixed(0)} points improvement`}
            changeType="positive"
            icon={Activity}
            tooltip="National air quality composite score"
          />

          <MetricCard
            title="Green Economy Jobs"
            value={(currentMetrics.greenJobs / 1000).toFixed(1)}
            suffix="M"
            change="in renewable sectors"
            changeType="positive"
            icon={Users}
            tooltip="Employment in clean energy and sustainability sectors"
          />

          <MetricCard
            title="Temperature Projection"
            value={currentMetrics.temperature.toFixed(2)}
            suffix="°C"
            change={currentMetrics.temperature < 1.5 ? 'Within Paris Target' : 'Exceeds Target'}
            changeType={currentMetrics.temperature < 1.5 ? 'positive' : 'negative'}
            icon={TrendingUp}
            tooltip="Projected global temperature increase contribution"
          />
        </>
      )}

      {/* Policy Distribution Chart */}
      <Card className="border-2 border-border">
        <CardHeader className="p-4 bg-muted/30">
          <CardTitle className="text-sm uppercase tracking-wide">Policy Resource Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          {policyDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={policyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {policyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {policyDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs border-b border-border pb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              No active policy configurations
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="border-2 border-border">
        <CardHeader className="p-4 bg-muted/30">
          <CardTitle className="text-sm uppercase tracking-wide">System Status</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground">Simulation State:</span>
            {chartData.length > 0 ? (
              <Badge variant="default" className="bg-success">
                <CheckCircle2 className="size-3 mr-1" />
                COMPLETE
              </Badge>
            ) : (
              <Badge variant="outline">
                <Clock className="size-3 mr-1" />
                STANDBY
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground">Budget Status:</span>
            {remainingBudget >= 0 ? (
              <Badge variant="default" className="bg-success">
                <CheckCircle2 className="size-3 mr-1" />
                COMPLIANT
              </Badge>
            ) : (
              <Badge variant="default" className="bg-warning text-warning-foreground">
                <AlertCircle className="size-3 mr-1" />
                REVIEW REQUIRED
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-muted-foreground">Clearance Level:</span>
            <Badge variant="default" className="bg-primary">
              <Shield className="size-3 mr-1" />
              AUTHORIZED
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout
      sidebar={sidebar}
      rightPanel={rightPanel}
      onRun={handleRun}
      onReset={handleReset}
      onExport={handleExport}
      isRunning={isRunning}
    >
      <div className="space-y-6">
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 h-auto">
            <TabsTrigger 
              value="timeline" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold uppercase text-xs py-3"
            >
              <Calendar className="size-4" />
              Impact Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="emissions" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold uppercase text-xs py-3"
            >
              <BarChart3 className="size-4" />
              Analytics Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="urban-analysis" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold uppercase text-xs py-3"
            >
              <ImageIcon className="size-4" />
              Urban Impact Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="briefing" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white font-semibold uppercase text-xs py-3"
            >
              <FileText className="size-4" />
              Strategic Briefing
            </TabsTrigger>
          </TabsList>

          {/* Impact Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6 mt-6">
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="bg-primary/5 border-b-2 border-primary">
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-primary" />
                  <CardTitle className="uppercase tracking-wide">Policy Implementation Timeline</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Projected impact milestones across deployment horizons
                </p>
              </CardHeader>
              <CardContent className="p-8">
                {/* Timeline Duration Selector */}
                <div className="mb-8">
                  <label className="text-xs font-bold text-primary uppercase tracking-wide mb-3 block">
                    Select Analysis Window
                  </label>
                  <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
                    <button
                      onClick={() => setTimelineDuration('short')}
                      className={`p-4 rounded border-2 font-semibold transition-all ${
                        timelineDuration === 'short'
                          ? 'bg-primary border-primary text-white shadow-lg'
                          : 'border-border text-foreground hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold">SHORT TERM</div>
                        <div className="text-xs opacity-80 mt-1">1 Year Impact Window</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setTimelineDuration('mid')}
                      className={`p-4 rounded border-2 font-semibold transition-all ${
                        timelineDuration === 'mid'
                          ? 'bg-primary border-primary text-white shadow-lg'
                          : 'border-border text-foreground hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold">MID TERM</div>
                        <div className="text-xs opacity-80 mt-1">5 Year Infrastructure Phase</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setTimelineDuration('long')}
                      className={`p-4 rounded border-2 font-semibold transition-all ${
                        timelineDuration === 'long'
                          ? 'bg-primary border-primary text-white shadow-lg'
                          : 'border-border text-foreground hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold">LONG TERM</div>
                        <div className="text-xs opacity-80 mt-1">10 Year Transformation</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Timeline Milestones */}
                <div className="grid grid-cols-3 gap-4 mt-12">
                  {timelineDuration === 'short' && (
                    <>
                      <Card className="border-2 border-primary/50 bg-primary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Car className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2" variant="default">IMMEDIATE</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">EV Policy Deployment</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.evAdoption > 50 
                                  ? 'Rapid subsidy deployment and charging infrastructure rollout across major metropolitan areas' 
                                  : policies.evAdoption > 20
                                  ? 'Phased EV incentive programs initiated in priority urban centers'
                                  : 'Limited pilot programs for electric vehicle adoption'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-success/50 bg-success/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-success/20 flex items-center justify-center flex-shrink-0">
                              <Leaf className="size-6 text-success" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-success">IMMEDIATE</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Urban Greening Launch</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.treePlantation > 50
                                  ? '10M+ trees planted in urban corridors with community engagement programs'
                                  : policies.treePlantation > 20
                                  ? '2M trees deployed through municipal greening initiatives'
                                  : 'Small-scale tree planting in select urban districts'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-secondary/50 bg-secondary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-secondary/20 flex items-center justify-center flex-shrink-0">
                              <Activity className="size-6 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-secondary">IMMEDIATE</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Monitoring Systems</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Advanced air quality monitoring network deployed, showing early improvements in industrial zones
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {timelineDuration === 'mid' && (
                    <>
                      <Card className="border-2 border-primary/50 bg-primary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Zap className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2" variant="default">5 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Renewable Infrastructure</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.renewableEnergy > 60
                                  ? 'Major solar and wind installations operational, grid modernization complete nationwide'
                                  : policies.renewableEnergy > 30
                                  ? 'Regional renewable energy projects integrated into power grid infrastructure'
                                  : 'Early-stage renewable installations in pilot regions'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-success/50 bg-success/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-success/20 flex items-center justify-center flex-shrink-0">
                              <Car className="size-6 text-success" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-success">5 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">EV Market Shift</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.evAdoption > 60
                                  ? 'Electric vehicles achieve 40% market penetration, infrastructure fully deployed'
                                  : policies.evAdoption > 30
                                  ? 'EVs reach 20% market share with expanding charging network'
                                  : 'Gradual EV adoption with limited infrastructure coverage'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-secondary/50 bg-secondary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-secondary/20 flex items-center justify-center flex-shrink-0">
                              <Users className="size-6 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-secondary">5 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Workforce Transition</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {spentBudget > 60
                                  ? '500K+ jobs created in renewable energy and clean technology sectors'
                                  : spentBudget > 30
                                  ? '200K new positions in emerging green economy industries'
                                  : 'Moderate employment growth in sustainability sectors'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {timelineDuration === 'long' && (
                    <>
                      <Card className="border-2 border-success/50 bg-success/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-success/20 flex items-center justify-center flex-shrink-0">
                              <Leaf className="size-6 text-success" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-success">10 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Ecosystem Recovery</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.treePlantation > 60
                                  ? 'Green cover expanded 15%, carbon sequestration capacity doubled, biodiversity restored'
                                  : policies.treePlantation > 30
                                  ? 'Green cover increased 8% with measurable climate stabilization benefits'
                                  : 'Gradual forest restoration showing early ecological improvements'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-primary/50 bg-primary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Target className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2" variant="default">10 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Climate Objectives</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {totalPolicyStrength > 70
                                  ? 'Paris Agreement targets achieved, on trajectory for net-zero carbon emissions'
                                  : totalPolicyStrength > 40
                                  ? 'Substantial progress toward international climate commitments'
                                  : 'Additional policy measures required to meet climate obligations'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-secondary/50 bg-secondary/5">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="size-12 rounded bg-secondary/20 flex items-center justify-center flex-shrink-0">
                              <Activity className="size-6 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <Badge className="mb-2 bg-secondary">10 YEAR</Badge>
                              <h4 className="font-bold text-sm mb-2 uppercase">Environmental Quality</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {policies.co2Reduction > 70 && policies.treePlantation > 60
                                  ? 'Air quality at historic highs, biodiversity metrics showing significant recovery'
                                  : policies.co2Reduction > 40
                                  ? 'Measurable ecosystem improvements, air quality standards exceeded'
                                  : 'Environmental stabilization in progress, continued monitoring required'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Timeline Chart */}
                {chartData.length > 0 && (
                  <div className="mt-10">
                    <Card className="border-2 border-border">
                      <CardHeader className="bg-muted/30">
                        <CardTitle className="text-sm uppercase tracking-wide">
                          {timelineInfo.label} Projection Model
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{timelineInfo.description}</p>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={chartData.slice(0, timelineInfo.years + 1)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                            <XAxis 
                              dataKey="year" 
                              stroke="#64748b"
                              style={{ fontSize: '12px', fontWeight: 600 }}
                            />
                            <YAxis 
                              stroke="#64748b"
                              style={{ fontSize: '12px', fontWeight: 600 }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '2px solid #0A192F',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="co2Emissions"
                              stroke={CHART_COLORS.destructive}
                              strokeWidth={3}
                              name="CO₂ Emissions Index"
                              dot={{ fill: CHART_COLORS.destructive, r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="airQuality"
                              stroke={CHART_COLORS.success}
                              strokeWidth={3}
                              name="Air Quality Index"
                              dot={{ fill: CHART_COLORS.success, r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="treeCover"
                              stroke={CHART_COLORS.primary}
                              strokeWidth={3}
                              name="Green Cover %"
                              dot={{ fill: CHART_COLORS.primary, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Dashboard Tab */}
          <TabsContent value="emissions" className="space-y-6 mt-6">
            {chartData.length > 0 ? (
              <>
                <Card className="border-2 border-border shadow-lg">
                  <CardHeader className="bg-primary/5 border-b-2 border-primary">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-primary" />
                      <CardTitle className="uppercase tracking-wide">Emissions & Environmental Analytics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={450}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" strokeWidth={1.5} />
                        <XAxis 
                          dataKey="year" 
                          stroke="#0A192F"
                          style={{ fontSize: '14px', fontWeight: 600 }}
                        />
                        <YAxis 
                          stroke="#0A192F"
                          style={{ fontSize: '14px', fontWeight: 600 }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #0A192F',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '14px', fontWeight: 600 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="co2Emissions"
                          stroke={CHART_COLORS.destructive}
                          strokeWidth={4}
                          name="CO₂ Emissions"
                          dot={{ fill: CHART_COLORS.destructive, r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="airQuality"
                          stroke={CHART_COLORS.success}
                          strokeWidth={4}
                          name="Air Quality Index"
                          dot={{ fill: CHART_COLORS.success, r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <FiscalAllocationWidget 
                  policies={{
                    evAdoption: policies.evAdoption,
                    renewableEnergy: policies.renewableEnergy,
                    treePlantation: policies.treePlantation,
                    co2Reduction: policies.co2Reduction,
                  }}
                  totalBudget={totalBudget}
                />
                
                <CostBenefitWidget
                  policies={{
                    evAdoption: policies.evAdoption,
                    renewableEnergy: policies.renewableEnergy,
                    treePlantation: policies.treePlantation,
                    co2Reduction: policies.co2Reduction,
                  }}
                />
              </>
            ) : (
              <Card className="border-2 border-border">
                <CardContent className="py-32">
                  <div className="text-center">
                    <BarChart3 className="size-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground font-semibold">No simulation data available</p>
                    <p className="text-xs text-muted-foreground mt-2">Execute a simulation to view analytics</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Urban Impact Analysis Tab */}
          <TabsContent value="urban-analysis" className="space-y-6 mt-6">
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="bg-primary/5 border-b-2 border-primary">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-5 text-primary" />
                  <CardTitle className="uppercase tracking-wide">Urban Impact Comparison Analysis</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Visual assessment of environmental transformation under current policy configuration
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8">
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-primary uppercase tracking-wide">
                        CURRENT STATE UPLOAD
                      </label>
                      <Badge variant="outline">BASELINE</Badge>
                    </div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/5] rounded border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all relative overflow-hidden"
                    >
                      {uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Current state"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="size-20 rounded bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="size-10 text-primary" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2 uppercase">Upload Reference Image</h4>
                          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Upload current urban landscape photograph for impact comparison analysis
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadedImage && (
                      <Button
                        variant="outline"
                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => setUploadedImage(null)}
                      >
                        Clear Image
                      </Button>
                    )}
                  </div>

                  {/* Comparison Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-success uppercase tracking-wide">
                        PROJECTED IMPACT ({timelineInfo.years} YEARS)
                      </label>
                      <Badge variant="default" className="bg-success">SIMULATION</Badge>
                    </div>
                    <div className="aspect-[4/5] rounded border-2 border-primary bg-gradient-to-br from-primary/5 to-success/5 relative overflow-hidden">
                      {uploadedImage ? (
                        <div className="absolute inset-0">
                          {/* Before */}
                          <div
                            className="absolute inset-0"
                            style={{
                              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                            }}
                          >
                            <img
                              src={uploadedImage}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-destructive text-white px-3 py-1.5 rounded text-xs font-bold uppercase">
                              Current
                            </div>
                          </div>

                          {/* After */}
                          <div
                            className="absolute inset-0"
                            style={{
                              clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                            }}
                          >
                            <img
                              src={uploadedImage}
                              alt="After"
                              className="w-full h-full object-cover"
                              style={{
                                filter: `brightness(1.15) saturate(1.4) hue-rotate(${policies.treePlantation * 0.6}deg) contrast(1.05)`,
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-success/25 to-primary/20 mix-blend-overlay" />
                            <div className="absolute top-4 right-4 bg-success text-white px-3 py-1.5 rounded text-xs font-bold uppercase">
                              Projected
                            </div>
                          </div>

                          {/* Slider */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl cursor-ew-resize z-10"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-primary">
                              <div className="w-1 h-5 bg-primary rounded" />
                            </div>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={(e) => setSliderPosition(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                          <div className="size-20 rounded bg-primary/10 flex items-center justify-center mb-4">
                            <ImageIcon className="size-10 text-primary" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2 uppercase">Impact Visualization</h4>
                          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Upload baseline image to generate comparative environmental impact projection
                          </p>
                        </div>
                      )}
                    </div>

                    {uploadedImage && (
                      <Card className="border border-primary/30 bg-primary/5">
                        <CardContent className="p-4">
                          <h5 className="text-xs font-bold text-primary uppercase mb-3">Impact Metrics</h5>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between py-1.5 px-2 bg-white rounded">
                              <span className="font-semibold text-muted-foreground">Tree Coverage:</span>
                              <span className="font-bold text-success">+{policies.treePlantation}%</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 px-2 bg-white rounded">
                              <span className="font-semibold text-muted-foreground">Air Quality:</span>
                              <span className="font-bold text-success">+{policies.co2Reduction}%</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 px-2 bg-white rounded">
                              <span className="font-semibold text-muted-foreground">Clean Energy:</span>
                              <span className="font-bold text-success">+{policies.renewableEnergy}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="mt-8 p-5 bg-muted/50 rounded border-l-4 border-primary">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong className="font-bold">Analysis Methodology:</strong> The comparison tool applies visual enhancement algorithms based on configured policy parameters. Tree plantation levels influence vegetation density, CO₂ reduction affects atmospheric clarity, and renewable energy deployment impacts infrastructure visibility. Results represent projected environmental improvements over the {timelineInfo.label.toLowerCase()} analysis window.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strategic Briefing Tab */}
          <TabsContent value="briefing" className="space-y-6 mt-6">
            <Card className="border-2 border-border shadow-lg">
              <CardContent className="p-8">
                {/* Header */}
                <div className="border-b-4 border-primary pb-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Shield className="size-10 text-primary" strokeWidth={2} />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">CLASSIFIED</div>
                        <div className="text-sm text-primary font-bold uppercase tracking-wide">National Intelligence Briefing</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <Badge variant="default" className="mt-1 bg-warning text-warning-foreground">
                        PRIORITY: HIGH
                      </Badge>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-center uppercase border-t-2 border-b-2 border-primary py-3">
                    {timelineInfo.label} Policy Impact Assessment
                  </h1>
                  <p className="text-center text-sm text-muted-foreground mt-3 uppercase tracking-wide">
                    Strategic Analysis & Implementation Outlook
                  </p>
                </div>

                {/* Lead Assessment */}
                <div className="mb-10">
                  <div className="aspect-[21/9] rounded border-2 border-border bg-gradient-to-br from-primary/10 via-success/5 to-secondary/10 mb-6 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Shield className="size-16 text-primary/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-semibold">CLASSIFIED IMAGE PLACEHOLDER</p>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4 uppercase tracking-wide border-l-4 border-primary pl-4">
                    {timelineDuration === 'short' && (
                      policies.evAdoption > 50 || policies.co2Reduction > 50
                        ? 'Executive Action: Immediate Climate Measures Deployed'
                        : 'Policy Initiative: First Phase Climate Protocols Activated'
                    )}
                    {timelineDuration === 'mid' && (
                      policies.evAdoption > 60 && policies.renewableEnergy > 60
                        ? 'Mid-Term Assessment: Renewable Infrastructure Transformation Complete'
                        : policies.evAdoption > 40 || policies.renewableEnergy > 40
                        ? 'Five-Year Review: Climate Infrastructure Development On Track'
                        : 'Mid-Term Analysis: Policy Implementation Below Projected Targets'
                    )}
                    {timelineDuration === 'long' && (
                      policies.treePlantation > 70 && policies.co2Reduction > 70
                        ? 'Decade Assessment: Environmental Recovery Exceeds Projections'
                        : policies.treePlantation > 40 || policies.co2Reduction > 40
                        ? 'Long-Term Outlook: Significant Environmental Stabilization Achieved'
                        : 'Ten-Year Review: Climate Objectives Require Enhanced Measures'
                    )}
                  </h2>
                  
                  <p className="text-base leading-relaxed text-foreground mb-4 text-justify">
                    {timelineDuration === 'short' && (
                      policies.evAdoption > 50 || policies.co2Reduction > 50
                        ? `Intelligence reports confirm immediate deployment of comprehensive climate protocols. Initial assessment indicates ${policies.evAdoption}% commitment to electric vehicle infrastructure and ${policies.co2Reduction}% emission reduction targets are operational. Strategic analysis suggests strong governmental resolve for environmental transformation. Monitoring systems activated across all sectors.`
                        : `New climate policy framework has been initiated with ${policies.evAdoption}% focus on vehicle electrification and ${policies.co2Reduction}% emission control measures. Strategic advisors maintain cautious optimism regarding implementation effectiveness. Continued assessment required to validate policy impact across targeted sectors.`
                    )}
                    {timelineDuration === 'mid' && (
                      policies.renewableEnergy > 60 && policies.evAdoption > 60
                        ? `Five-year operational analysis confirms successful infrastructure transformation. Renewable energy integration has reached ${policies.renewableEnergy}% grid penetration, while electric vehicle adoption stands at ${policies.evAdoption}% market share. Strategic objectives are being met ahead of projected timelines. Energy sector has undergone fundamental restructuring consistent with national security and environmental mandates.`
                        : `Mid-term assessment reveals measured progress across implementation zones. Renewable energy deployment at ${policies.renewableEnergy}% and EV adoption at ${policies.evAdoption}% demonstrate steady advancement. Intelligence suggests acceleration of policy measures required to maintain trajectory toward 2050 carbon neutrality objectives. Strategic review recommended for underperforming sectors.`
                    )}
                    {timelineDuration === 'long' && (
                      policies.treePlantation > 70 && policies.co2Reduction > 70
                        ? `Decade-long strategic initiative has yielded exceptional results. Forest coverage expansion of ${policies.treePlantation}% and carbon emission reduction of ${policies.co2Reduction}% exceed international benchmarks. The nation has achieved global leadership status in environmental policy implementation. Ecosystem recovery metrics demonstrate successful long-term planning and execution.`
                        : `Ten-year policy assessment shows notable environmental improvements. Tree coverage increased ${policies.treePlantation}% and emissions declined ${policies.co2Reduction}%, representing significant but incomplete progress toward climate neutrality. Intelligence analysts emphasize that the coming decade will be critical for achieving carbon neutrality and preventing irreversible environmental degradation. Enhanced policy measures under consideration.`
                    )}
                  </p>
                </div>

                {/* Sector Analysis */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <Card className="border-2 border-primary/30">
                    <CardHeader className="pb-3 bg-primary/5">
                      <Badge variant="outline" className="text-xs w-fit">TRANSPORTATION SECTOR</Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-base leading-tight mb-3 uppercase">
                        {timelineDuration === 'long'
                          ? policies.evAdoption > 70
                            ? 'Electric Vehicle Market Dominance Confirmed'
                            : 'EV Adoption Progress Below Optimal Levels'
                          : policies.evAdoption > 60
                          ? 'Electric Vehicle Revolution Accelerating'
                          : 'EV Market Development Proceeding Gradually'}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {timelineDuration === 'long' && policies.evAdoption > 70
                          ? `After ten years of strategic policy implementation, electric vehicles comprise ${policies.evAdoption}% of the national fleet. Traditional fuel infrastructure is undergoing conversion to charging networks. Transportation sector carbon emissions have been significantly reduced, contributing to national climate objectives.`
                          : `Current electric vehicle adoption rate stands at ${policies.evAdoption}%, reflecting ${timelineDuration === 'short' ? 'initial momentum' : timelineDuration === 'mid' ? 'steady infrastructure expansion' : 'long-term market evolution'} in the transportation sector. Strategic analysis ongoing.`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-success/30">
                    <CardHeader className="pb-3 bg-success/5">
                      <Badge variant="outline" className="text-xs w-fit">ENVIRONMENTAL SECTOR</Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-base leading-tight mb-3 uppercase">
                        {timelineDuration === 'long'
                          ? policies.treePlantation > 70
                            ? 'Ecosystem Restoration Successfully Completed'
                            : 'Reforestation Initiative Showing Long-Term Impact'
                          : policies.treePlantation > 50
                          ? 'Urban Greening Transforming National Landscape'
                          : 'Tree Plantation Programs Expanding Methodically'}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {timelineDuration === 'long' && policies.treePlantation > 70
                          ? `Decade-long reforestation initiative increased national green cover by ${policies.treePlantation}%. Native ecosystems recovering, biodiversity metrics improving substantially. Carbon sequestration capacity has more than doubled, contributing significantly to emission reduction targets.`
                          : `Tree coverage initiatives at ${policies.treePlantation}% implementation strength are ${timelineDuration === 'short' ? 'initiating urban greening projects' : timelineDuration === 'mid' ? 'creating measurable environmental improvements' : 'establishing mature forest ecosystems'} across designated regions.`}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-secondary/30">
                    <CardHeader className="pb-3 bg-secondary/5">
                      <Badge variant="outline" className="text-xs w-fit">ECONOMIC SECTOR</Badge>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-base leading-tight mb-3 uppercase">
                        {timelineDuration === 'long'
                          ? spentBudget > 80
                            ? 'Green Economy Transition Fully Realized'
                            : 'Economic Transformation Continuing After Decade'
                          : spentBudget > 70
                          ? 'Climate Investment Catalyzing Economic Growth'
                          : 'Green Sector Investment Showing Promise'}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {timelineDuration === 'long' && spentBudget > 80
                          ? `Decade of strategic investment totaling $${spentBudget.toFixed(1)}B has established mature green economy with stable employment, technological leadership, and sustainable growth patterns exceeding traditional industrial sectors. Economic transformation complete.`
                          : `Climate policy investment of $${spentBudget.toFixed(1)}B is ${timelineDuration === 'short' ? 'initiating job creation' : timelineDuration === 'mid' ? 'building robust green industries' : 'establishing long-term economic foundations'} within national economic framework.`}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Intelligence Assessment */}
                <div className="mt-10 p-6 bg-warning/10 rounded border-2 border-warning">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="size-6 text-warning flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-base uppercase tracking-wide text-warning mb-1">
                        Intelligence Assessment
                      </h4>
                      <div className="text-xs text-warning/70 uppercase tracking-wider">Strategic Analysis Division</div>
                    </div>
                  </div>
                  <p className="text-sm italic text-foreground leading-relaxed">
                    {timelineDuration === 'short' && (
                      totalPolicyStrength > 60
                        ? '"Strategic Command assesses current policy deployment as robust and well-coordinated. Initial implementation phase demonstrates strong governmental commitment. Critical assessment: sustained momentum through subsequent phases is essential. Early indicators are promising, but long-term success depends on consistent policy enforcement and adequate resource allocation."'
                        : '"Current policy measures represent initial phase deployment but fall short of crisis-level response requirements. Strategic advisors recommend more aggressive implementation timelines and enhanced resource commitment. International obligations require accelerated action. Command recommends immediate policy review and enhancement protocols."'
                    )}
                    {timelineDuration === 'mid' && (
                      totalPolicyStrength > 60
                        ? '"Five-year operational assessment confirms policy framework is delivering measurable strategic outcomes. Critical infrastructure deployment complete, market response positive, public support sustained. Strategic foundation established for transformative second-phase implementation. Command maintains high confidence in trajectory toward 2035 milestone objectives."'
                        : '"Mid-term intelligence assessment reveals mixed operational results. Sector performance inconsistent with strategic projections. Critical sectors advancing while others demonstrate implementation deficiencies. Next five years represent decisive period for meeting 2035 targets. Command recommends enhanced oversight and accelerated implementation in underperforming sectors."'
                    )}
                    {timelineDuration === 'long' && (
                      totalPolicyStrength > 70
                        ? '"Decade-long strategic operation has proven comprehensive climate action not only achievable but economically advantageous. Green economy thriving, ecosystems recovering, nation has achieved global leadership position. Challenge transitions from implementation to sustainment. Command assesses high probability of maintaining trajectory for multi-decade carbon neutrality objectives."'
                        : totalPolicyStrength > 40
                        ? '"Ten-year policy assessment shows measurable progress without achieving transformative outcomes. Environmental decline has been slowed but not reversed. Strategic command emphasizes that next decade requires significantly enhanced policy deployment to avoid catastrophic climate scenarios. Current trajectory insufficient for Paris Agreement compliance."'
                        : '"Decade assessment reveals critical policy implementation failures. Limited deployment has failed to alter emissions trajectory or protect vulnerable ecosystems. Strategic situation has deteriorated. Command assessment: urgent and dramatic policy enhancement no longer optional but imperative for national security and environmental survival. Immediate executive action required."'
                    )}
                  </p>
                  <div className="mt-4 pt-4 border-t border-warning/30 flex items-center justify-between">
                    <div className="text-xs text-warning font-bold uppercase tracking-wider">
                      Classification: Official Use Only
                    </div>
                    <div className="text-xs text-warning/70">
                      Document ID: NIA-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
