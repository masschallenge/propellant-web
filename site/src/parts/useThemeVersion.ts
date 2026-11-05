import { useEffect, useState } from 'react';

export const useThemeVersion = () => {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((current) => current + 1);
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    query?.addEventListener('change', bump);
    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => {
      query?.removeEventListener('change', bump);
      observer.disconnect();
    };
  }, []);
  return version;
};
