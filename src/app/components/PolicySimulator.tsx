import { useState } from 'react';
import { Upload, Sparkles, Newspaper } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PolicyValues {
  evAdoption: number;
  co2Reduction: number;
  treePlantation: number;
  renewableEnergy: number;
  publicTransport: number;
  industrialControls: number;
  greenBuilding: number;
  wasteManagement: number;
}

const POLICY_COSTS = {
  evAdoption: 500, // Million per percentage point
  co2Reduction: 300,
  treePlantation: 200,
  renewableEnergy: 600,
  publicTransport: 400,
  industrialControls: 350,
  greenBuilding: 250,
  wasteManagement: 150,
};

export function PolicySimulator() {
  const [policies, setPolicies] = useState<PolicyValues>({
    evAdoption: 0,
    co2Reduction: 0,
    treePlantation: 0,
    renewableEnergy: 0,
    publicTransport: 0,
    industrialControls: 0,
    greenBuilding: 0,
    wasteManagement: 0,
  });

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [newspaper, setNewspaper] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const MAX_BUDGET = 100; // Billion dollars

  const calculateSpentBudget = () => {
    let total = 0;
    Object.entries(policies).forEach(([key, value]) => {
      total += (value * POLICY_COSTS[key as keyof typeof POLICY_COSTS]) / 1000;
    });
    return total.toFixed(2);
  };

  const handlePolicyChange = (policy: keyof PolicyValues, value: number) => {
    setPolicies(prev => ({ ...prev, [policy]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setOutputImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSimulation = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Generate chart data for 5 years
      const years = ['2026', '2027', '2028', '2029', '2030', '2031'];
      const data = years.map((year, index) => {
        const growthFactor = index / 5;
        return {
          year,
          co2Emissions: Math.max(100 - (policies.co2Reduction * growthFactor * 0.8), 20),
          airQuality: 50 + (policies.co2Reduction + policies.evAdoption + policies.treePlantation) / 3 * growthFactor * 0.5,
          evAdoption: policies.evAdoption * growthFactor,
          renewableEnergy: policies.renewableEnergy * growthFactor,
          treeCover: 30 + (policies.treePlantation * growthFactor * 0.7),
          publicTransportUsage: 25 + (policies.publicTransport * growthFactor * 0.6),
          greenJobs: (parseFloat(calculateSpentBudget()) * 2.5 * growthFactor) * 10, // in thousands
          temperature: 1.5 - (Object.values(policies).reduce((a, b) => a + b, 0) / 800 * growthFactor * 0.3),
        };
      });
      setChartData(data);
      
      // Generate output image
      setOutputImage(uploadedImage);
      
      // Generate newspaper
      const news = generateNewspaper();
      setNewspaper(news);
      
      setIsGenerating(false);
    }, 2500);
  };

  const generateNewspaper = () => {
    const totalPolicyStrength = Object.values(policies).reduce((a, b) => a + b, 0) / 8;
    const spentBudget = calculateSpentBudget();
    
    return {
      headline: totalPolicyStrength > 60 
        ? "HISTORIC CLIMATE VICTORY: Global Temperatures Stabilize as Green Policies Transform Society"
        : totalPolicyStrength > 30
        ? "Climate Progress Continues: 5-Year Policy Initiative Shows Promising Results"
        : "Climate Efforts Show Modest Gains: Experts Call for Increased Action",
      
      subheadline: `After $${spentBudget}B Investment, Nations Report Measurable Environmental Improvements`,
      
      mainStory: generateMainStory(totalPolicyStrength, spentBudget),
      
      headlines: [
        policies.evAdoption > 50 ? `EV Revolution Complete: ${policies.evAdoption}% of Vehicles Now Electric` : policies.evAdoption > 0 ? "Electric Vehicle Adoption Rises in Major Cities" : null,
        policies.treePlantation > 40 ? `${(policies.treePlantation * 100).toFixed(0)} Million Trees: Urban Forests Transform Cityscapes` : policies.treePlantation > 0 ? "Reforestation Projects Show Green Results" : null,
        policies.renewableEnergy > 50 ? "Fossil Fuel Era Ends: Renewable Energy Now Powers Majority of Homes" : policies.renewableEnergy > 0 ? "Renewable Energy Sector Expands Rapidly" : null,
        policies.co2Reduction > 50 ? "CO₂ Levels Drop to Lowest Point in Decades" : policies.co2Reduction > 0 ? "Carbon Emissions Show Downward Trend" : null,
        policies.publicTransport > 40 ? "Car-Free Cities Become Reality as Public Transit Ridership Soars" : policies.publicTransport > 0 ? "Public Transportation Networks Expand" : null,
        policies.industrialControls > 40 ? "Clean Manufacturing Revolution: Industries Achieve 70% Emission Reduction" : policies.industrialControls > 0 ? "Industries Adapt to Stricter Environmental Standards" : null,
        policies.greenBuilding > 40 ? "Green Architecture Boom: Net-Zero Buildings Now Standard" : policies.greenBuilding > 0 ? "Sustainable Building Practices Gain Momentum" : null,
        policies.wasteManagement > 40 ? "Waste Crisis Solved: Cities Achieve 80% Recycling Rates" : policies.wasteManagement > 0 ? "Recycling Programs Reduce Landfill Waste" : null,
      ].filter(Boolean),
      
      sideStories: generateSideStories(policies, totalPolicyStrength),
      
      stats: {
        temperature: `${(1.5 - (totalPolicyStrength * 0.003)).toFixed(2)}°C`,
        jobs: `${(parseFloat(spentBudget) * 2.5).toFixed(1)}M`,
        airQuality: `+${(totalPolicyStrength * 0.5).toFixed(0)}%`,
        emissions: `-${(totalPolicyStrength * 0.8).toFixed(0)}%`,
      }
    };
  };

  const generateMainStory = (strength: number, budget: string) => {
    if (strength > 60) {
      return `Five years ago, world leaders made an unprecedented commitment of $${budget} billion toward comprehensive climate action. Today, the results speak for themselves. Scientists confirm that global temperature rise has slowed significantly, with projections now showing a potential stabilization well below catastrophic levels.\n\nThe transformation has been visible in every sector. City skylines gleam with solar panels, streets hum with electric vehicles, and urban forests have replaced concrete wastelands. "This is what happens when policy meets investment," says Dr. Sarah Chen, lead climate scientist at the Global Environmental Institute. "We've fundamentally restructured how our society interacts with the planet."\n\nPublic health officials report dramatic improvements in air quality, with respiratory illnesses down 40% in major metropolitan areas. The green economy has created millions of jobs, from renewable energy technicians to urban foresters, proving that environmental action and economic prosperity can coexist.`;
    } else if (strength > 30) {
      return `The five-year, $${budget} billion climate initiative has produced measurable improvements across multiple environmental indicators, though experts caution that more aggressive action is needed to meet international climate targets.\n\nKey achievements include expanded renewable energy infrastructure, increased urban tree coverage, and growing adoption of electric vehicles in major cities. Air quality has improved in industrial zones, and public awareness of climate issues has reached all-time highs.\n\n"We're moving in the right direction," notes environmental economist Dr. James Rodriguez, "but the pace needs to accelerate. These policies have proven effective—we just need to scale them up significantly to achieve our 2050 carbon neutrality goals."`;
    } else {
      return `A modest $${budget} billion investment in climate policies over the past five years has yielded incremental environmental improvements, though climate advocates argue the response remains inadequate to the scale of the crisis.\n\nWhile some progress has been made in renewable energy adoption and emission controls, overall carbon output remains well above sustainable levels. Cities have begun implementing green infrastructure projects, but widespread transformation has yet to materialize.\n\n"We're seeing baby steps when we need giant leaps," warns climate activist Maria Santos. "The science is clear—without dramatic increases in policy ambition and funding, we risk missing critical climate targets altogether."`;
    }
  };

  const generateSideStories = (policies: PolicyValues, strength: number) => {
    const stories = [];
    
    if (policies.evAdoption > 40) {
      stories.push({
        title: "Last Gas Station Closes in Major City",
        excerpt: "Historic shift as electric charging infrastructure replaces traditional fuel pumps nationwide."
      });
    }
    
    if (policies.renewableEnergy > 50) {
      stories.push({
        title: "Coal Industry Announces Complete Phase-Out",
        excerpt: "Former coal workers successfully transition to renewable energy sector jobs."
      });
    }
    
    if (policies.treePlantation > 40) {
      stories.push({
        title: "Urban Heat Islands Eliminated",
        excerpt: "Massive tree planting initiatives reduce city temperatures by average of 3°C."
      });
    }
    
    if (policies.publicTransport > 50) {
      stories.push({
        title: "Traffic Congestion Down 60%",
        excerpt: "Revolutionary public transit systems transform daily commutes."
      });
    }
    
    if (strength > 50) {
      stories.push({
        title: "Youth Mental Health Improves",
        excerpt: "Psychologists link climate action to reduced eco-anxiety among young people."
      });
      stories.push({
        title: "Biodiversity Rebounds",
        excerpt: "Wildlife returns to restored ecosystems as habitat protection expands."
      });
    }
    
    return stories.slice(0, 4);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">🌍 Climate Policy Simulator</h1>
          <p className="text-gray-600">Model climate policies and visualize their 5-year impact</p>
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

      {/* Top Section: Policy Grid + Image Upload */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Policy Parameters Grid */}
        <div className="col-span-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl mb-4">Policy Parameters</h2>
          <div className="grid grid-cols-2 gap-6">
            {policyFields.map((field) => (
              <PolicyControl
                key={field.key}
                label={field.label}
                value={policies[field.key as keyof PolicyValues]}
                onChange={(v) => handlePolicyChange(field.key as keyof PolicyValues, v)}
                cost={field.cost}
              />
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="col-span-4 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl mb-4">Input Image</h2>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Input" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3 p-4 text-center w-full h-full justify-center">
                <Upload className="size-12 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload<br/>city/landscape image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {uploadedImage && (
            <button
              onClick={() => setUploadedImage(null)}
              className="text-sm text-red-600 mt-3 hover:underline"
            >
              Remove image
            </button>
          )}
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
            Generating 5-Year Projection...
          </>
        ) : (
          <>
            <Sparkles className="size-6" />
            Generate Simulation
          </>
        )}
      </button>

      {/* Dashboard - Charts */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-6">📊 5-Year Impact Dashboard</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* CO2 Emissions Chart */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">CO₂ Emissions Trend (Index: 100 = Current)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="co2Emissions" stroke="#ef4444" fill="#fca5a5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Air Quality Chart */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">Air Quality Index (Higher = Better)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="airQuality" stroke="#10b981" fill="#86efac" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* EV & Renewable Energy */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">EV Adoption & Renewable Energy (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="evAdoption" stroke="#3b82f6" strokeWidth={2} name="EV Adoption" />
                  <Line type="monotone" dataKey="renewableEnergy" stroke="#f59e0b" strokeWidth={2} name="Renewable Energy" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Green Jobs Created */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">Green Jobs Created (Thousands)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="greenJobs" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature Change */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">Global Temperature Rise (°C)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 2]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tree Cover & Public Transport */}
            <div>
              <h3 className="text-sm mb-3 text-gray-700">Tree Cover & Public Transport Usage (%)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="treeCover" stroke="#22c55e" strokeWidth={2} name="Tree Cover" />
                  <Line type="monotone" dataKey="publicTransportUsage" stroke="#06b6d4" strokeWidth={2} name="Public Transit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Output Image + Newspaper */}
      {(outputImage || newspaper) && (
        <div className="grid grid-cols-2 gap-6">
          {/* Output Image */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl mb-4">🖼️ Visual Impact (2031)</h2>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-green-300 flex items-center justify-center">
              {outputImage ? (
                <div className="relative w-full h-full">
                  <img src={outputImage} alt="Output" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 mix-blend-overlay pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                    After 5 Years of Policy Implementation
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded">
                    Year 2031
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 p-4 text-center">
                  Upload an image to see projected transformation
                </div>
              )}
            </div>
          </div>

          {/* Newspaper */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Newspaper className="size-6" />
              The Global Times - February 7, 2031
            </h2>
            {newspaper ? (
              <div className="border-4 border-gray-800 p-6 bg-amber-50 max-h-[600px] overflow-y-auto newspaper-style">
                {/* Newspaper Header */}
                <div className="text-center mb-6 border-b-4 border-gray-800 pb-4">
                  <div className="text-xs uppercase tracking-widest mb-1">Vol. CCXVI • No. 1,825</div>
                  <div className="font-serif text-4xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    The Global Times
                  </div>
                  <div className="text-xs italic">"All the News That Matters"</div>
                </div>

                {/* Main Headline */}
                <div className="mb-6">
                  <h1 className="font-serif text-3xl mb-2 leading-tight border-b-2 border-gray-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {newspaper.headline}
                  </h1>
                  <h2 className="text-lg italic text-gray-700 mb-4">
                    {newspaper.subheadline}
                  </h2>
                  <div className="text-sm leading-relaxed whitespace-pre-line font-serif columns-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {newspaper.mainStory}
                  </div>
                </div>

                {/* Stats Box */}
                <div className="bg-blue-100 border-2 border-blue-800 p-4 mb-6">
                  <div className="font-bold text-center mb-2">BY THE NUMBERS</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><strong>Temperature Rise:</strong> {newspaper.stats.temperature}</div>
                    <div><strong>Green Jobs:</strong> {newspaper.stats.jobs}</div>
                    <div><strong>Air Quality:</strong> {newspaper.stats.airQuality}</div>
                    <div><strong>Emissions:</strong> {newspaper.stats.emissions}</div>
                  </div>
                </div>

                {/* Headlines */}
                <div className="mb-6">
                  <div className="font-bold text-lg mb-3 border-b border-gray-600">Other Headlines</div>
                  <ul className="space-y-2">
                    {newspaper.headlines.map((headline: string, idx: number) => (
                      <li key={idx} className="text-sm border-l-4 border-gray-600 pl-3 py-1">
                        {headline}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Side Stories */}
                {newspaper.sideStories.length > 0 && (
                  <div>
                    <div className="font-bold text-lg mb-3 border-b border-gray-600">Related Coverage</div>
                    <div className="grid grid-cols-1 gap-4">
                      {newspaper.sideStories.map((story: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-blue-600 pl-3">
                          <div className="font-bold text-sm">{story.title}</div>
                          <div className="text-xs italic text-gray-700">{story.excerpt}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Newspaper className="size-16 mx-auto mb-3 opacity-30" />
                  <p>Run simulation to generate newspaper</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
