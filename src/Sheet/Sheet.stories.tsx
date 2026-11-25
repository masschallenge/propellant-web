import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';
import { ListRow, ListSection } from '../List/List';
import { SearchField } from '../SearchField/SearchField';
import { IconTile } from '../IconTile/IconTile';
import { AppShell } from '../AppShell/AppShell';
import { Sidebar, SidebarItem, SidebarSection } from '../Sidebar/Sidebar';
import { appearance, content, hide } from '../../.storybook/controls';
import { icons } from '../../.storybook/icons';

const Launcher = (args: React.ComponentProps<typeof Sheet>) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const meta = {
  title: 'Components/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Portalled dialog on the elevated surface over a scrim, with a focus trap and an inert background. Stacked, horizontal, or split layouts. `placement="side"` opens it as a full height panel on the right, full width on phones, for previews that sit beside the work. Footer actions sit in a right aligned row and stack full width, primary on top, on narrow screens.',
          '',
          '`placement="content"` is for sheets opened inside an `AppShell`. On wide screens (1024px and up) it centers the sheet over the content area beside the sidebar instead of the whole window, and aligns its top edge a set distance from the top of the window: 64px (`topOffset="sm"`, the default), 160px (`md`), 180px (`lg`) or 200px (`xl`). Narrower, it is centered like `center`. It reads the shell: beside a pinned sidebar it leaves `--sidebar-width`, beside a rail `--sidebar-rail-width`, and with the sidebar hidden or absent it uses the whole window, so wide sizes such as `xl` and `full` stay inside the content area. Outside an `AppShell` it falls back to `center`. The offsets are the `--sheet-offset-sm`, `-md`, `-lg` and `-xl` tokens.',
          '',
          '`closeButton="plain"` draws the close button without a fill, with a 24px glyph at a 1.5 stroke, for sheets whose header reads lighter. The default, `gray`, is unchanged.',
          '',
          '`header="divided"` draws a stacked sheet\'s header as one row: the icon on the left, a 17px title over a 13px sub line, and the close button on the right, with a separator between the header and the body. It suits reading sheets such as a message or an announcement. The default header is unchanged, and the horizontal and split layouts ignore it.',
          '',
          'Sizes cap the width at 400px (`sm`), 520px (`md`, the default), 540px (`md-wide`), 640px (`lg`) and 1152px (`xl`), or fill the viewport (`full`). `md-wide` fits a confirmation that lists people, such as the email confirmation with a framed recipient list.',
          '',
          "Import: `import { Sheet } from '@masschallenge/propellant-web'`",
        ].join('\n'),
      },
      story: { height: '480px' },
    },
  },
  args: {
    open: false,
    onClose: () => {},
    title: 'Delete Round 2?',
    description: 'Judges lose access to their panels and every saved score is removed.',
    tone: 'critical',
    footer: (
      <>
        <Button variant="gray">Cancel</Button>
        <Button variant="filled" destructive>
          Delete round
        </Button>
      </>
    ),
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'critical'],
      ...appearance,
    },
    layout: { control: 'inline-radio', options: ['stacked', 'horizontal', 'split'], ...appearance },
    size: { control: 'inline-radio', options: ['sm', 'md', 'md-wide', 'lg', 'xl'], ...appearance },
    placement: {
      control: 'inline-radio',
      options: ['center', 'side', 'content'],
      ...appearance,
    },
    topOffset: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'], ...appearance },
    closeButton: { control: 'inline-radio', options: ['gray', 'plain'], ...appearance },
    header: { control: 'inline-radio', options: ['default', 'divided'], ...appearance },
    eyebrow: { control: 'text', ...content },
    title: { control: 'text', ...content },
    description: { control: 'text', ...content },
    open: hide,
    onClose: hide,
    className: hide,
  },
  render: (args) => <Launcher {...args} />,
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    tone: 'info',
    title: 'Judge access request',
    description: 'Priya Raman asked to join the Healthcare panel for Round 2.',
    footer: (
      <>
        <Button variant="gray">Decline</Button>
        <Button variant="filled">Approve</Button>
      </>
    ),
  },
};
export const Open: Story = {
  tags: ['interaction', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open sheet' }));
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

export const Full: Story = {
  args: {
    size: 'full',
    hideIcon: true,
    title: 'Vitala pitch deck',
    description: undefined,
    footer: undefined,
    children: (
      <div className="flex flex-1 items-center justify-center rounded-[var(--corner-lg)] bg-[var(--bg-secondary)]">
        Document preview
      </div>
    ),
  },
};

export const Side: Story = {
  args: {
    placement: 'side',
    hideIcon: true,
    eyebrow: 'Preview',
    title: 'Healthcare & Life Sciences Traction Program 2026',
    description: undefined,
    footer: undefined,
    children: (
      <div className="flex flex-col gap-3">
        <p className="m-0">Ran Mar 2 to Jun 26, 2026. Dates are not copied.</p>
        <p className="m-0 text-[var(--label-secondary)]">
          Stages, application questions, criteria and the team come across.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <div className="relative w-full" style={{ height: '30rem' }}>
      <Sheet {...args} open inline />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
};

export const AlertDialog: Story = {
  args: {
    role: 'alertdialog',
    tone: 'warning',
    size: 'sm',
    title: 'Discard this review?',
    description: 'Your scores and feedback have not been submitted. Leaving now discards them.',
    footer: (
      <>
        <Button variant="gray">Keep reviewing</Button>
        <Button variant="filled" destructive>
          Discard
        </Button>
      </>
    ),
  },
};

export const WideFooter: Story = {
  args: {
    size: 'sm',
    tone: 'success',
    title: 'Cohort published',
    description: 'Founders in the Climate cohort can now see their mentors.',
    footerLayout: 'wide',
    footer: (
      <>
        <Button variant="gray">Back to cohort</Button>
        <Button variant="filled">Message founders</Button>
      </>
    ),
  },
};

const RECIPIENTS = [
  { initials: 'ZE', name: 'Zoe Engel', company: 'Hazel Rx', progress: '90% done' },
  { initials: 'BU', name: 'Ben Ulrich', company: 'Willow Med', progress: '90% done' },
  { initials: 'FV', name: 'Farah Varga', company: 'Coral Mind', progress: '90% done' },
  { initials: 'WF', name: 'Will Fischer', company: 'Heron Cardio', progress: '85% done' },
];

export const EmailConfirmation: Story = {
  args: {
    open: true,
    inline: true,
    size: 'md-wide',
    hideIcon: true,
    tone: 'info',
    title: 'Email 52 founders?',
    description: undefined,
    footer: (
      <>
        <Button variant="gray">Cancel</Button>
        <Button variant="filled">Send email</Button>
      </>
    ),
    children: (
      <ListSection
        framed
        density="dense"
        title="52 founders"
        trailing={<SearchField size="sm" placeholder="Find" aria-label="Find a founder" />}
      >
        {RECIPIENTS.map((recipient) => (
          <ListRow
            key={recipient.name}
            title={recipient.name}
            titleEmphasis="strong"
            subtitle={recipient.company}
            subtitlePosition="inline"
            value={recipient.progress}
            media={{ avatar: { initials: recipient.initials, size: 'compact' } }}
          />
        ))}
      </ListSection>
    ),
  },
  render: (args) => (
    <div className="relative w-[640px] h-[560px]">
      <Sheet {...args} />
    </div>
  ),
};

const ContentShell = ({
  sheet,
  ...shellProps
}: { sheet: React.ComponentProps<typeof Sheet> } & React.ComponentProps<typeof AppShell>) => (
  <AppShell
    {...shellProps}
    sidebar={
      <Sidebar label="Main">
        <SidebarSection title="Boston 2026">
          <SidebarItem icon={icons.star} current>
            Overview
          </SidebarItem>
          <SidebarItem icon={icons.check}>Startups</SidebarItem>
          <SidebarItem icon={icons.person}>Judges</SidebarItem>
        </SidebarSection>
      </Sidebar>
    }
  >
    <h1 className="m-0 text-large-title text-[var(--label)]">Stages</h1>
    <Sheet {...sheet} />
  </AppShell>
);

export const ContentPlacement: Story = {
  args: {
    open: true,
    placement: 'content',
    topOffset: 'md',
    tone: 'warning',
    title: 'Archive the Review stage?',
    description: 'Startups in this stage keep their scores, and judges lose access to it.',
    footer: (
      <>
        <Button variant="gray">Cancel</Button>
        <Button variant="filled">Archive stage</Button>
      </>
    ),
  },
  render: (args) => <ContentShell sheet={args} />,
  parameters: { layout: 'fullscreen' },
};

export const ContentPlacementRail: Story = {
  ...ContentPlacement,
  render: (args) => <ContentShell sheet={args} sidebarCollapse="rail" defaultSidebarCollapsed />,
};

export const ContentPlacementCollapsed: Story = {
  ...ContentPlacement,
  render: (args) => <ContentShell sheet={args} defaultSidebarCollapsed />,
};

export const ContentPlacementExtraLarge: Story = {
  ...ContentPlacement,
  args: { ...ContentPlacement.args, size: 'xl', topOffset: 'sm' },
};

export const PlainCloseButton: Story = {
  args: {
    open: true,
    inline: true,
    closeButton: 'plain',
    hideIcon: true,
    tone: 'info',
    title: 'Rename stage',
    description: 'Founders and judges see the new name right away.',
    footer: (
      <>
        <Button variant="gray">Cancel</Button>
        <Button variant="filled">Save</Button>
      </>
    ),
  },
  render: (args) => (
    <div className="relative w-[640px] h-[360px]">
      <Sheet {...args} />
    </div>
  ),
};

export const DividedHeader: Story = {
  args: {
    placement: 'side',
    header: 'divided',
    closeButton: 'plain',
    icon: <IconTile icon={icons.calendar} tone="gray" />,
    title: 'Office hours added',
    description: 'HealthTech Traction 2027 team. Mon, Nov 23',
    footer: undefined,
    children: (
      <div className="flex flex-col gap-3">
        <p className="m-0">Book a slot with the program team on Thursdays from 2 to 4 PM ET.</p>
        <p className="m-0 text-[var(--label-secondary)]">Founders in HealthTech Traction 2027</p>
      </div>
    ),
  },
  render: (args) => (
    <div className="relative w-full" style={{ height: '30rem' }}>
      <Sheet {...args} open inline />
    </div>
  ),
  parameters: { layout: 'fullscreen' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('heading', { name: 'Office hours added' });
    await expect(title).toHaveClass('text-title3');
    await expect(canvas.getByRole('button', { name: 'Close' }).parentElement).not.toHaveClass(
      'absolute',
    );
  },
};
