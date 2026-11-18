import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ListRow, ListSection } from './List';
import { Switch } from '../Switch/Switch';
import { Badge } from '../Badge/Badge';
import { icons } from '../../.storybook/icons';
import { MC_MONOGRAM } from '../assets/logos';
import { content, hide } from '../../.storybook/controls';

const meta = {
  title: 'Components/Data display/List',
  component: ListSection,
  subcomponents: { ListRow },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'An inset grouped list: rows on a content surface with 12px corners, separated by hairlines that start at the text. Use it for settings, summaries and short lists of destinations. Rows can show a value, an icon, an accessory such as a switch (labelled by the row title), a selection check, or a chevron when they lead somewhere. Destructive actions sit in their own section.',
          '',
          "In place of the icon, `media` shows an image: a program logo as a 64 by 38 thumbnail with 5px corners and a separator ring, or a company logo as a 36px squircle with `shape: 'squircle'`. Images show whole on a quiet background unless `autoCrop` is set for an image we own. Leave `alt` empty when the title already names the program or company.",
          '',
          "Import: `import { ListSection, ListRow } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
    },
  },
  args: {
    title: 'Round 1',
    footer: 'Judges see startups once the round opens.',
    density: 'regular',
  },
  argTypes: {
    title: { control: 'text', ...content },
    footer: { control: 'text', ...content },
    density: { control: 'inline-radio', options: ['regular', 'dense'] },
    trailing: hide,
    titleAs: hide,
    children: hide,
    className: hide,
  },
  decorators: [
    (Story) => (
      <div className="max-w-[var(--width-form)] p-6 bg-[var(--bg-grouped)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Startups in review" value="128" />
      <ListRow title="Judges assigned" value="42" />
      <ListRow title="Status" accessory={<Badge tone="success">Open</Badge>} />
    </ListSection>
  ),
};

export const Settings: Story = {
  args: { title: 'Notifications', footer: 'Sent at 9:00 AM in the program timezone.' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Email judges when assigned" accessory={<Switch defaultChecked />} />
      <ListRow title="Remind judges before the deadline" accessory={<Switch />} />
      <ListRow title="Reminder lead time" value="2 days" href="#lead-time" />
    </ListSection>
  ),
};

export const Navigation: Story = {
  args: { title: 'Manage', footer: undefined },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <ListSection {...args}>
        <ListRow title="Judges" subtitle="42 assigned" icon={icons.person} href="#judges" />
        <ListRow title="Schedule" icon={icons.calendar} href="#schedule" />
        <ListRow title="Rubric" icon={icons.star} href="#rubric" />
      </ListSection>
      <ListSection>
        <ListRow title="Close the round" destructive onClick={() => undefined} />
      </ListSection>
    </div>
  ),
};

const PROGRAM_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 38"><rect width="64" height="38" fill="#065e6f"/><circle cx="32" cy="19" r="10" fill="#d9f6fa"/></svg>',
  );

export const Media: Story = {
  args: { title: 'Reviews', footer: undefined },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <ListSection {...args}>
        <ListRow
          title="HealthTech Traction 2027"
          subtitle="Online selection. Due Mon, Nov 30"
          value="3 of 6 done"
          media={{ src: PROGRAM_LOGO, autoCrop: true }}
          href="#healthtech"
        />
        <ListRow
          title="MassChallenge Boston 2027"
          subtitle="Logo shown whole"
          media={{ src: MC_MONOGRAM }}
          href="#boston"
        />
      </ListSection>
      <ListSection title="Your startups">
        <ListRow
          title="CareLoop"
          subtitle="Pilot pricing review"
          media={{ src: MC_MONOGRAM, shape: 'squircle' }}
          href="#careloop"
        />
        <ListRow
          title="Willow Fertility"
          subtitle="Partnerships"
          media={{ src: PROGRAM_LOGO, shape: 'squircle', autoCrop: true }}
          href="#willow"
        />
      </ListSection>
    </div>
  ),
};

export const Selection: Story = {
  args: { title: 'Timezone', footer: undefined, density: 'dense' },
  render: (args) => (
    <ListSection {...args}>
      <ListRow title="Eastern time" selected onClick={() => undefined} />
      <ListRow title="Central time" onClick={() => undefined} />
      <ListRow title="Pacific time" onClick={() => undefined} />
    </ListSection>
  ),
};

export const Interaction: Story = {
  tags: ['interaction', '!autodocs'],
  args: { title: 'Actions', footer: undefined },
  render: (args) => {
    const onExport = fn();
    return (
      <ListSection {...args}>
        <ListRow title="Export scores" onClick={onExport} data-testid="export" />
        <ListRow title="Email judges" accessory={<Switch />} />
      </ListSection>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Email judges' });
    await userEvent.click(control);
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('button', { name: 'Export scores' })).toBeEnabled();
  },
};
