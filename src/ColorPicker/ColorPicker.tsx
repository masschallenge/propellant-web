import * as React from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton/IconButton';

export interface ColorPickerSwatch {
  color: string;
  label?: string;
}

export type ColorPickerVariant =
  'full' | 'swatch-picker' | 'swatch-card' | 'minimal' | 'hue' | 'alpha' | 'palette';

export type ColorPickerSwatchSize = 'sm' | 'md' | 'lg';

export interface ColorPickerFooterLink {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  swatches?: (string | ColorPickerSwatch)[];
  withAlpha?: boolean;
  onClose?: () => void;
  variant?: ColorPickerVariant;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  format?: string;
  formats?: string[];
  onFormatChange?: (format: string) => void;
  showFormat?: boolean;
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  showOpacity?: boolean;
  hue?: number;
  onHueChange?: (hue: number) => void;
  savedLabel?: string;
  onAddSwatch?: (() => void) | null;
  swatchSize?: ColorPickerSwatchSize;
  title?: string;
  subtitle?: string;
  footerLinks?: ColorPickerFooterLink[];
  className?: string;
}

const BRAND_SWATCHES: ColorPickerSwatch[] = [
  { color: 'var(--teal-900)', label: 'Deep teal' },
  { color: 'var(--teal-400)', label: 'Bright teal' },
  { color: 'var(--green-500)', label: 'Lime' },
  { color: 'var(--magenta-600)', label: 'Magenta' },
  { color: 'var(--orange-500)', label: 'Mustard' },
  { color: 'var(--orange-500)', label: 'Orange' },
];

const HUE_SPECTRUM = 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';

const CHECKERBOARD: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,var(--separator) 25%,transparent 25%),linear-gradient(-45deg,var(--separator) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,var(--separator) 75%),linear-gradient(-45deg,transparent 75%,var(--separator) 75%)',
  backgroundSize: '10px 10px',
  backgroundPosition: '0 0,0 5px,5px -5px,-5px 0',
};

const PALETTE_HUES = [6, 28, 45, 95, 140, 174, 190, 260, 320, 345];
const PALETTE_LIGHTNESS = [92, 80, 66, 52, 40, 28];

