import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './site.css';
import { App } from './App';
import { addFaviconLinks } from './favicons';

const container = document.getElementById('root');

if (container) {
  document.body.setAttribute('data-propellant', '');
  addFaviconLinks(document.head);
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
