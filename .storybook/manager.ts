import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import pkg from '../package.json';

const tint = '#065e6f';
const label = '#1e282b';
const labelSecondary = '#4b575b';
const separator = '#dbe1e3';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: `Propellant ${pkg.version}`,
    brandTarget: '_self',
    colorPrimary: tint,
    colorSecondary: tint,
    appBg: '#f3f6f7',
    appContentBg: '#ffffff',
    appPreviewBg: '#ffffff',
    appBorderColor: separator,
    appBorderRadius: 12,
    fontBase: "'Propellant Sans', 'Lato', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontCode: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
    textColor: label,
    textInverseColor: '#ffffff',
    textMutedColor: labelSecondary,
    barTextColor: labelSecondary,
    barSelectedColor: tint,
    barHoverColor: tint,
    barBg: '#ffffff',
    buttonBg: '#f3f6f7',
    buttonBorder: separator,
    inputBg: '#ffffff',
    inputBorder: '#848f92',
    inputTextColor: label,
    inputBorderRadius: 8,
  }),
});
