import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarItem, SidebarSection, SidebarSeparator } from './Sidebar';
import { RoleTag } from '../RoleTag/RoleTag';
import { AppShell } from '../AppShell/AppShell';
import { Toolbar } from '../Toolbar/Toolbar';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const LinkStub = ({ href, children, ...rest }: React.ComponentPropsWithoutRef<'a'>) => (
  <a href={href} data-router-link="" {...rest}>
    {children}
  </a>
);

describe('Sidebar', () => {
  it('names the navigation landmark and renders header and footer', () => {
    render(
      <Sidebar label="Console" header={<span>MassChallenge</span>} footer={<span>Ada</span>}>
        <SidebarSection>
          <SidebarItem href="/">Home</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const navigation = screen.getByRole('navigation', { name: 'Console' });
    expect(navigation).toHaveTextContent('MassChallenge');
    expect(navigation).toHaveTextContent('Ada');
  });

  it('labels a section list by its title', () => {
    render(
      <Sidebar>
        <SidebarSection title="Program">
          <SidebarItem href="/overview">Overview</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByRole('list', { name: 'Program' })).toBeInTheDocument();
  });

  it('marks the current destination and shows its count', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem href="/startups" current count={4} icon={<svg />}>
            Startups
          </SidebarItem>
          <SidebarItem href="/mentors">Mentors</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const current = screen.getByRole('link', { name: /^Startups/ });
    expect(current).toHaveAccessibleName(/^Startups,\s?4$/);
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('font-semibold');
    expect(screen.getByRole('link', { name: 'Mentors' })).not.toHaveAttribute('aria-current');
  });

  it('keeps the small height by default and takes the medium height when asked', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem href="/home">Home</SidebarItem>
          <SidebarItem href="/network" size="md">
            Network
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const home = screen.getByRole('link', { name: 'Home' });
    const network = screen.getByRole('link', { name: 'Network' });
    expect(home).toHaveClass('min-h-[var(--control-sm)]');
    expect(home).not.toHaveClass('min-h-[var(--control-md)]');
    expect(network).toHaveClass('min-h-[var(--control-md)]');
    expect(network).not.toHaveClass('min-h-[var(--control-sm)]');
  });

  it('renders through a router link component', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem href="/events" linkAs={LinkStub}>
            Events
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByRole('link', { name: 'Events' })).toHaveAttribute('data-router-link');
  });

  it('renders a button when there is no destination', async () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem onClick={onClick} current>
            Settings
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('aria-current', 'page');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('offers no collapse button outside a shell with a rail', () => {
    render(
      <Sidebar header={<span>MassChallenge</span>}>
        <SidebarSection>
          <SidebarItem href="/">Home</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.queryByRole('button', { name: /menu$/ })).not.toBeInTheDocument();
    expect(screen.getByText('MassChallenge')).toBeVisible();
  });

  it('scrolls its destinations vertically and never sideways', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem href="/">Home</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const scrollArea = screen.getByRole('list').parentElement?.parentElement;
    expect(scrollArea).toHaveClass('overflow-y-auto', 'overflow-x-hidden');
  });

  it.each([
    ['hide', 'min-h-[var(--control-sm)]', 'text-callout', 'w-[var(--icon-sm)]'],
    ['rail', 'min-h-[var(--row-dense)]', 'text-body', 'w-[var(--icon-lg)]'],
  ] as const)(
    'sizes a top level item with nothing nested for %s mode',
    (mode, height, text, iconWidth) => {
      vi.stubGlobal('matchMedia', () => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      render(
        <AppShell
          sidebarCollapse={mode}
          sidebar={
            <Sidebar>
              <SidebarSection>
                <SidebarItem href="/" icon={<svg />}>
                  Home
                </SidebarItem>
              </SidebarSection>
            </Sidebar>
          }
        >
          <p>Page</p>
        </AppShell>,
      );
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home).toHaveClass(height, text);
      expect(home.firstElementChild).toHaveClass(iconWidth);
    },
  );

  it('hides the scrollbar of its destinations while they still scroll', () => {
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem href="/">Home</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const scrollArea = screen.getByRole('list').parentElement?.parentElement;
    expect(scrollArea).toHaveClass(
      'overflow-y-auto',
      '[scrollbar-width:none]',
      '[&::-webkit-scrollbar]:hidden',
    );
  });

  describe('tree', () => {
    const renderTree = (stageProps: Partial<React.ComponentProps<typeof SidebarItem>> = {}) =>
      render(
        <Sidebar label="Console">
          <SidebarSection>
            <SidebarItem
              href="/program"
              media={{ src: '/logo.png', alt: 'HealthTech logo' }}
              collapsible={false}
              subitems={
                <SidebarItem
                  href="/review/judges"
                  marker={{ state: 'next', number: 3, label: 'not started' }}
                  subitems={
                    <>
                      <SidebarItem href="/review/judges" current>
                        Judges
                      </SidebarItem>
                      <SidebarItem href="/review/progress">Progress</SidebarItem>
                    </>
                  }
                  {...stageProps}
                >
                  Online review
                </SidebarItem>
              }
            >
              HealthTech Traction 2027
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );

    it('nests subitems in a list the parent controls', () => {
      renderTree({ expanded: true });
      const stage = screen.getByRole('button', { name: /^Online review/ });
      const subitems = document.getElementById(stage.getAttribute('aria-controls') ?? '');
      expect(subitems).toHaveAttribute('role', 'list');
      expect(subitems).toContainElement(screen.getByRole('link', { name: 'Judges' }));
      expect(stage).toHaveAttribute('aria-expanded', 'true');
    });

    it('makes a parent with a destination a disclosure that only expands', async () => {
      const onExpandedChange = vi.fn();
      renderTree({ onExpandedChange });
      expect(screen.queryByRole('link', { name: /^Online review/ })).not.toBeInTheDocument();
      const stage = screen.getByRole('button', { name: /^Online review/ });
      expect(stage).not.toHaveAttribute('href');
      expect(stage).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('link', { name: 'Judges' })).not.toBeInTheDocument();
      await userEvent.click(stage);
      expect(stage).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('link', { name: 'Judges' })).toBeVisible();
      expect(onExpandedChange).toHaveBeenLastCalledWith(true);
    });

    it('toggles a parent with Enter and Space', async () => {
      renderTree();
      const stage = screen.getByRole('button', { name: /^Online review/ });
      stage.focus();
      await userEvent.keyboard('{Enter}');
      expect(stage).toHaveAttribute('aria-expanded', 'true');
      await userEvent.keyboard(' ');
      expect(stage).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens a parent by default when asked', () => {
      renderTree({ defaultExpanded: true });
      expect(screen.getByRole('button', { name: /^Online review/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('marks only the current page, not the branches above it', () => {
      renderTree({ expanded: true });
      expect(screen.getByRole('link', { name: 'Judges' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('button', { name: /^Online review/ })).not.toHaveAttribute(
        'aria-current',
      );
      expect(screen.getByRole('link', { name: /^HealthTech/ })).not.toHaveAttribute('aria-current');
    });

    it('sizes rows by their place in the tree, not only their depth', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              icon={<svg />}
              defaultExpanded
              subitems={
                <>
                  <SidebarItem
                    defaultExpanded
                    subitems={<SidebarItem href="/deepest">Deepest</SidebarItem>}
                  >
                    Group
                  </SidebarItem>
                  <SidebarItem href="/sibling">Sibling</SidebarItem>
                </>
              }
            >
              Program
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const program = screen.getByRole('button', { name: 'Program' });
      const group = screen.getByRole('button', { name: 'Group' });
      const sibling = screen.getByRole('link', { name: 'Sibling' });
      const deepest = screen.getByRole('link', { name: 'Deepest' });
      expect(program).toHaveClass('min-h-[var(--row-dense)]', 'text-body', 'pl-2');
      expect(group).toHaveClass(
        'min-h-[calc(var(--row-dense)-var(--space-0-5))]',
        'text-body',
        'text-[var(--label)]',
      );
      expect(sibling).toHaveClass(
        'min-h-[calc(var(--row-dense)-var(--space-1))]',
        'text-callout',
        'text-[var(--label-secondary)]',
      );
      expect(deepest).toHaveClass('min-h-[calc(var(--row-dense)-var(--space-1))]', 'pl-18');
      expect(program.closest('li')).toHaveAttribute('data-propellant-sidebar-depth', '0');
      expect(deepest.closest('li')).toHaveAttribute('data-propellant-sidebar-depth', '2');
    });

    it('keeps a top level item with nothing nested at its size beside a parent', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/home" icon={<svg />}>
              Home
            </SidebarItem>
            <SidebarItem
              icon={<svg />}
              subitems={<SidebarItem href="/mentors">Mentors</SidebarItem>}
            >
              Configuration
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const home = screen.getByRole('link', { name: 'Home' });
      const configuration = screen.getByRole('button', { name: 'Configuration' });
      expect(home).toHaveClass('min-h-[var(--control-sm)]', 'text-callout', 'gap-2');
      expect(home.firstElementChild).toHaveClass('w-[var(--icon-sm)]', 'h-[var(--icon-sm)]');
      expect(configuration).toHaveClass('min-h-[var(--row-dense)]', 'text-body', 'gap-2.5');
      expect(configuration.firstElementChild).toHaveClass(
        'w-[var(--icon-lg)]',
        'h-[var(--icon-lg)]',
      );
    });

    it('lets an explicit size set the height of a row in the tree', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              size="md"
              defaultExpanded
              subitems={
                <SidebarItem href="/mentors" size="sm">
                  Mentors
                </SidebarItem>
              }
            >
              Configuration
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const configuration = screen.getByRole('button', { name: 'Configuration' });
      const mentors = screen.getByRole('link', { name: 'Mentors' });
      expect(configuration).toHaveClass('min-h-[var(--control-md)]', 'text-body');
      expect(configuration).not.toHaveClass('min-h-[var(--row-dense)]');
      expect(mentors).toHaveClass('min-h-[var(--control-sm)]', 'text-callout');
      expect(mentors).not.toHaveClass('min-h-[calc(var(--row-dense)-var(--space-1))]');
    });

    it('gives an icon row inside the tree the top level size', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              href="/program"
              media={{ src: '/logo.png', alt: '' }}
              collapsible={false}
              subitems={
                <SidebarItem href="/overview" icon={<svg />}>
                  Overview
                </SidebarItem>
              }
            >
              HealthTech Traction 2027
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const overview = screen.getByRole('link', { name: 'Overview' });
      expect(overview).toHaveClass(
        'pl-5',
        'py-0',
        'min-h-[var(--row-dense)]',
        'text-body',
        'text-[var(--label)]',
      );
      expect(screen.getByText('Overview')).toHaveClass('leading-5.5');
    });

    it('draws separators between groups and inside the program branch', () => {
      const { container } = render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              href="/program"
              media={{ src: '/logo.png', alt: '' }}
              collapsible={false}
              subitems={
                <>
                  <SidebarItem href="/overview">Overview</SidebarItem>
                  <SidebarSeparator />
                  <SidebarItem href="/settings">Program settings</SidebarItem>
                </>
              }
            >
              HealthTech Traction 2027
            </SidebarItem>
            <SidebarSeparator />
            <SidebarItem href="/admin">Admin</SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const separators = container.querySelectorAll('li[aria-hidden="true"]');
      expect(separators).toHaveLength(2);
      expect(separators[0]).toHaveClass('my-1.5', 'mr-2', 'ml-5', 'bg-[var(--separator)]');
      expect(separators[1]).toHaveClass('mx-2', 'my-2.5', 'h-[var(--hairline)]');
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    it('lines the children of an icon row up with its label', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              icon={<svg />}
              defaultExpanded
              subitems={<SidebarItem href="/emails">Email templates</SidebarItem>}
            >
              Configuration
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: 'Email templates' })).toHaveClass(
        'pl-[calc(var(--space-2)+var(--icon-lg)+var(--space-2-5))]',
        'text-callout',
      );
    });

    it('keeps program stages and their steps at the console positions', () => {
      renderTree({ expanded: true });
      const program = screen.getByRole('link', { name: /^HealthTech/ });
      expect(program.closest('li')).toHaveClass('pl-1.5');
      expect(program).toHaveClass('pl-0.5', 'py-1', 'min-h-11', 'text-callout', 'font-semibold');
      expect(screen.getByRole('button', { name: /^Online review/ })).toHaveClass(
        'pl-5',
        'py-0',
        'min-h-[calc(var(--row-dense)-var(--space-0-5))]',
        'text-body',
      );
      expect(screen.getByRole('link', { name: 'Progress' })).toHaveClass(
        'pl-16.5',
        'py-0',
        'text-callout',
        'text-[var(--label-secondary)]',
      );
    });

    it('keeps a stage with no steps at the stage size', () => {
      renderTree({ subitems: undefined });
      expect(screen.getByRole('link', { name: /^Online review/ })).toHaveClass(
        'min-h-[calc(var(--row-dense)-var(--space-0-5))]',
        'text-body',
      );
    });

    it('turns hover into a teal label without a fill', () => {
      renderTree({ expanded: true });
      const progress = screen.getByRole('link', { name: 'Progress' });
      expect(progress).toHaveClass('hover:text-[var(--tint)]');
      expect(progress.className).not.toMatch(/hover:bg-/);
    });

    it('always shows the subitems of a row that cannot collapse', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              href="/program"
              collapsible={false}
              subitems={<SidebarItem href="/review">Online review</SidebarItem>}
            >
              HealthTech Traction 2027
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const program = screen.getByRole('link', { name: 'HealthTech Traction 2027' });
      expect(program).not.toHaveAttribute('aria-expanded');
      expect(program).not.toHaveAttribute('aria-controls');
      expect(program.querySelector('svg')).toBeNull();
      expect(screen.getByRole('link', { name: 'Online review' })).toBeVisible();
    });

    const staticProgramSidebar = () => (
      <Sidebar label="Console">
        <SidebarSection>
          <SidebarItem
            media={{ src: '/logo.png', alt: '' }}
            collapsible={false}
            subitems={<SidebarItem href="/review">Online review</SidebarItem>}
          >
            HealthTech Traction 2027
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    );

    it('shows a row that cannot collapse and has no destination as plain text', async () => {
      render(staticProgramSidebar());
      const name = screen.getByText('HealthTech Traction 2027');
      const row = name.closest('li')?.firstElementChild;
      expect(row?.tagName).toBe('DIV');
      expect(row).not.toHaveAttribute('tabindex');
      expect(row).not.toHaveAttribute('aria-expanded');
      expect(row).not.toHaveClass('cursor-pointer');
      expect(screen.queryByRole('button')).toBeNull();
      expect(screen.getAllByRole('link')).toHaveLength(1);
      await userEvent.tab();
      expect(screen.getByRole('link', { name: 'Online review' })).toHaveFocus();
    });

    it('keeps the compact overlay open when a plain row is clicked', async () => {
      vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      render(
        <AppShell sidebar={staticProgramSidebar()} toolbar={<Toolbar title="Overview" />}>
          <p>Content</p>
        </AppShell>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
      const overlay = screen.getByRole('dialog', { name: 'Navigation' });
      await userEvent.click(within(overlay).getByText('HealthTech Traction 2027'));
      expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
    });

    it('turns a parent without a destination into a disclosure button', async () => {
      const onExpandedChange = vi.fn();
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              onExpandedChange={onExpandedChange}
              subitems={<SidebarItem href="/emails">Email templates</SidebarItem>}
            >
              Configuration
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const group = screen.getByRole('button', { name: 'Configuration' });
      expect(group).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('link', { name: 'Email templates' })).not.toBeInTheDocument();
      await userEvent.click(group);
      expect(group).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('link', { name: 'Email templates' })).toBeVisible();
      expect(onExpandedChange).toHaveBeenLastCalledWith(true);
      await userEvent.click(group);
      expect(group).toHaveAttribute('aria-expanded', 'false');
      expect(onExpandedChange).toHaveBeenLastCalledWith(false);
    });

    it('leaves a controlled disclosure to the product', async () => {
      const onExpandedChange = vi.fn();
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              expanded={false}
              onExpandedChange={onExpandedChange}
              subitems={<SidebarItem href="/emails">Email templates</SidebarItem>}
            >
              Configuration
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const group = screen.getByRole('button', { name: 'Configuration' });
      await userEvent.click(group);
      expect(onExpandedChange).toHaveBeenCalledWith(true);
      expect(group).toHaveAttribute('aria-expanded', 'false');
    });

    it('gives no disclosure state to an item without subitems', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/home" subitems={[]}>
              Home
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-expanded');
    });

    it('rotates the chevron to show an open branch', () => {
      renderTree({ expanded: true });
      const chevron = screen
        .getByRole('button', { name: /^Online review/ })
        .querySelector('svg[aria-hidden="true"]:last-child');
      expect(chevron).toHaveClass('rotate-90');
    });

    it.each([
      ['done', 'completed', null],
      ['now', 'in progress', null],
      ['next', 'not started', '3'],
    ] as const)(
      'shows a %s stage marker with its label for assistive technology',
      (state, label, number) => {
        render(
          <Sidebar>
            <SidebarSection>
              <SidebarItem href="/stage" marker={{ state, number: 3, label }}>
                Online review
              </SidebarItem>
            </SidebarSection>
          </Sidebar>,
        );
        const stage = screen.getByRole('link', { name: `Online review, ${label}` });
        const marker = stage.querySelector(`[data-marker="${state}"]`);
        expect(marker).toHaveAttribute('aria-hidden', 'true');
        expect(marker?.textContent || null).toBe(number);
        expect(screen.getByText('Online review')).toHaveAttribute('aria-hidden', 'true');
      },
    );

    it('names a role tag once, after the label it adds to', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/program" accessory={<RoleTag tone="pm">PM</RoleTag>}>
              Boston 2026
            </SidebarItem>
            <SidebarItem href="/admin" accessory={<RoleTag tone="admin">Admin</RoleTag>}>
              Admin
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: 'Boston 2026, PM' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
      expect(screen.getByText('PM')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getAllByText('Admin')).toHaveLength(2);
    });

    it('leaves an accessory that is not a role tag to speak for itself', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/inbox" accessory={<span>New</span>}>
              Inbox
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByText('New')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByText('Inbox')).not.toHaveAttribute('aria-hidden');
    });

    it('reads a number label once and leaves a rich role tag to speak for itself', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/cohort" accessory={<RoleTag>{2027}</RoleTag>}>
              {2027}
            </SidebarItem>
            <SidebarItem
              href="/judging"
              accessory={
                <RoleTag tone="judge">
                  <span>Judge</span>
                </RoleTag>
              }
            >
              Evaluation
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: '2027' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Evaluation\s?Judge$/ })).toBeInTheDocument();
      expect(screen.getByText('Judge').parentElement).not.toHaveAttribute('aria-hidden');
    });

    it('keeps a program nested under an icon row at the console positions', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              icon={<svg />}
              accessory={<RoleTag tone="pm">PM</RoleTag>}
              defaultExpanded
              subitems={
                <SidebarItem
                  href="/program"
                  media={{ src: '/logo.png', alt: '' }}
                  collapsible={false}
                  subitems={
                    <>
                      <SidebarItem href="/overview" icon={<svg />}>
                        Overview
                      </SidebarItem>
                      <SidebarItem
                        marker={{ state: 'now', label: 'in progress' }}
                        defaultExpanded
                        subitems={<SidebarItem href="/progress">Progress</SidebarItem>}
                      >
                        Online review
                      </SidebarItem>
                    </>
                  }
                >
                  HealthTech Traction 2027
                </SidebarItem>
              }
            >
              Program Manager
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: /^HealthTech/ })).toHaveClass('pl-0.5', 'min-h-11');
      expect(screen.getByRole('link', { name: 'Overview' })).toHaveClass('pl-5');
      expect(screen.getByRole('button', { name: /^Online review/ })).toHaveClass('pl-5');
      expect(screen.getByRole('link', { name: 'Progress' })).toHaveClass('pl-16.5');
    });

    const coverlessProgramUnderPersona = (programHref?: string) => (
      <Sidebar>
        <SidebarSection>
          <SidebarItem
            icon={<svg />}
            defaultExpanded
            subitems={
              <SidebarItem
                href={programHref}
                collapsible={false}
                subitems={
                  <>
                    <SidebarItem href="/overview" icon={<svg />}>
                      Overview
                    </SidebarItem>
                    <SidebarItem
                      marker={{ state: 'now', label: 'in progress' }}
                      defaultExpanded
                      subitems={<SidebarItem href="/progress">Progress</SidebarItem>}
                    >
                      Online review
                    </SidebarItem>
                  </>
                }
              >
                HealthTech Traction 2027
              </SidebarItem>
            }
          >
            Program Manager
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    );

    it('places a program without media at the console positions under an icon row', () => {
      render(coverlessProgramUnderPersona());
      const programRow = screen
        .getByText('HealthTech Traction 2027')
        .closest('li')?.firstElementChild;
      expect(programRow).toHaveClass('pl-0.5', 'min-h-11', 'text-callout', 'font-semibold');
      expect(programRow).not.toHaveClass(
        'pl-[calc(var(--space-2)+var(--icon-lg)+var(--space-2-5))]',
      );
      expect(screen.getByRole('link', { name: 'Overview' })).toHaveClass('pl-5');
      expect(screen.getByRole('button', { name: /^Online review/ })).toHaveClass('pl-5');
      expect(screen.getByRole('link', { name: 'Progress' })).toHaveClass('pl-16.5');
      expect(screen.queryByRole('img')).toBeNull();
    });

    it('keeps a program without media and without a destination as plain text', () => {
      render(coverlessProgramUnderPersona());
      const name = screen.getByText('HealthTech Traction 2027');
      const programRow = name.closest('li')?.firstElementChild;
      expect(name).toHaveClass('line-clamp-2');
      expect(programRow?.tagName).toBe('DIV');
      expect(programRow).not.toHaveAttribute('tabindex');
      expect(programRow).not.toHaveClass('cursor-pointer');
      expect(screen.queryByRole('link', { name: /^HealthTech/ })).toBeNull();
    });

    it('keeps a program without media that has a destination a link at the top indent', () => {
      render(coverlessProgramUnderPersona('/program'));
      expect(screen.getByRole('link', { name: 'HealthTech Traction 2027' })).toHaveClass(
        'pl-0.5',
        'text-callout',
        'font-semibold',
      );
      expect(screen.getByRole('link', { name: 'Progress' })).toHaveClass('pl-16.5');
    });

    it('starts the children of a top level program without media at the stage indent', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              collapsible={false}
              subitems={
                <SidebarItem
                  marker={{ state: 'next', number: 2, label: 'not started' }}
                  defaultExpanded
                  subitems={<SidebarItem href="/schedule">Schedule</SidebarItem>}
                >
                  Pitch round
                </SidebarItem>
              }
            >
              HealthTech Traction 2027
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const programRow = screen
        .getByText('HealthTech Traction 2027')
        .closest('li')?.firstElementChild;
      expect(programRow).toHaveClass('pl-0.5', 'min-h-11', 'font-semibold');
      expect(screen.getByRole('button', { name: /^Pitch round/ })).toHaveClass('pl-5');
      expect(screen.getByRole('link', { name: 'Schedule' })).toHaveClass('pl-16.5');
    });

    it('crops program media to fill a rounded thumbnail beside a name that wraps', () => {
      renderTree();
      const logo = screen.getByRole('img', { name: 'HealthTech logo' });
      expect(logo).toHaveAttribute('src', '/logo.png');
      expect(logo).toHaveClass(
        'object-cover',
        'w-15',
        'h-9',
        'rounded-[var(--corner-thumbnail)]',
        'bg-[var(--bg)]',
        'outline-1',
        'outline-[var(--separator)]',
        '-outline-offset-1',
      );
      expect(screen.getByText('HealthTech Traction 2027')).toHaveClass('line-clamp-2');
    });

    it('wraps labels at every depth to two lines instead of truncating', () => {
      renderTree({ expanded: true });
      const labels: [HTMLElement | null, string][] = [
        [screen.getByText('HealthTech Traction 2027'), 'leading-4.5'],
        [screen.getByText('Online review').parentElement, 'leading-5.5'],
        [screen.getByText('Progress'), 'leading-5.5'],
      ];
      labels.forEach(([label, leading]) => {
        expect(label).toHaveClass('line-clamp-2', leading);
        expect(label).not.toHaveClass('truncate');
      });
    });

    it('sets a top level parent label on the 20px line of the console design', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              icon={<svg />}
              subitems={<SidebarItem href="/network/profile">Profile</SidebarItem>}
            >
              Network
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByText('Network')).toHaveClass('leading-5');
      expect(screen.getByRole('button', { name: 'Network' })).toHaveClass('py-0');
    });

    it('draws row icons with the Propellant icon stroke', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/home" icon={<svg data-testid="home-icon" />}>
              Home
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByTestId('home-icon').parentElement).toHaveClass(
        '[&>svg]:[stroke-width:var(--icon-stroke)]',
      );
    });

    it('sets marker numbers without the caption tracking', () => {
      renderTree();
      const marker = screen
        .getByRole('button', { name: /^Online review/ })
        .querySelector('[data-marker="next"]');
      expect(marker).toHaveClass('text-caption2', 'tracking-normal');
    });

    it('keeps the spoken label inside the clipped label so it cannot widen the row', () => {
      renderTree({ expanded: true });
      const spoken = screen.getByText('Online review, not started');
      expect(spoken).toHaveClass('sr-only');
      expect(spoken.parentElement).toHaveClass('relative', 'line-clamp-2');
    });
  });
  describe('linked parents and logos', () => {
    const companiesTree = (onToggle = vi.fn()) => (
      <Sidebar>
        <SidebarSection>
          <SidebarItem
            href="/companies"
            navigates
            expanded={false}
            onExpandedChange={onToggle}
            subitems={
              <SidebarItem
                media={{ src: '/careloop.png', alt: '', shape: 'logo' }}
                defaultExpanded
                subitems={
                  <>
                    <SidebarItem href="/companies/7">Profile</SidebarItem>
                    <SidebarItem href="/companies/7/team">Team</SidebarItem>
                  </>
                }
              >
                CareLoop
              </SidebarItem>
            }
          >
            Your companies
          </SidebarItem>
        </SidebarSection>
      </Sidebar>
    );

    it('makes a parent with an href a link that opens its list, with its own toggle', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(companiesTree(onToggle));
      const link = screen.getByRole('link', { name: 'Your companies' });
      expect(link).toHaveAttribute('href', '/companies');
      expect(link).not.toHaveAttribute('aria-expanded');
      const toggle = screen.getByRole('button', { name: 'Show Your companies pages' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await user.click(toggle);
      expect(onToggle).toHaveBeenLastCalledWith(true);
      link.addEventListener('click', (event) => event.preventDefault());
      await user.click(link);
      expect(onToggle).toHaveBeenCalledTimes(2);
    });

    it('keeps an open linked parent open when its link is followed', async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              href="/companies"
              navigates
              expanded
              onExpandedChange={onToggle}
              subitems={<SidebarItem href="/companies/7">CareLoop</SidebarItem>}
            >
              Your companies
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const link = screen.getByRole('link', { name: 'Your companies' });
      link.addEventListener('click', (event) => event.preventDefault());
      await user.click(link);
      expect(onToggle).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: 'Hide Your companies pages' }));
      expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('names the toggle generically when the label is not plain text', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem navigates href="/x" subitems={<SidebarItem href="/y">Child</SidebarItem>}>
              <strong>Bold</strong>
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('button', { name: 'Show section pages' })).toBeInTheDocument();
    });

    it('lines companies up with a linked parent and their pages up with the name', () => {
      const { container } = render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              icon={<svg />}
              defaultExpanded
              subitems={
                <SidebarItem
                  href="/companies"
                  navigates
                  defaultExpanded
                  subitems={
                    <>
                      <SidebarItem
                        media={{ src: '/careloop.png', alt: '', shape: 'logo' }}
                        defaultExpanded
                        subitems={<SidebarItem href="/companies/7">Profile</SidebarItem>}
                      >
                        CareLoop
                      </SidebarItem>
                      <SidebarItem
                        media={{ alt: '', shape: 'logo', initials: 'LG' }}
                        defaultExpanded
                        subitems={<SidebarItem href="/companies/8">Team</SidebarItem>}
                      >
                        Lattice Genomics
                      </SidebarItem>
                    </>
                  }
                >
                  Your companies
                </SidebarItem>
              }
            >
              Network
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      const iconLabel = 'pl-[calc(var(--space-2)+var(--icon-lg)+var(--space-2-5))]';
      const underName =
        'pl-[calc(var(--space-2)+var(--icon-lg)+var(--space-2-5)+var(--avatar-xs)+var(--space-2-5))]';
      expect(screen.getByRole('link', { name: 'Your companies' })).toHaveClass(iconLabel);
      expect(screen.getByRole('button', { name: 'CareLoop' })).toHaveClass(iconLabel);
      expect(screen.getByRole('link', { name: 'Profile' })).toHaveClass(underName);
      expect(screen.getByRole('link', { name: 'Team' })).toHaveClass(underName);
      const logo = container.querySelector('img[src="/careloop.png"]');
      expect(logo).toHaveClass('w-[var(--avatar-xs)]', 'h-[var(--avatar-xs)]', 'object-contain');
      const initials = screen.getByText('LG');
      expect(initials).toHaveAttribute('aria-hidden', 'true');
      expect(initials).toHaveClass('bg-[var(--tint)]', 'w-[var(--avatar-xs)]');
    });

    it('lines the pages of a top level logo row up with its name', () => {
      render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem
              defaultExpanded
              subitems={
                <SidebarItem
                  media={{ alt: '', shape: 'logo', initials: 'CL' }}
                  defaultExpanded
                  subitems={<SidebarItem href="/p">Profile</SidebarItem>}
                >
                  CareLoop
                </SidebarItem>
              }
            >
              Companies
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(screen.getByRole('link', { name: 'Profile' })).toHaveClass(
        'pl-[calc(1.625rem+var(--avatar-xs)+var(--space-2-5))]',
      );
    });

    it('keeps program covers cropped', () => {
      const { container } = render(
        <Sidebar>
          <SidebarSection>
            <SidebarItem href="/p" media={{ src: '/cover.png', alt: '' }}>
              Program
            </SidebarItem>
          </SidebarSection>
        </Sidebar>,
      );
      expect(container.querySelector('img')).toHaveClass('w-15', 'object-cover');
    });
  });
});
