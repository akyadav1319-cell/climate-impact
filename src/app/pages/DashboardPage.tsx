import { useNavigate } from 'react-router';
import { Home, LineChart, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { ArrowLeft } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { chartData, isGenerated } = useSimulation();

  if (!isGenerated || chartData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Please generate a simulation first</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Go to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="size-5" />
            Back to Policies
          </button>
          <h1 className="text-3xl mb-2">📊 10-Year Impact Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and projections (2026-2036)</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* CO2 Emissions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-red-100 text-red-600 p-2 rounded-lg">💨</span>
            CO₂ Emissions Trend
          </h3>
          <p className="text-sm text-gray-600 mb-4">Index: 100 = Current Levels</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="co2Emissions" stroke="#ef4444" fill="#fca5a5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Air Quality */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg">🌬️</span>
            Air Quality Index
          </h3>
          <p className="text-sm text-gray-600 mb-4">Higher = Better Air Quality</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="airQuality" stroke="#10b981" fill="#86efac" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* EV & Renewable */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">⚡</span>
            EV Adoption & Renewable Energy
          </h3>
          <p className="text-sm text-gray-600 mb-4">Percentage of Total Market</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="evAdoption" stroke="#3b82f6" strokeWidth={3} name="EV Adoption" />
              <Line type="monotone" dataKey="renewableEnergy" stroke="#f59e0b" strokeWidth={3} name="Renewable Energy" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Green Jobs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">💼</span>
            Green Jobs Created
          </h3>
          <p className="text-sm text-gray-600 mb-4">Thousands of New Positions</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="greenJobs" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">🌡️</span>
            Global Temperature Rise
          </h3>
          <p className="text-sm text-gray-600 mb-4">Degrees Celsius Above Pre-Industrial</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 2]} />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tree Cover & Transit */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 p-2 rounded-lg">🌳</span>
            Tree Cover & Public Transit
          </h3>
          <p className="text-sm text-gray-600 mb-4">Percentage Coverage/Usage</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="treeCover" stroke="#22c55e" strokeWidth={3} name="Tree Cover" />
              <Line type="monotone" dataKey="publicTransportUsage" stroke="#06b6d4" strokeWidth={3} name="Public Transit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">{chartData[chartData.length - 1]?.temperature.toFixed(2)}°C</div>
          <div className="text-sm text-gray-600">Final Temperature (2036)</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">{chartData[chartData.length - 1]?.greenJobs.toFixed(0)}K</div>
          <div className="text-sm text-gray-600">Green Jobs by 2036</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">-{(100 - chartData[chartData.length - 1]?.co2Emissions).toFixed(0)}%</div>
          <div className="text-sm text-gray-600">CO₂ Reduction</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl mb-2">+{(chartData[chartData.length - 1]?.airQuality - 50).toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Air Quality Improvement</div>
        </div>
      </div>
    </div>
  );
}
