import * as React from 'react';

const base: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-3, 12px)',
  flexWrap: 'wrap',
  alignItems: 'center',
};

export const HStack = ({ children }: { children: React.ReactNode }) => (
  <div style={base}>{children}</div>
);

export const VStack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ ...base, flexDirection: 'column', alignItems: 'stretch' }}>{children}</div>
);

export const field = (Story: React.ComponentType) => (
  <div style={{ width: 'min(360px, 100%)' }}>
    <Story />
  </div>
);
