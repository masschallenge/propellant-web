import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { contrastRatio, formatRatio, parseColor, toHex } from './contrast';
import { useThemeVersion } from './useThemeVersion';

export type RoleKind = 'text' | 'surface' | 'fill' | 'line' | 'solid';

export interface ColorRole {
  name: string;
  use: string;
  kind: RoleKind;
  on?: string;
  minimum?: number;
}

const THEMES = ['light', 'dark'] as const;

const tokenStyle = (property: string, token: string) =>
  ({ [property]: `var(${token})` }) as CSSProperties;

const Measurement = ({ role, theme }: { role: ColorRole; theme: string }) => {
  const sampleRef = useRef<HTMLSpanElement>(null);
  const groundRef = useRef<HTMLSpanElement>(null);
  const themeVersion = useThemeVersion();
  const [reading, setReading] = useState<{ hex: string; ratio: string; passes: boolean } | null>(
    null,
  );

  useLayoutEffect(() => {
    if (!sampleRef.current || !groundRef.current) return;
    const sampleStyle = getComputedStyle(sampleRef.current);
    const groundStyle = getComputedStyle(groundRef.current);
    const sample = parseColor(
      role.kind === 'text' || role.kind === 'solid'
        ? sampleStyle.color
        : sampleStyle.backgroundColor,
    );
    const ground = parseColor(groundStyle.backgroundColor);
    if (!sample || !ground) return;
    const ratio = contrastRatio(sample, ground);
    setReading({
      hex:
        sample.alpha < 1 ? `${toHex(sample)} at ${Math.round(sample.alpha * 100)}%` : toHex(sample),
      ratio: formatRatio(ratio),
      passes: role.minimum === undefined || ratio >= role.minimum,
    });
  }, [role, themeVersion]);

  const groundToken = role.kind === 'solid' ? role.name : (role.on ?? '--bg');
  const sampleProperty = role.kind === 'text' || role.kind === 'solid' ? 'color' : 'background';
  const sampleToken = role.kind === 'solid' ? (role.on ?? '--on-tint') : role.name;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span data-theme={theme} className="flex-none inline-flex">
        <span
          ref={groundRef}
          style={tokenStyle('background', groundToken)}
          className="flex-none inline-flex items-center justify-center w-16 h-11 rounded-[var(--corner-md)] shadow-[inset_0_0_0_var(--hairline)_var(--separator)]"
        >
          <span
            ref={sampleRef}
            style={tokenStyle(sampleProperty, sampleToken)}
            className={
              role.kind === 'text' || role.kind === 'solid'
                ? 'text-headline'
                : role.kind === 'line'
                  ? 'block w-10 h-[3px] rounded-full'
                  : 'block w-10 h-7 rounded-[var(--corner-sm)]'
            }
          >
            {role.kind === 'text' || role.kind === 'solid' ? 'Aa' : null}
          </span>
        </span>
      </span>
      <span className="flex flex-col min-w-0 text-footnote tabular-nums">
        <span className="text-[var(--label-secondary)]">{reading?.hex ?? ' '}</span>
        {role.kind !== 'surface' && role.kind !== 'fill' && reading ? (
          <span className={reading.passes ? 'text-[var(--label)]' : 'text-[var(--critical)]'}>
            {reading.ratio}
            {role.minimum
              ? reading.passes
                ? `, meets ${role.minimum}:1`
                : `, below ${role.minimum}:1`
              : ''}
          </span>
        ) : null}
      </span>
    </div>
  );
};

export const ColorBoard = ({ roles, caption }: { roles: ColorRole[]; caption: string }) => (
  <div className="flex flex-col gap-2 min-w-0">
    <div className="overflow-x-auto rounded-[var(--corner-lg)] bg-[var(--bg)]">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-subheadline font-medium text-[var(--label-tertiary)]">
            <th scope="col" className="h-[var(--row-dense)] pl-4 pr-3 font-medium">
              Role
            </th>
            {THEMES.map((theme) => (
              <th key={theme} scope="col" className="px-3 font-medium capitalize">
                {theme}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.name}
              className="border-t-[length:var(--hairline)] border-solid border-[var(--separator)] border-0"
            >
              <th scope="row" className="py-3 pl-4 pr-3 align-top font-normal">
                <span className="flex flex-col gap-0.5">
                  <code className="text-callout font-semibold text-[var(--label)] font-[family-name:var(--type-family-mono)]">
                    {role.name}
                  </code>
                  <span className="text-subheadline text-[var(--label-secondary)]">{role.use}</span>
                </span>
              </th>
              {THEMES.map((theme) => (
                <td key={theme} className="py-3 px-3 align-top">
                  <Measurement role={role} theme={theme} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="m-0 text-footnote text-[var(--label-tertiary)]">
      Hex values and ratios are measured from the live tokens in this page, in both themes.
    </p>
  </div>
);
