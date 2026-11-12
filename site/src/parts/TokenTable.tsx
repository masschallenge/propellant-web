import type { CSSProperties } from 'react';
import { Table } from '../../../src/index';
import type { TokenEntry } from '../../tooling/tokens';
import { referencesPrimitive } from './primitives';

const isColorValue = (value: string) =>
  /^(#|rgb|hsl|color-mix|oklch|linear-gradient)/i.test(value) || referencesPrimitive(value);

const previewFor = (token: TokenEntry) => {
  const value = token.values[0]?.value ?? '';
  const style = (property: string) => ({ [property]: `var(${token.name})` }) as CSSProperties;
  if (token.name.startsWith('--shadow')) {
    return (
      <span
        style={style('boxShadow')}
        className="block w-8 h-6 rounded-[var(--corner-sm)] bg-[var(--bg-elevated)]"
      />
    );
  }
  if (token.name.startsWith('--corner')) {
    return <span style={style('borderRadius')} className="block w-8 h-6 bg-[var(--fill)]" />;
  }
  if (
    isColorValue(value) ||
    /^--(label|bg|fill|tint|critical|warning|success|separator|on-|highlight|masquerade|brand|scrim|focus-color|control-border|control-thumb)/.test(
      token.name,
    )
  ) {
    return (
      <span
        style={style('background')}
        className="block w-8 h-6 rounded-[var(--corner-sm)] shadow-[inset_0_0_0_var(--hairline)_var(--separator)]"
      />
    );
  }
  return null;
};

export const TokenTable = ({ tokens, caption }: { tokens: TokenEntry[]; caption: string }) => (
  <div className="min-w-0 overflow-x-auto">
    <Table
      caption={caption}
      size="sm"
      rows={tokens}
      rowId={(token) => token.name}
      columns={[
        {
          key: 'preview',
          header: <span className="sr-only">Preview</span>,
          width: '56px',
          cell: (token) => previewFor(token),
        },
        {
          key: 'name',
          header: 'Token',
          cell: (token) => (
            <code className="font-[family-name:var(--type-family-mono)] text-footnote text-[var(--label)] whitespace-nowrap">
              {token.name}
            </code>
          ),
        },
        {
          key: 'values',
          header: 'Value',
          cell: (token) => (
            <span className="flex flex-col gap-0.5 min-w-0">
              {token.values.map((entry) => (
                <span key={entry.condition} className="flex flex-wrap gap-x-2 text-footnote">
                  <code className="font-[family-name:var(--type-family-mono)] text-[var(--label)] [overflow-wrap:anywhere]">
                    {entry.value}
                  </code>
                  {entry.condition === 'default' ? null : (
                    <span className="text-[var(--label-tertiary)]">{entry.condition}</span>
                  )}
                </span>
              ))}
            </span>
          ),
        },
      ]}
    />
  </div>
);
