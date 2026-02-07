import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, TrendingUp, Target } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function TimelinePage() {
  const navigate = useNavigate();
  const { timelineData, isGenerated } = useSimulation();

  if (!isGenerated || !timelineData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No Timeline Data Available</h2>
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

  const timelinePoints = [
    { data: timelineData.year1, color: 'blue', year: '2027' },
    { data: timelineData.year5, color: 'green', year: '2031' },
    { data: timelineData.year10, color: 'purple', year: '2036' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="size-5" />
          Back to Policies
        </button>
        <h1 className="text-3xl mb-2">⏱️ Impact Timeline</h1>
        <p className="text-gray-600">Detailed year-by-year analysis of policy impacts (1, 5, and 10 years)</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-green-400 to-purple-400"></div>

        {/* Timeline points */}
        <div className="space-y-12">
          {timelinePoints.map((point, index) => (
            <div key={index} className="relative pl-20">
              {/* Timeline dot */}
              <div className={`absolute left-4 top-4 size-9 rounded-full bg-${point.color}-500 border-4 border-white shadow-lg flex items-center justify-center z-10`}
                   style={{ 
                     backgroundColor: point.color === 'blue' ? '#3b82f6' : point.color === 'green' ? '#22c55e' : '#a855f7'
                   }}>
                <span className="text-white text-xs">{index + 1}</span>
              </div>

              {/* Timeline label */}
              <div className="absolute left-14 top-0 bg-white px-3 py-1 rounded-full shadow-md border-2"
                   style={{ 
                     borderColor: point.color === 'blue' ? '#3b82f6' : point.color === 'green' ? '#22c55e' : '#a855f7'
                   }}>
                <span className="text-sm">Year {index === 0 ? '1' : index === 1 ? '5' : '10'}</span>
              </div>

              {/* Content card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-2"
                   style={{ 
                     borderColor: point.color === 'blue' ? '#3b82f6' : point.color === 'green' ? '#22c55e' : '#a855f7'
                   }}>
                <h2 className="text-2xl mb-4">{point.data.title}</h2>

                {/* Impacts */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg mb-3">
                    <TrendingUp className="size-5 text-green-600" />
                    Key Impacts
                  </h3>
                  <ul className="space-y-2">
                    {point.data.impacts.map((impact: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 text-lg mb-3">
                    <CheckCircle className="size-5 text-blue-600" />
                    Major Achievements
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {point.data.achievements.map((achievement: string, idx: number) => (
                      <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg mb-3">
                    <Target className="size-5 text-orange-600" />
                    Challenges Addressed
                  </h3>
                  <ul className="space-y-2">
                    {point.data.challenges.map((challenge: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-600 italic">
                        <span className="text-orange-500 mt-1">→</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl mb-4">10-Year Transformation Summary</h2>
        <p className="text-lg leading-relaxed">
          Over the course of a decade, comprehensive climate policies have fundamentally transformed environmental, 
          economic, and social systems. From initial infrastructure deployment to complete ecosystem transformation, 
          each phase built upon the last, creating compounding benefits that exceeded initial projections. The journey 
          from Year 1's foundation-building to Year 10's maturity demonstrates that sustained commitment to climate 
          action delivers measurable, life-changing results.
        </p>
      </div>
    </div>
  );
}
