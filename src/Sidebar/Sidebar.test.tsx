import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarItem, SidebarSection } from './Sidebar';

afterEach(cleanup);

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
});
