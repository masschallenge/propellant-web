import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './site.css';
import { App } from './App';
import icon from '../../assets/brand/propellant-icon.svg';

const container = document.getElementById('root');

if (container) {
  document.body.setAttribute('data-propellant', '');
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = icon;
  document.head.append(favicon);
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
