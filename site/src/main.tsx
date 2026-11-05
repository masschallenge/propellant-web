import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './site.css';
import { App } from './App';

const container = document.getElementById('root');

if (container) {
  document.body.setAttribute('data-propellant', '');
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
