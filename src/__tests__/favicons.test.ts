import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseTokens } from '../../site/tooling/tokens';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const faviconsDir = path.join(packageDir, 'assets/favicons');

const colorTokens = parseTokens(
  readFileSync(path.join(packageDir, 'tokens/color.css'), 'utf8'),
  'color',
);

const tokenValue = (name: string) =>
  colorTokens
    .find((token) => token.name === name)
    ?.values.find((entry) => entry.condition === 'default')?.value;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_COLOR_TYPES_WITHOUT_ALPHA = [0, 2];

const readPngHeader = (bytes: Buffer) => {
  expect(bytes.subarray(0, 8).equals(PNG_SIGNATURE)).toBe(true);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    colorType: bytes.readUInt8(25),
  };
};

const readPng = (filePath: string) => readPngHeader(readFileSync(filePath));

const readIcoFrames = (filePath: string) => {
  const bytes = readFileSync(filePath);
  expect(bytes.readUInt16LE(0)).toBe(0);
  expect(bytes.readUInt16LE(2)).toBe(1);
  const frameCount = bytes.readUInt16LE(4);
  return Array.from({ length: frameCount }, (_, frameIndex) => {
    const entryOffset = 6 + frameIndex * 16;
    const dataSize = bytes.readUInt32LE(entryOffset + 8);
    const dataOffset = bytes.readUInt32LE(entryOffset + 12);
    return {
      width: bytes.readUInt8(entryOffset) || 256,
      height: bytes.readUInt8(entryOffset + 1) || 256,
      image: readPngHeader(bytes.subarray(dataOffset, dataOffset + dataSize)),
    };
  });
};

const FAVICON_SETS = [
  {
    folder: 'masschallenge',
    name: 'MassChallenge',
    themeToken: '--mc-navy',
    hasSvg: false,
  },
  {
    folder: 'propellant',
    name: 'Propellant',
    themeToken: '--teal-900',
    hasSvg: true,
  },
];

const PNG_FILES: [string, number][] = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
];

describe.each(FAVICON_SETS)('the $name favicon set', ({ folder, name, themeToken, hasSvg }) => {
  const setDir = path.join(faviconsDir, folder);

  it.each(PNG_FILES)('has %s at %i pixels square', (fileName, size) => {
    const header = readPng(path.join(setDir, fileName));
    expect([header.width, header.height]).toEqual([size, size]);
  });

  it('has an opaque apple touch icon, since iOS fills transparency with black', () => {
    const header = readPng(path.join(setDir, 'apple-touch-icon.png'));
    expect(PNG_COLOR_TYPES_WITHOUT_ALPHA).toContain(header.colorType);
  });

  it('has a favicon.ico holding 16, 32 and 48 pixel frames', () => {
    const frames = readIcoFrames(path.join(setDir, 'favicon.ico'));
    expect(frames.map((frame) => frame.width).sort((first, second) => first - second)).toEqual([
      16, 32, 48,
    ]);
    frames.forEach((frame) => {
      expect(frame.height).toBe(frame.width);
      expect([frame.image.width, frame.image.height]).toEqual([frame.width, frame.height]);
    });
  });

  it(hasSvg ? 'has a vector favicon.svg' : 'has no favicon.svg without a vector source', () => {
    expect(existsSync(path.join(setDir, 'favicon.svg'))).toBe(hasSvg);
  });

  it('has a web manifest named for the mark, with token colors and real icons', () => {
    const manifest = JSON.parse(readFileSync(path.join(setDir, 'site.webmanifest'), 'utf8'));
    expect(manifest.name).toBe(name);
    expect(manifest.short_name).toBe(name);
    expect(manifest.theme_color).toBe(tokenValue(themeToken));
    expect(manifest.background_color).toBe(tokenValue('--gray-0'));
    expect(manifest.icons.length).toBeGreaterThan(0);
    manifest.icons.forEach((icon: { src: string; sizes: string; type: string }) => {
      const iconPath = path.join(setDir, icon.src);
      expect(existsSync(iconPath)).toBe(true);
      expect(icon.type).toBe('image/png');
      const header = readPng(iconPath);
      expect(icon.sizes).toBe(`${header.width}x${header.height}`);
    });
  });
});

describe('the Propellant favicon.svg', () => {
  it('is the Propellant icon, so the two never drift apart', () => {
    expect(readFileSync(path.join(faviconsDir, 'propellant/favicon.svg'), 'utf8')).toBe(
      readFileSync(path.join(packageDir, 'assets/brand/propellant-icon.svg'), 'utf8'),
    );
  });
});
