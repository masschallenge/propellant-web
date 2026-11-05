import * as React from 'react';

const draw = (path: string) => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d={path}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const icons: Record<string, React.ReactNode> = {
  none: undefined,
  arrow: draw('M4 10h12M11 5l5 5-5 5'),
  plus: draw('M10 4v12M4 10h12'),
  check: draw('M4 10l4 4 8-8'),
  search: draw('M9 15A6 6 0 109 3a6 6 0 000 12zM17 17l-3.5-3.5'),
  trash: draw('M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10'),
  close: draw('M5 5l10 10M15 5L5 15'),
  chevron: draw('M8 5l5 5-5 5'),
  person: draw(
    'M10 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3.5 17c1-3 3.5-4.5 6.5-4.5s5.5 1.5 6.5 4.5',
  ),
  calendar: draw('M4 6h12v10H4zM4 9h12M7 4v3M13 4v3'),
  star: draw('M10 3l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 13.8 5.8 16l.8-4.7L3.2 8l4.7-.7z'),
};

export const iconOptions = Object.keys(icons);
