import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import * as Propellant from '../index';

const KITCHEN: Record<string, unknown> = {
  options: [],
  items: [],
  data: [],
  series: [],
  columns: [],
  rows: [],
  slides: [],
  nodes: [],
  tabs: [],
  steps: [],
  events: [],
  stops: [],
  crumbs: [],
  links: [],
  messages: [],
  value: '',
  label: 'Label',
  title: 'Title',
  text: 'Text',
  code: 'code',
  open: false,
  onClose: () => {},
  onChange: () => {},
  onClick: () => {},
};

const OVERRIDES: Record<string, Record<string, unknown>> = {
  PhoneField: {
    countries: [{ code: 'US', label: 'United States', dialCode: '1' }],
    country: 'US',
    number: '',
  },
  Popover: { panelLabel: 'Panel' },
  Menu: { trigger: <button type="button">Open</button> },
  Progress: { value: 50 },
  ProgressRing: { value: 50 },
  RadialProgress: { value: 50 },
  ProgressCircle: { value: 50 },
  Slider: { value: 50 },
  VerificationCodeInput: { length: 4 },
};

const isComponent = (value: unknown): boolean =>
  typeof value === 'function' ||
  (typeof value === 'object' &&
    value !== null &&
    typeof (value as { $$typeof?: symbol }).$$typeof === 'symbol');

const EXPECTED_COMPONENTS = [
  'ActivityFeed',
  'AlertCircleIcon',
  'AppShell',
  'AuthLayout',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'Banner',
  'Breadcrumb',
  'Button',
  'Calendar',
  'Card',
  'CheckCircleIcon',
  'Checkbox',
  'ColorPicker',
  'ComboBox',
  'DatePicker',
  'DisclosureGroup',
  'DotSpinner',
  'EmptyState',
  'FileRow',
  'FileUploader',
  'FilterBar',
  'FilterButton',
  'FilterConditions',
  'FilterDrawer',
  'FilterPopover',
  'FilterSelect',
  'IconButton',
  'Inspector',
  'InspectorRow',
  'ListRow',
  'ListSection',
  'Logo',
  'MailIcon',
  'Menu',
  'PageContainer',
  'PageHeader',
  'Pagination',
  'PhoneField',
  'PopUpButton',
  'Popover',
  'Progress',
  'ProgressCircle',
  'ProgressRing',
  'RadialProgress',
  'Radio',
  'RadioCardGroup',
  'RadioGroup',
  'SearchField',
  'SegmentedControl',
  'Separator',
  'SeparatorAddButton',
  'Sheet',
  'Sidebar',
  'SidebarItem',
  'SidebarSection',
  'Skeleton',
  'SkeletonGroup',
  'Slider',
  'SocialButton',
  'Spinner',
  'StatusIcon',
  'Stepper',
  'Switch',
  'TabBar',
  'TabPanel',
  'Table',
  'TableCard',
  'TableCellStack',
  'TableEmptyState',
  'TableFooter',
  'TextField',
  'Textarea',
  'Toast',
  'Token',
  'Toolbar',
  'Tooltip',
  'TooltipTrigger',
  'VerificationCodeInput',
];

const componentNames = Object.keys(Propellant)
  .filter(
    (name) => /^[A-Z]/.test(name) && isComponent((Propellant as Record<string, unknown>)[name]),
  )
  .sort();

afterEach(cleanup);

describe('Propellant mirror renders', () => {
  it('exports exactly the ported component set', () => {
    expect(componentNames).toEqual(EXPECTED_COMPONENTS);
  });

  it.each(componentNames)('renders %s without crashing', (name) => {
    const Component = (
      Propellant as unknown as Record<string, React.ComponentType<Record<string, unknown>>>
    )[name];
    const props = { ...KITCHEN, ...(OVERRIDES[name] ?? {}) };
    expect(() =>
      render(
        <div data-propellant>
          <Component {...props} />
        </div>,
      ),
    ).not.toThrow();
  });
});