const SWATCH_SIZES: Record<ColorPickerSwatchSize, string> = {
  sm: 'w-4.5 h-4.5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const joinClasses = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

const FOCUS_RING =
  'focus-visible:outline-[length:var(--focus-width)] focus-visible:outline-solid focus-visible:outline-offset-[var(--focus-offset)] focus-visible:outline-[var(--focus-color)]';

const SWATCH_EDGE = 'shadow-[inset_0_0_0_1px_var(--separator)]';

const SELECTED_RING = 'shadow-[0_0_0_2px_var(--bg-elevated),0_0_0_4px_var(--tint)]';

const READOUT =
  'flex items-center min-h-[var(--control-md)] px-2.5 rounded-[var(--corner-md)] bg-[var(--bg)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] font-[family-name:var(--type-family-mono)] text-callout tabular-nums text-[var(--label)]';

const OVERLAY = 'rounded-[var(--corner-lg)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)]';

const clamp = (amount: number, lower: number, upper: number) =>
  Math.max(lower, Math.min(upper, amount));

const CheckMark = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3 text-[var(--gray-0)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const SliderThumb = ({ left }: { left: string }) => (
  <span
    aria-hidden="true"
    className="absolute top-1/2 z-[2] w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gray-0)] shadow-[var(--shadow-thumb)]"
    style={{ left }}
  />
);

const ColorDot = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    className={joinClasses(SWATCH_SIZES.md, 'flex-none rounded-full', SWATCH_EDGE)}
    style={{ background: color }}
  />
);

export const ColorPicker = ({
  value,
  defaultValue = '#0FACBD',
  onChange,
  swatches = BRAND_SWATCHES,
  withAlpha = true,
  onClose,
  variant = 'full',
  tabs = ['Solid', 'Gradient', 'Image'],
  activeTab,
  onTabChange,
  format,
  formats = ['Hex', 'RGB', 'HSL'],
  onFormatChange,
  showFormat = true,
  opacity,
  onOpacityChange,
  showOpacity = true,
  hue,
  onHueChange,
  savedLabel = 'Saved',
  onAddSwatch,
  swatchSize = 'md',
  title,
  subtitle,
  footerLinks,
  className,
}: ColorPickerProps) => {
  const [internalColor, setInternalColor] = React.useState(defaultValue);
  const color = value === undefined ? internalColor : value;
  const [internalTab, setInternalTab] = React.useState(tabs[0]);
  const currentTab = activeTab === undefined ? internalTab : activeTab;
  const [internalFormat, setInternalFormat] = React.useState(formats[0]);
  const currentFormat = format === undefined ? internalFormat : format;
  const [isFormatOpen, setIsFormatOpen] = React.useState(false);
  const [internalOpacity, setInternalOpacity] = React.useState(100);
  const currentOpacity = opacity === undefined ? internalOpacity : opacity;
  const [internalHue, setInternalHue] = React.useState(184);
  const currentHue = hue === undefined ? internalHue : hue;
  const formatMenuRef = React.useRef<HTMLDivElement>(null);
  const swatchList: ColorPickerSwatch[] = swatches.map((swatch) =>
    typeof swatch === 'string' ? { color: swatch } : swatch,
  );

  const chooseColor = (nextColor: string) => {
    if (value === undefined) setInternalColor(nextColor);
    onChange?.(nextColor);
  };

  const chooseOpacity = (nextOpacity: number) => {
    const bounded = clamp(nextOpacity, 0, 100);
    if (opacity === undefined) setInternalOpacity(bounded);
    onOpacityChange?.(bounded);
  };

  const chooseHue = (nextHue: number) => {
    const wrapped = ((nextHue % 360) + 360) % 360;
    if (hue === undefined) setInternalHue(wrapped);
    onHueChange?.(wrapped);
  };

  React.useEffect(() => {
    if (!isFormatOpen) return;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(event.target as Node))
        setIsFormatOpen(false);
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [isFormatOpen]);

  const handleSliderKeyDown =
    (current: number, maximum: number, apply: (next: number) => void) =>
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const stepSize = event.shiftKey ? 10 : 1;
      const moves: Record<string, number> = {
        ArrowLeft: -stepSize,
        ArrowDown: -stepSize,
        ArrowRight: stepSize,
        ArrowUp: stepSize,
      };
      if (event.key in moves) {
        event.preventDefault();
        apply(current + moves[event.key]);
      } else if (event.key === 'Home') {
        event.preventDefault();
        apply(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        apply(maximum);
      }
    };

  const sliderTrackClasses = (isFlexible: boolean) =>
    joinClasses(
      isFlexible && 'flex-1',
      'relative h-3 rounded-full shadow-[inset_0_0_0_1px_var(--separator)]',
      FOCUS_RING,
    );

  const hueTrack = (isFlexible = false) => (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={currentHue}
      onKeyDown={handleSliderKeyDown(currentHue, 360, chooseHue)}
      className={sliderTrackClasses(isFlexible)}
      style={{ background: HUE_SPECTRUM }}
    >
      <SliderThumb left={`${(currentHue / 360) * 100}%`} />
    </div>
  );

  const alphaTrack = (isFlexible = false, accessibleName = 'Opacity') => (
    <div
      role="slider"
      tabIndex={0}
      aria-label={accessibleName}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={currentOpacity}
      onKeyDown={handleSliderKeyDown(currentOpacity, 100, chooseOpacity)}
      className={sliderTrackClasses(isFlexible)}
      style={CHECKERBOARD}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{ background: `linear-gradient(to right, transparent, ${color})` }}
      />
      <SliderThumb left={`${currentOpacity}%`} />
    </div>
  );

  const renderSwatch = (swatch: ColorPickerSwatch, size: ColorPickerSwatchSize, index: number) => {
    const isChosen = color === swatch.color;
    return (
      <button
        key={index}
        type="button"
        aria-label={swatch.label || `Use ${swatch.color}`}
        aria-pressed={isChosen}
        onClick={() => chooseColor(swatch.color)}
        style={{ background: swatch.color }}
        className={joinClasses(
          'relative inline-flex items-center justify-center p-0 border-0 rounded-full cursor-pointer',
          SWATCH_SIZES[size],
          isChosen ? SELECTED_RING : SWATCH_EDGE,
          FOCUS_RING,
        )}
      >
        {isChosen ? <CheckMark /> : null}
      </button>
    );
  };

  const addSwatchButton =
    onAddSwatch === null ? null : (
      <button
        type="button"
        aria-label="Add current color"
        onClick={onAddSwatch}
        className={joinClasses(
          'inline-flex items-center justify-center p-0 border-0 rounded-full cursor-pointer bg-[var(--fill-secondary)] text-[var(--label-secondary)] hover:bg-[var(--fill)]',
          SWATCH_SIZES[swatchSize],
          FOCUS_RING,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    );

  const swatchRow = (size: ColorPickerSwatchSize, accessibleName: string, hasAdd: boolean) => (
    <div role="group" aria-label={accessibleName} className="flex flex-wrap items-center gap-2">
      {swatchList.map((swatch, index) => renderSwatch(swatch, size, index))}
      {hasAdd ? addSwatchButton : null}
    </div>
  );

  const formatMenu = showFormat ? (
    <div className="relative flex-none" ref={formatMenuRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isFormatOpen}
        aria-label="Color format"
        onClick={() => setIsFormatOpen(!isFormatOpen)}
        className={joinClasses(
          'inline-flex items-center gap-1 min-h-[var(--control-md)] px-2.5 border-0 rounded-[var(--corner-md)] cursor-pointer font-[inherit] text-callout font-medium text-[var(--label)] bg-[var(--bg)] shadow-[inset_0_0_0_var(--hairline)_var(--control-border)] hover:bg-[var(--bg-secondary)]',
          FOCUS_RING,
        )}
      >
        {currentFormat}
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-[var(--label-tertiary)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isFormatOpen ? (
        <ul
          role="listbox"
          aria-label="Color format"
          className={joinClasses(
            'absolute top-[calc(100%+var(--space-1))] left-0 z-[var(--layer-dropdown)] min-w-24 m-0 p-1 list-none',
            OVERLAY,
          )}
        >
          {formats.map((formatOption) => {
            const isChosen = formatOption === currentFormat;
            return (
              <li key={formatOption}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isChosen}
                  onClick={() => {
                    if (format === undefined) setInternalFormat(formatOption);
                    onFormatChange?.(formatOption);
                    setIsFormatOpen(false);
                  }}
                  className={joinClasses(
                    'flex items-center gap-1.5 w-full min-h-[var(--control-sm)] px-2 border-0 rounded-[var(--corner-md)] cursor-pointer text-left font-[inherit] text-callout bg-transparent text-[var(--label)] hover:bg-[var(--tint)] hover:text-[var(--on-tint)]',
                    isChosen ? 'font-semibold' : 'font-normal',
                    FOCUS_RING,
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={joinClasses('flex-none w-3.5 h-3.5', !isChosen && 'invisible')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {formatOption}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  ) : null;

  const colorValueField = (
    <label className="propellant-field flex-1 min-w-0 items-center min-h-[var(--control-md)] px-2.5">
      <input
        value={color}
        onChange={(event) => chooseColor(event.target.value)}
        aria-label={`${currentFormat} value`}
        className="w-full min-w-0 border-0 bg-transparent outline-none font-[family-name:var(--type-family-mono)] text-callout text-[var(--label)]"
      />
      <span className="propellant-field-ring" aria-hidden="true" />
    </label>
  );

  const opacityReadout = showOpacity ? (
    <span
      aria-label="Opacity percent"
      className={joinClasses('flex-none justify-between w-16', READOUT)}
    >
      {currentOpacity}
      <span className="text-[var(--label-tertiary)]">%</span>
    </span>
  ) : null;

  const valueRow = (
    <div className="flex gap-2">
      {formatMenu}
      {colorValueField}
      {opacityReadout}
    </div>
  );

  const savedSection = (
    <div>
      <div className="mb-2 text-subheadline font-medium text-[var(--label-secondary)]">
        {savedLabel}
      </div>
      {swatchRow(swatchSize, `${savedLabel} colors`, true)}
    </div>
  );

  const sliderStack = (
    <div className="flex items-center gap-3">
      <IconButton variant="gray" aria-label="Pick color">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17 4a2.8 2.8 0 0 1 4 4l-2.5 2.5-1-1L9 19l-4 1 1-4 8.5-8.5-1-1L17 4Z" />
        </svg>
      </IconButton>
      <div className="flex flex-col flex-1 gap-2.5">
        {hueTrack()}
        {withAlpha ? alphaTrack() : null}
      </div>
    </div>
  );

  const renderCard = (widthClass: string, body: ReactNode) => (
    <div className={joinClasses('p-3', OVERLAY, widthClass, className)}>
      {title ? (
        <div className="flex items-baseline justify-between mb-2.5">
          <span className="text-headline text-[var(--label)]">{title}</span>
          {subtitle ? (
            <span className="text-footnote text-[var(--label-tertiary)]">{subtitle}</span>
          ) : null}
        </div>
      ) : null}
      {body}
      {footerLinks && footerLinks.length ? (
        <div className="flex gap-4 mt-3 pt-2.5 border-t border-solid border-[var(--separator)]">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href || '#'}
              onClick={(event) => {
                if (!link.onClick) return;
                event.preventDefault();
                link.onClick();
              }}
              className={joinClasses(
                'text-subheadline font-medium no-underline text-[var(--tint)] hover:text-[var(--tint-hover)] rounded-[var(--corner-sm)]',
                FOCUS_RING,
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );

  if (variant === 'hue')
    return renderCard(
      'w-60',
      <div className="flex items-center gap-3">
        <ColorDot color={color} />
        {hueTrack(true)}
      </div>,
    );

  if (variant === 'alpha')
    return renderCard(
      'w-60',
      <div className="flex items-center gap-3">
        <ColorDot color={color} />
        {alphaTrack(true, 'Transparency')}
      </div>,
    );

  if (variant === 'minimal')
    return renderCard(
      'w-75',
      <div className="flex flex-col gap-3">
        {sliderStack}
        {valueRow}
      </div>,
    );

  if (variant === 'swatch-card')
    return renderCard(
      'w-60',
      swatchRow(swatchSize, `${title || 'Saved'} colors`, Boolean(onAddSwatch)),
    );

  if (variant === 'swatch-picker')
    return renderCard(
      'w-66',
      <div className="flex flex-col gap-3">
        <div
          className="flex items-center justify-center h-22 rounded-[var(--corner-md)] font-[family-name:var(--type-family-mono)] text-body font-semibold text-[var(--gray-0)]"
          style={{ background: color }}
        >
          {color}
        </div>
        <div role="group" aria-label="Hues" className="grid grid-cols-8 gap-2">
          {swatchList.map((swatch, index) => {
            const isChosen = color === swatch.color;
            return (
              <button
                key={index}
                type="button"
                aria-label={swatch.label || `Use ${swatch.color}`}
                aria-pressed={isChosen}
                onClick={() => chooseColor(swatch.color)}
                style={{ background: swatch.color }}
                className={joinClasses(
                  'inline-flex items-center justify-center w-full aspect-square p-0 border-0 rounded-full cursor-pointer',
                  isChosen ? SELECTED_RING : SWATCH_EDGE,
                  FOCUS_RING,
                )}
              >
                {isChosen ? <CheckMark /> : null}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <ColorDot color={color} />
          {colorValueField}
          {opacityReadout}
        </div>
      </div>,
    );

  if (variant === 'palette')
    return (
      <div className={joinClasses('w-80 overflow-hidden', OVERLAY, className)}>
        <div className="flex flex-col gap-3 p-3">
          <div role="group" aria-label="Palette" className="grid grid-cols-10 gap-1">
            {PALETTE_LIGHTNESS.map((lightness) => (
              <React.Fragment key={lightness}>
                {PALETTE_HUES.map((paletteHue) => {
                  const paletteColor = `hsl(${paletteHue} 70% ${lightness}%)`;
                  const isChosen = color === paletteColor;
                  return (
                    <button
                      key={paletteHue}
                      type="button"
                      aria-label={`Palette color hue ${paletteHue} lum ${lightness}`}
                      aria-pressed={isChosen}
                      onClick={() => chooseColor(paletteColor)}
                      style={{ background: paletteColor }}
                      className={joinClasses(
                        'relative w-full aspect-square p-0 border-0 rounded-[var(--corner-sm)] cursor-pointer',
                        isChosen && joinClasses('z-[1]', SELECTED_RING),
                        'focus-visible:z-[2]',
                        FOCUS_RING,
                      )}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          {valueRow}
          {savedSection}
        </div>
      </div>
    );

  return (
    <div className={joinClasses('w-72 overflow-hidden', OVERLAY, className)}>
      <div
        role="tablist"
        aria-label="Fill type"
        className="relative flex items-center gap-1 px-2 pt-1 border-b border-solid border-[var(--separator)]"
      >
        {tabs.map((tab) => {
          const isSelected = currentTab === tab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                if (activeTab === undefined) setInternalTab(tab);
                onTabChange?.(tab);
              }}
              className={joinClasses(
                'relative min-h-[var(--control-lg)] px-2.5 border-0 bg-transparent cursor-pointer font-[inherit] text-callout',
                isSelected
                  ? "font-semibold text-[var(--label)] after:content-[''] after:absolute after:left-2.5 after:right-2.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-[var(--tint)]"
                  : 'font-medium text-[var(--label-secondary)] hover:text-[var(--label)]',
                FOCUS_RING,
              )}
            >
              {tab}
            </button>
          );
        })}
        {onClose ? (
          <span className="ml-auto">
            <IconButton size="sm" aria-label="Close color picker" onClick={onClose}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </IconButton>
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-3">
        <div
          className="relative h-40 rounded-[var(--corner-md)]"
          role="application"
          aria-label="Saturation and value"
          style={{
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${color})`,
          }}
        >
          <span
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_0_2px_var(--gray-0),var(--shadow-thumb)]"
            style={{ left: '78%', top: '26%', background: color }}
            aria-hidden="true"
          />
        </div>
        {sliderStack}
        {valueRow}
        {savedSection}
      </div>
    </div>
  );
};
