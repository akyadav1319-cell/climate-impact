import { useNavigate } from 'react-router';
import { ArrowLeft, Newspaper as NewspaperIcon } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function NewspaperPage() {
  const navigate = useNavigate();
  const { newspaper, isGenerated } = useSimulation();

  if (!isGenerated || !newspaper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">No Newspaper Available</h2>
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
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
        >
          <ArrowLeft className="size-5" />
          Back to Policies
        </button>
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <NewspaperIcon className="size-8" />
          Future Headlines
        </h1>
        <p className="text-gray-600">The Global Times - February 7, 2036 • Ten Years After Implementation</p>
      </div>

      {/* Newspaper */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="border-8 border-gray-800 bg-amber-50">
          <div className="p-8">
            {/* Newspaper Masthead */}
            <div className="text-center mb-8 border-b-4 border-gray-800 pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide">Vol. CCXXVI • No. 3,650</div>
                <div className="text-xs">February 7, 2036</div>
                <div className="text-xs">$3.50</div>
              </div>
              <div className="font-serif text-6xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                The Global Times
              </div>
              <div className="text-sm italic border-t border-b border-gray-400 py-1">
                "All the News That Shapes Tomorrow"
              </div>
            </div>

            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl md:text-5xl mb-4 leading-tight border-b-4 border-gray-800 pb-3" 
                  style={{ fontFamily: 'Georgia, serif' }}>
                {newspaper.headline}
              </h1>
              <h2 className="text-xl italic text-gray-700 mb-6 border-b-2 border-gray-400 pb-4">
                {newspaper.subheadline}
              </h2>
              
              {/* Main Story - Two Column Layout */}
              <div className="text-sm leading-relaxed font-serif columns-2 gap-8" 
                   style={{ fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
                {newspaper.mainStory}
              </div>
            </div>

            {/* Stats Box */}
            <div className="bg-gradient-to-r from-blue-100 to-green-100 border-4 border-gray-800 p-6 mb-8">
              <div className="text-center font-bold text-2xl mb-4 uppercase tracking-wide">
                By The Numbers: A Decade of Change
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{newspaper.stats.temperature}</div>
                  <div className="text-sm uppercase tracking-wide">Global Temp. Rise</div>
                  <div className="text-xs text-gray-600 mt-1">vs. Pre-Industrial</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{newspaper.stats.jobs}</div>
                  <div className="text-sm uppercase tracking-wide">Green Jobs</div>
                  <div className="text-xs text-gray-600 mt-1">Created Nationwide</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{newspaper.stats.airQuality}</div>
                  <div className="text-sm uppercase tracking-wide">Air Quality</div>
                  <div className="text-xs text-gray-600 mt-1">Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">{newspaper.stats.emissions}</div>
                  <div className="text-sm uppercase tracking-wide">Emissions Cut</div>
                  <div className="text-xs text-gray-600 mt-1">Since 2026</div>
                </div>
              </div>
            </div>

            {/* Main Headlines Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="font-bold text-xl mb-4 border-b-2 border-gray-600 pb-2 uppercase">
                  Breaking Headlines
                </div>
                <div className="space-y-3">
                  {newspaper.headlines.slice(0, Math.ceil(newspaper.headlines.length / 2)).map((headline: string, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50">
                      <p className="text-sm font-semibold">{headline}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-bold text-xl mb-4 border-b-2 border-gray-600 pb-2 uppercase">
                  Continued Coverage
                </div>
                <div className="space-y-3">
                  {newspaper.headlines.slice(Math.ceil(newspaper.headlines.length / 2)).map((headline: string, idx: number) => (
                    <div key={idx} className="border-l-4 border-green-600 pl-4 py-2 bg-green-50">
                      <p className="text-sm font-semibold">{headline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Stories */}
            {newspaper.sideStories && newspaper.sideStories.length > 0 && (
              <div className="mb-8">
                <div className="font-bold text-xl mb-4 border-b-2 border-gray-600 pb-2 uppercase">
                  Special Reports
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {newspaper.sideStories.map((story: any, idx: number) => (
                    <div key={idx} className="border-2 border-gray-400 p-4 bg-yellow-50">
                      <h3 className="font-bold text-base mb-2">{story.title}</h3>
                      <p className="text-sm italic text-gray-700 leading-snug">{story.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opinion/Editorial */}
            {newspaper.opinion && (
              <div className="bg-gray-100 border-4 border-gray-600 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="font-bold text-2xl uppercase tracking-wide">Editorial</div>
                  <div className="flex-1 h-px bg-gray-600"></div>
                </div>
                <p className="font-serif text-sm leading-relaxed italic" style={{ fontFamily: 'Georgia, serif', textAlign: 'justify' }}>
                  {newspaper.opinion}
                </p>
                <div className="text-right text-xs mt-4 text-gray-600">
                  — The Editorial Board
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-white p-4">
            <div className="flex items-center justify-between text-xs">
              <div>© 2036 The Global Times • All Rights Reserved</div>
              <div>Printing on 100% Recycled Paper • Carbon Neutral Publication</div>
              <div>globaltimes.earth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Note */}
      <div className="max-w-6xl mx-auto mt-6 bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> This newspaper represents a simulated future based on your selected climate policies. 
          Headlines and stories are generated to reflect the projected environmental, economic, and social impacts 
          of your policy choices over a 10-year period.
        </p>
      </div>
    </div>
  );
}
