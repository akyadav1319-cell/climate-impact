import { createContext, useContext, useState, ReactNode } from 'react';

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

interface SimulationContextType {
  policies: PolicyValues;
  setPolicies: (policies: PolicyValues) => void;
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  outputImage: string | null;
  setOutputImage: (image: string | null) => void;
  chartData: any[];
  setChartData: (data: any[]) => void;
  newspaper: any;
  setNewspaper: (news: any) => void;
  timelineData: any;
  setTimelineData: (data: any) => void;
  isGenerated: boolean;
  setIsGenerated: (value: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
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
  const [chartData, setChartData] = useState<any[]>([]);
  const [newspaper, setNewspaper] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  return (
    <SimulationContext.Provider
      value={{
        policies,
        setPolicies,
        uploadedImage,
        setUploadedImage,
        outputImage,
        setOutputImage,
        chartData,
        setChartData,
        newspaper,
        setNewspaper,
        timelineData,
        setTimelineData,
        isGenerated,
        setIsGenerated,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
