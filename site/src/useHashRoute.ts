import { useEffect, useState } from 'react';

const readHash = (fallback: string) => {
  const hash = window.location.hash.replace(/^#/, '');
  return /^[a-z0-9-]+$/.test(hash) ? hash : fallback;
};

export const useHashRoute = (fallback: string) => {
  const [route, setRoute] = useState(() => readHash(fallback));
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(readHash(fallback));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [fallback]);
  return route;
};
