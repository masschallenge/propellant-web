import { beforeAll } from 'vitest';

beforeAll(() => {
  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (anchor && anchor.getAttribute('href')) event.preventDefault();
    },
    true,
  );
  document.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
    },
    true,
  );
});

beforeAll(() => {
  try {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.resolve(), readText: () => Promise.resolve('') },
    });
  } catch {}
});
