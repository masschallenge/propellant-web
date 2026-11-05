export interface Rgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export const parseColor = (value: string): Rgba | null => {
  const match = value
    .trim()
    .match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (!match) return null;
  const alphaText = match[4];
  const alpha =
    alphaText === undefined
      ? 1
      : alphaText.endsWith('%')
        ? Number(alphaText.slice(0, -1)) / 100
        : Number(alphaText);
  return { red: Number(match[1]), green: Number(match[2]), blue: Number(match[3]), alpha };
};

export const composite = (foreground: Rgba, background: Rgba): Rgba => ({
  red: foreground.red * foreground.alpha + background.red * (1 - foreground.alpha),
  green: foreground.green * foreground.alpha + background.green * (1 - foreground.alpha),
  blue: foreground.blue * foreground.alpha + background.blue * (1 - foreground.alpha),
  alpha: 1,
});

const channel = (value: number) => {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

export const luminance = (color: Rgba) =>
  0.2126 * channel(color.red) + 0.7152 * channel(color.green) + 0.0722 * channel(color.blue);

export const contrastRatio = (foreground: Rgba, background: Rgba) => {
  const solid = foreground.alpha < 1 ? composite(foreground, background) : foreground;
  const lighter = Math.max(luminance(solid), luminance(background));
  const darker = Math.min(luminance(solid), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

export const toHex = (color: Rgba) =>
  `#${[color.red, color.green, color.blue]
    .map((part) => Math.round(part).toString(16).padStart(2, '0'))
    .join('')}`;

export const formatRatio = (ratio: number) => `${(Math.floor(ratio * 10) / 10).toFixed(1)}:1`;
