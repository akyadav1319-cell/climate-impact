import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './app/routes';
import { SimulationProvider } from './app/context/SimulationContext';


import './styles/index.css';
document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimulationProvider>
      <RouterProvider router={router} />
    </SimulationProvider>
  </React.StrictMode>
);
function startClock() {
  const el = document.getElementById('live-clock');

  if (!el) {
    requestAnimationFrame(startClock);
    return;
  }

  setInterval(() => {
    el.textContent = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, 1000);
}

startClock();

