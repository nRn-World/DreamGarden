import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/backdrop.css';
import './styles/garden.css';
import './styles/screens.css';
import './styles/sheets.css';
import './styles/night.css';
import './styles/onboarding.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
