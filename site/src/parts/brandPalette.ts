export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  token: string;
  use: string;
  printSubstitute?: string;
}

export interface BrandPairing {
  id: string;
  foreground: string;
  background: string;
  ratio: number;
}

export const CORE_COLORS: BrandColor[] = [
  {
    id: 'mc-blue',
    name: 'MC Blue',
    hex: '#0EABBC',
    token: '--mc-blue',
    use: 'The logo and graphic shapes. Never text.',
  },
  { id: 'mc-gray', name: 'MC Gray', hex: '#808285', token: '--mc-gray', use: 'The logo only.' },
  {
    id: 'navy',
    name: 'Navy',
    hex: '#10263F',
    token: '--mc-navy',
    use: 'Dark sections and gradients.',
  },
  {
    id: 'black',
    name: 'Black',
    hex: '#222222',
    token: '--mc-black',
    use: 'Dark sections and body text.',
  },
  {
    id: 'warm-white',
    name: 'Warm White',
    hex: '#F8F8F5',
    token: '--mc-warm-white',
    use: 'Light sections.',
  },
];

export const SUPPORTING_COLORS: BrandColor[] = [
  {
    id: 'deep-teal',
    name: 'Deep Teal',
    hex: '#004F73',
    token: '--mc-deep-teal',
    use: 'Dark sections.',
  },
  {
    id: 'teal',
    name: 'Teal',
    hex: '#00708E',
    token: '--mc-teal',
    use: 'Headings and links on light backgrounds. Colored text on light is always Teal.',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    hex: '#54EEFF',
    token: '--mc-cyan',
    use: 'Text and accents on Navy, Black and Deep Teal only.',
    printSubstitute: '#00CFE8',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    hex: '#037AA6',
    token: '--mc-ocean',
    use: 'A gradient stop only, never a flat fill.',
  },
];

export const WARM_ACCENTS: BrandColor[] = [
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#FFC801',
    token: '--mc-yellow',
    use: 'Tags, rules and stats. Dark text on it.',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#FF6B35',
    token: '--mc-orange',
    use: 'Dark text only, never white.',
    printSubstitute: '#F58242',
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    hex: '#D14170',
    token: '--mc-raspberry',
    use: 'Shapes and rules on dark backgrounds.',
    printSubstitute: '#D83B80',
  },
  {
    id: 'lime',
    name: 'Lime',
    hex: '#C6F135',
    token: '--mc-lime',
    use: 'Accents on dark backgrounds.',
    printSubstitute: '#91D438',
  },
];

export const APPROVED_PAIRINGS: BrandPairing[] = [
  { id: 'cyan-navy', foreground: 'Cyan', background: 'Navy', ratio: 11.0 },
  { id: 'white-black', foreground: 'White', background: 'Black', ratio: 15.9 },
  { id: 'teal-white', foreground: 'Teal', background: 'White', ratio: 5.7 },
  { id: 'white-deep-teal', foreground: 'White', background: 'Deep Teal', ratio: 8.9 },
  { id: 'navy-warm-white', foreground: 'Navy', background: 'Warm White', ratio: 14.4 },
  { id: 'lime-navy', foreground: 'Lime', background: 'Navy', ratio: 11.7 },
];

export const CHART_ORDER = ['Teal', 'Yellow', 'Navy', 'MC Blue', 'Deep Teal', 'Gray 300'];

const WHITE: BrandColor = {
  id: 'white',
  name: 'White',
  hex: '#FFFFFF',
  token: '--gray-0',
  use: 'Light sections.',
};

export const brandColorNamed = (name: string) =>
  [WHITE, ...CORE_COLORS, ...SUPPORTING_COLORS, ...WARM_ACCENTS].find(
    (color) => color.name === name,
  );
