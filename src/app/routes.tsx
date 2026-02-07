import { createBrowserRouter } from 'react-router';
import { DashboardPage2 } from './pages/DashboardPage2';
import { DashboardPage } from './pages/DashboardPage';
import { VisualImpactPage } from './pages/VisualImpactPage';
import { TimelinePage } from './pages/TimelinePage';
import { NewspaperPage } from './pages/NewspaperPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage2 />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/visual-impact',
    element: <VisualImpactPage />,
  },
  {
    path: '/timeline',
    element: <TimelinePage />,
  },
  {
    path: '/newspaper',
    element: <NewspaperPage />,
  },
]);
