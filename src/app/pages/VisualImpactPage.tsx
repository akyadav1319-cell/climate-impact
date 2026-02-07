import { useNavigate } from 'react-router';
import { Upload, ArrowLeft } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export function VisualImpactPage() {
  const navigate = useNavigate();
  const { uploadedImage, setUploadedImage, outputImage, isGenerated } = useSimulation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <h1 className="text-3xl mb-2">🖼️ Visual Impact Simulation</h1>
        <p className="text-gray-600">Compare current state with 10-year projected transformation</p>
      </div>

      {/* Image Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Input Image */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl mb-4">Current State (2026)</h2>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Current state" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3 p-8 text-center w-full h-full justify-center">
                <Upload className="size-16 text-gray-400" />
                <span className="text-lg text-gray-500">Click to upload</span>
                <span className="text-sm text-gray-400">Upload a city or landscape image</span>
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
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm mb-2">Current Conditions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Urban pollution levels at baseline</li>
              <li>• Conventional infrastructure</li>
              <li>• High carbon emissions</li>
              <li>• Limited green spaces</li>
            </ul>
          </div>
        </div>

        {/* Output Image */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl mb-4">Projected Future (2036)</h2>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-green-300 flex items-center justify-center">
            {outputImage && isGenerated ? (
              <div className="relative w-full h-full">
                <img src={outputImage} alt="Projected future" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/25 to-blue-500/25 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-4 left-4 bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
                  After 10 Years of Climate Policies
                </div>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-4 py-2 rounded-lg">
                  Year 2036
                </div>
                
                {/* Impact indicators */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Cleaner air</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>More green spaces</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Sustainable transport</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <div className="text-4xl mb-4">🌍</div>
                <p className="text-lg mb-2">No projection available</p>
                <p className="text-sm">
                  {!isGenerated 
                    ? "Generate a simulation first to see the projected transformation"
                    : "Upload an image to visualize the transformation"}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm mb-2 text-green-800">Projected Improvements:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Significantly reduced air pollution</li>
              <li>• Renewable energy infrastructure visible</li>
              <li>• Expanded urban forests and parks</li>
              <li>• Electric vehicle charging stations</li>
              <li>• Green buildings and solar panels</li>
              <li>• Enhanced public transportation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Info */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl mb-4">Understanding the Transformation</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-sm mb-2">Environmental Changes</h3>
            <p className="text-sm text-gray-600">
              The greenish overlay represents improved air quality, increased vegetation, and overall environmental health. 
              Cities become more livable with expanded parks and urban forests.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-sm mb-2">Infrastructure Evolution</h3>
            <p className="text-sm text-gray-600">
              Buildings integrate solar panels and green roofs. Streets accommodate electric vehicles and enhanced public transit. 
              Smart infrastructure optimizes energy and resource use.
            </p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-sm mb-2">Quality of Life</h3>
            <p className="text-sm text-gray-600">
              Cleaner air means healthier populations. Reduced noise from electric vehicles. More recreational green spaces. 
              Sustainable urban design improves mental and physical well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
