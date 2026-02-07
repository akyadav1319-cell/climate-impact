import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SimulationProvider } from './context/SimulationContext';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SimulationProvider>
        <RouterProvider router={router} />
      </SimulationProvider>
    </ThemeProvider>
  );
}