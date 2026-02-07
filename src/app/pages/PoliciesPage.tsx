import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, BarChart3, Image, Clock, Newspaper } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

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

const MAX_BUDGET = 100;

export function PoliciesPage() {
  const navigate = useNavigate();
  const { policies, setPolicies, setChartData, setOutputImage, setNewspaper, setTimelineData, setIsGenerated, uploadedImage } = useSimulation();
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateSpentBudget = () => {
    let total = 0;
    Object.entries(policies).forEach(([key, value]) => {
      total += (value * POLICY_COSTS[key as keyof typeof POLICY_COSTS]) / 1000;
    });
    return total.toFixed(2);
  };

  const handlePolicyChange = (policy: keyof typeof policies, value: number) => {
    setPolicies({ ...policies, [policy]: value });
  };

  const generateSimulation = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Generate chart data for 10 years
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
          greenJobs: (parseFloat(calculateSpentBudget()) * 2.5 * growthFactor) * 10,
          temperature: 1.5 - (Object.values(policies).reduce((a, b) => a + b, 0) / 800 * growthFactor * 0.4),
        };
      });
      setChartData(data);
      
      // Generate output image
      setOutputImage(uploadedImage);
      
      // Generate timeline data
      const timeline = generateTimelineData();
      setTimelineData(timeline);
      
      // Generate newspaper
      const news = generateNewspaper();
      setNewspaper(news);
      
      setIsGenerated(true);
      setIsGenerating(false);
      
      // Navigate to dashboard
      navigate('/dashboard');
    }, 2500);
  };

  const generateTimelineData = () => {
    const spentBudget = calculateSpentBudget();
    const totalPolicyStrength = Object.values(policies).reduce((a, b) => a + b, 0) / 8;

    return {
      year1: {
        title: "Year 1 (2027): Foundation & Implementation",
        impacts: [
          `Infrastructure Development: Initial deployment of ${policies.evAdoption > 0 ? 'EV charging stations' : 'green infrastructure'} begins across major cities.`,
          `Policy Rollout: ${policies.renewableEnergy > 30 ? 'Aggressive renewable energy subsidies' : 'Renewable energy incentives'} drive early adoption.`,
          `Public Awareness: Nationwide campaigns educate citizens about climate policies, reaching ${(totalPolicyStrength * 5).toFixed(0)} million people.`,
          policies.treePlantation > 20 ? `Green Initiatives: ${(policies.treePlantation * 10).toFixed(0)} million trees planted, creating visible changes in urban landscapes.` : null,
          `Economic Impact: ${(parseFloat(spentBudget) * 0.2 * 2.5).toFixed(1)}M green jobs created in construction, installation, and planning sectors.`,
          `Early Results: Air quality monitoring shows ${(totalPolicyStrength * 0.05).toFixed(1)}% improvement in major metropolitan areas.`,
        ].filter(Boolean),
        challenges: [
          "Initial resistance from traditional industries requiring transition support",
          "Supply chain adjustments needed for new green technologies",
          "Public adaptation period to new transportation and energy systems"
        ],
        achievements: [
          `$${(parseFloat(spentBudget) * 0.2).toFixed(1)}B allocated and actively deployed`,
          policies.evAdoption > 20 ? "EV sales surge 40% above projections" : "Green technology adoption exceeds expectations",
          "Cross-sector partnerships established for sustainable development"
        ]
      },
      year5: {
        title: "Year 5 (2031): Acceleration & Transformation",
        impacts: [
          `Environmental Progress: CO₂ emissions reduced by ${(policies.co2Reduction * 0.5).toFixed(1)}%, exceeding initial targets.`,
          `Energy Revolution: ${policies.renewableEnergy > 50 ? 'Renewable energy now powers majority of grid' : `${(policies.renewableEnergy * 0.5).toFixed(0)}% renewable energy integration achieved`}.`,
          `Urban Transformation: ${policies.evAdoption > 40 ? 'EVs dominate city streets' : 'Significant EV presence in urban areas'}, reducing urban noise pollution by 30%.`,
          `Green Economy: ${(parseFloat(spentBudget) * 0.6 * 2.5).toFixed(1)}M employed in renewable sectors, representing 8% of workforce.`,
          policies.treePlantation > 30 ? `Ecosystem Recovery: ${(policies.treePlantation * 50).toFixed(0)} million trees matured, urban temperatures drop ${(policies.treePlantation * 0.15).toFixed(1)}°C.` : null,
          `Health Benefits: Respiratory disease rates decline ${(totalPolicyStrength * 0.2).toFixed(0)}% in high-density areas.`,
          `Global Leadership: Nation recognized as climate action leader, influencing international policy adoption.`,
        ].filter(Boolean),
        challenges: [
          "Managing rapid industrial transition and worker retraining programs",
          "Balancing economic growth with environmental sustainability",
          "Addressing regional disparities in policy implementation"
        ],
        achievements: [
          `Temperature rise limited to ${(1.5 - (totalPolicyStrength * 0.003 * 0.5)).toFixed(2)}°C above pre-industrial levels`,
          "Carbon neutrality timeline accelerated by 5 years",
          policies.publicTransport > 40 ? "Public transit ridership doubles, traffic congestion eliminated in major cities" : "Significant public transport improvements"
        ]
      },
      year10: {
        title: "Year 10 (2036): Maturity & Global Impact",
        impacts: [
          `Climate Stabilization: Global temperature increase held to ${(1.5 - (totalPolicyStrength * 0.003)).toFixed(2)}°C, preventing worst-case scenarios.`,
          `Complete Transformation: ${policies.evAdoption > 60 ? '85% of vehicles fully electric' : `${(policies.evAdoption * 0.85).toFixed(0)}% EV adoption rate`}, fossil fuel infrastructure largely decommissioned.`,
          `Energy Independence: ${policies.renewableEnergy > 60 ? 'Nation achieves 100% renewable energy grid' : `${(policies.renewableEnergy * 0.9).toFixed(0)}% renewable energy capacity`}.`,
          `Ecosystem Revival: Biodiversity indices show ${(totalPolicyStrength * 0.4).toFixed(0)}% improvement, endangered species populations recovering.`,
          `Economic Success: Green economy generates $${(parseFloat(spentBudget) * 4).toFixed(1)}B annually, ${(parseFloat(spentBudget) * 2.5).toFixed(1)}M permanent jobs established.`,
          `Air Quality Victory: ${totalPolicyStrength > 60 ? 'Air pollution reduced to pre-industrial levels in most regions' : `${(totalPolicyStrength * 0.6).toFixed(0)}% reduction in harmful particulates`}.`,
          `Global Influence: Climate policies adopted worldwide, preventing ${(totalPolicyStrength * 0.15).toFixed(0)} gigatons of global emissions.`,
          policies.treePlantation > 50 ? `Forest Coverage: ${(policies.treePlantation * 100).toFixed(0)} million trees create vast carbon sinks, sequestering ${(policies.treePlantation * 50).toFixed(0)} megatons CO₂ annually.` : null,
        ].filter(Boolean),
        challenges: [
          "Maintaining momentum and preventing policy rollback",
          "Adapting to unforeseen climate impacts already in motion",
          "Supporting developing nations in climate transition"
        ],
        achievements: [
          totalPolicyStrength > 60 ? "Climate crisis averted, sustainable future secured" : "Significant progress toward climate stability",
          "Next-generation growing up in cleaner, healthier environment",
          "Proof that economic prosperity and environmental protection align",
          policies.industrialControls > 50 ? "Industrial sector achieves carbon-negative status" : "Industries operating sustainably"
        ]
      }
    };
  };

  const generateNewspaper = () => {
    const totalPolicyStrength = Object.values(policies).reduce((a, b) => a + b, 0) / 8;
    const spentBudget = calculateSpentBudget();
    
    return {
      headline: totalPolicyStrength > 60 
        ? "CLIMATE VICTORY DECLARED: Decade of Action Reverses Environmental Crisis"
        : totalPolicyStrength > 30
        ? "Ten Years of Progress: Climate Policies Deliver Measurable Global Impact"
        : "Climate Action Shows Results After Decade of Implementation",
      
      subheadline: `$${spentBudget}B Investment Transforms Economy, Environment, and Society Over 10-Year Period`,
      
      mainStory: totalPolicyStrength > 60
        ? `Ten years ago, when the comprehensive climate initiative launched with a $${spentBudget} billion commitment, skeptics questioned whether such ambitious policies could succeed without devastating the economy. Today, as we mark this historic anniversary, the answer is unequivocally clear: not only have these policies worked, they've exceeded every projection.\n\nThe transformation is staggering. Cities that once choked under smog now boast air quality rivaling pristine wilderness. Streets once gridlocked with combustion vehicles now hum quietly with electric transport. Industrial zones that spewed pollution have become models of clean manufacturing. "We didn't just avoid climate catastrophe," declares Dr. Elena Martinez, Director of the Global Climate Institute. "We've created a blueprint for sustainable civilization."\n\nThe economic story is equally compelling. The green economy now employs ${(parseFloat(spentBudget) * 2.5).toFixed(1)} million people—more than the fossil fuel industry ever did at its peak. GDP growth has averaged 4.2% annually while emissions plummeted. "We proved the false choice wrong," says Nobel economist Dr. James Chen. "Environmental protection and prosperity aren't opposites—they're partners."\n\nPerhaps most remarkably, this success has sparked a global movement. Over 140 nations have adopted similar frameworks, creating a worldwide cascade of climate action. Scientists now project we'll limit warming to ${(1.5 - (totalPolicyStrength * 0.003)).toFixed(2)}°C—a scenario deemed impossible just a decade ago.`
        : totalPolicyStrength > 30
        ? `As the ten-year anniversary of the climate initiative approaches, policymakers and scientists are reflecting on a decade of steady progress and hard-won victories against environmental degradation. The $${spentBudget} billion investment has fundamentally reshaped major sectors of the economy while delivering measurable environmental improvements.\n\n"We've turned the corner," states Dr. Sarah Williams, chief climate advisor. "Emissions are declining, renewable energy is thriving, and public health metrics show significant improvements. But we can't rest—the next decade will be equally critical."\n\nThe achievements are substantial: air quality has improved ${(totalPolicyStrength * 0.5).toFixed(0)}% in major cities, ${(parseFloat(spentBudget) * 2.5).toFixed(1)} million green jobs have been created, and renewable energy capacity has expanded dramatically. Urban forests and green infrastructure have transformed cityscapes, while electric vehicles have become commonplace.\n\nChallenges remain, however. Climate scientists warn that while progress is encouraging, the pace must accelerate to meet 2050 carbon neutrality targets. "We've proven these policies work," notes environmental economist Dr. Robert Kim. "Now we need to scale them up globally."`
        : `The decade-long climate policy initiative concludes with mixed results. While the $${spentBudget} billion investment has produced some environmental improvements and economic opportunities, climate scientists emphasize that much more aggressive action will be necessary to avert serious climate consequences.\n\n"We've made progress, but it's incremental when we needed transformational change," cautions climatologist Dr. Amanda Rodriguez. "The window for preventing severe climate impacts is closing rapidly."\n\nPositive developments include expanded renewable energy infrastructure, improved air quality in some metropolitan areas, and the creation of green sector jobs. However, overall carbon emissions remain well above sustainable levels, and many policy goals have fallen short of targets.\n\nEnvironmental advocates are calling for a dramatically scaled-up response. "This first decade taught us what works," argues climate activist Marcus Thompson. "Now we need the political will to implement these solutions at the scale the crisis demands."`,
      
      headlines: [
        totalPolicyStrength > 60 ? "BREAKING: Global Temperatures Stabilize Below Critical Threshold" : totalPolicyStrength > 30 ? "Temperature Rise Slows as Policies Take Effect" : "Climate Targets Still Within Reach, Scientists Say",
        policies.evAdoption > 70 ? `Fossil Fuel Era Officially Ends: ${policies.evAdoption.toFixed(0)}% of Vehicles Now Electric` : policies.evAdoption > 40 ? "Electric Vehicles Achieve Market Dominance" : policies.evAdoption > 20 ? "EV Adoption Continues Steady Growth" : null,
        policies.renewableEnergy > 70 ? "Last Coal Plant Closes as Renewable Energy Powers Nation" : policies.renewableEnergy > 50 ? "Renewable Energy Surpasses Fossil Fuels in Grid Mix" : policies.renewableEnergy > 20 ? "Solar and Wind Installations Reach Record Levels" : null,
        policies.treePlantation > 60 ? `Billion Trees Milestone: Urban Forests Reshape Cities Nationwide` : policies.treePlantation > 40 ? "Reforestation Success: City Temperatures Drop Significantly" : policies.treePlantation > 20 ? "Tree Planting Programs Show Environmental Benefits" : null,
        totalPolicyStrength > 60 ? "Life Expectancy Increases 3 Years, Linked to Cleaner Air" : totalPolicyStrength > 30 ? "Public Health Improves as Air Quality Standards Met" : null,
        policies.publicTransport > 60 ? "Car Ownership Plummets as Transit Systems Transform Cities" : policies.publicTransport > 40 ? "Public Transportation Ridership Hits All-Time High" : null,
        policies.industrialControls > 60 ? "Manufacturing Sector Achieves Carbon Negative Status" : policies.industrialControls > 40 ? "Industries Report Major Emission Reductions" : null,
        totalPolicyStrength > 50 ? "Endangered Species Make Remarkable Recovery" : null,
        totalPolicyStrength > 60 ? "Green Jobs Now Largest Employment Sector in Economy" : `${(parseFloat(spentBudget) * 2.5).toFixed(1)}M Employed in Renewable Energy Sector`,
      ].filter(Boolean),
      
      sideStories: [
        totalPolicyStrength > 60 ? {
          title: "Children Born in 2026 Grow Up Without Knowing Smog",
          excerpt: "Generation grows up breathing clean air, enjoying urban forests that didn't exist in their parents' youth."
        } : null,
        policies.evAdoption > 60 ? {
          title: "Former Oil Workers Thrive in Renewable Careers",
          excerpt: "Just transition programs successfully retrain fossil fuel workforce for green economy."
        } : null,
        policies.treePlantation > 50 ? {
          title: "Wildlife Returns to Urban Centers",
          excerpt: "Birds, butterflies, and small mammals reclaim city parks as ecosystems recover."
        } : null,
        policies.renewableEnergy > 60 ? {
          title: "Energy Bills Drop 40% as Renewables Dominate",
          excerpt: "Households save thousands annually as clean energy costs plummet."
        } : null,
        totalPolicyStrength > 50 ? {
          title: "Mental Health Crisis Eases as Climate Anxiety Fades",
          excerpt: "Psychologists report dramatic decline in eco-anxiety among youth."
        } : null,
        policies.publicTransport > 60 ? {
          title: "Productivity Soars as Commute Times Halve",
          excerpt: "Workers gain hours weekly as efficient transit replaces car congestion."
        } : null,
      ].filter(Boolean).slice(0, 4),
      
      stats: {
        temperature: `${(1.5 - (totalPolicyStrength * 0.003)).toFixed(2)}°C`,
        jobs: `${(parseFloat(spentBudget) * 2.5).toFixed(1)}M`,
        airQuality: `+${(totalPolicyStrength * 0.6).toFixed(0)}%`,
        emissions: `-${(totalPolicyStrength * 0.9).toFixed(0)}%`,
      },
      
      opinion: totalPolicyStrength > 60
        ? "Editorial: We Chose Wisely - A decade ago, we faced a choice between short-term comfort and long-term survival. We chose survival, and today we reap rewards beyond imagination. Future generations will study this decade as the turning point when humanity chose wisdom over expedience."
        : "Editorial: Progress Made, But Urgency Remains - While celebrating genuine achievements, we must acknowledge the work ahead. This decade proved climate action is possible and beneficial. The next must prove it's sufficient."
    };
  };

  const spentBudget = parseFloat(calculateSpentBudget());
  const remainingBudget = MAX_BUDGET - spentBudget;

  const policyFields = [
    { key: 'evAdoption', label: '🚗 EV Adoption', cost: POLICY_COSTS.evAdoption },
    { key: 'co2Reduction', label: '💨 CO₂ Reduction', cost: POLICY_COSTS.co2Reduction },
    { key: 'treePlantation', label: '🌳 Tree Plantation', cost: POLICY_COSTS.treePlantation },
    { key: 'renewableEnergy', label: '⚡ Renewable Energy', cost: POLICY_COSTS.renewableEnergy },
    { key: 'publicTransport', label: '🚊 Public Transport', cost: POLICY_COSTS.publicTransport },
    { key: 'industrialControls', label: '🏭 Industrial Controls', cost: POLICY_COSTS.industrialControls },
    { key: 'greenBuilding', label: '🏢 Green Building', cost: POLICY_COSTS.greenBuilding },
    { key: 'wasteManagement', label: '♻️ Waste Management', cost: POLICY_COSTS.wasteManagement },
  ];

  const pages = [
    { icon: BarChart3, title: 'Dashboard', description: 'View comprehensive 10-year projections and analytics', path: '/dashboard' },
    { icon: Image, title: 'Visual Impact', description: 'See before/after environmental transformation', path: '/visual-impact' },
    { icon: Clock, title: 'Timeline', description: 'Explore year-by-year impact analysis', path: '/timeline' },
    { icon: Newspaper, title: 'Future News', description: 'Read headlines from 10 years ahead', path: '/newspaper' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header with Budget */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">🌍 Climate Policy Simulator</h1>
          <p className="text-gray-600">Configure policies and simulate their 10-year environmental impact</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Budget Overview</div>
          <div className="text-2xl mb-1">
            ${remainingBudget.toFixed(2)}B
            <span className="text-sm text-gray-500"> / ${MAX_BUDGET}B</span>
          </div>
          <div className="text-xs text-gray-500">
            Spent: ${spentBudget.toFixed(2)}B ({((spentBudget / MAX_BUDGET) * 100).toFixed(1)}%)
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                spentBudget > MAX_BUDGET ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((spentBudget / MAX_BUDGET) * 100, 100)}%` }}
            />
          </div>
          {spentBudget > MAX_BUDGET && (
            <div className="text-xs text-red-600 mt-1">⚠️ Over budget!</div>
          )}
        </div>
      </div>

      {/* Policy Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl mb-4">Policy Parameters</h2>
        <div className="grid grid-cols-2 gap-6">
          {policyFields.map((field) => (
            <PolicyControl
              key={field.key}
              label={field.label}
              value={policies[field.key as keyof typeof policies]}
              onChange={(v) => handlePolicyChange(field.key as keyof typeof policies, v)}
              cost={field.cost}
            />
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateSimulation}
        disabled={isGenerating}
        className="w-full mb-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <>
            <Sparkles className="size-6 animate-spin" />
            Generating 10-Year Projection...
          </>
        ) : (
          <>
            <Sparkles className="size-6" />
            Generate Simulation
          </>
        )}
      </button>

      {/* Page Navigation Cards */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl mb-4">Explore Simulation Results</h2>
        <div className="grid grid-cols-2 gap-4">
          {pages.map((page) => (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg p-6 text-left transition-all hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <page.icon className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg mb-1">{page.title}</h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">
          Click "Generate Simulation" first, then explore the results across different views
        </p>
      </div>
    </div>
  );
}

interface PolicyControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  cost: number;
}

function PolicyControl({ label, value, onChange, cost }: PolicyControlProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value))))}
            className="w-14 px-2 py-1 border border-gray-300 rounded text-sm text-right bg-white"
            min="0"
            max="100"
          />
          <span className="text-sm">%</span>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="text-xs text-gray-500 mt-1">
        Cost: ${((value * cost) / 1000).toFixed(2)}B
      </div>
    </div>
  );
}
