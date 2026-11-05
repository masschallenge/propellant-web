import { useEffect, useState } from 'react';
import {
  AppShell,
  SegmentedControl,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Toolbar,
} from '../../src/index';
import { version } from 'virtual:propellant-site-data';
import { moduleForSlug } from './catalog';
import { ComponentPage } from './pages/ComponentPage';
import { ROUTES, SECTIONS } from './routes';
import { useHashRoute } from './useHashRoute';

const APPEARANCES = [
  { id: 'system', label: 'Auto' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

const useAppearance = () => {
  const [appearance, setAppearance] = useState('system');
  useEffect(() => {
    const root = document.documentElement;
    if (appearance === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', appearance);
  }, [appearance]);
  return [appearance, setAppearance] as const;
};

const SiteSidebar = ({ currentId }: { currentId: string }) => (
  <Sidebar
    label="Propellant"
    header={
      <a
        href="#overview"
        className="flex flex-col no-underline rounded-[var(--corner-md)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
      >
        <span className="font-[family-name:var(--type-family-brand)] font-medium uppercase text-[1.375rem] leading-none tracking-[0.02em] text-[var(--label)]">
          Propellant
        </span>
        <span className="text-footnote text-[var(--label-tertiary)] tabular-nums">
          Version {version}
        </span>
      </a>
    }
  >
    {SECTIONS.map((section) => (
      <SidebarSection key={section} title={section}>
        {ROUTES.filter((route) => route.section === section).map((route) => (
          <SidebarItem key={route.id} href={`#${route.id}`} current={currentId === route.id}>
            {route.title}
          </SidebarItem>
        ))}
      </SidebarSection>
    ))}
  </Sidebar>
);

export const App = () => {
  const routeId = useHashRoute('overview');
  const [appearance, setAppearance] = useAppearance();
  const componentModule = moduleForSlug(routeId);
  const route = ROUTES.find((candidate) => candidate.id === routeId) ?? ROUTES[0];
  const currentId = componentModule ? 'components' : route.id;
  const title = componentModule ? componentModule.module : route.title;

  useEffect(() => {
    document.title =
      route.id === 'overview' && !componentModule ? 'Propellant' : `${title} | Propellant`;
  }, [componentModule, route.id, title]);

  return (
    <AppShell
      appearance="system"
      sidebar={<SiteSidebar currentId={currentId} />}
      toolbar={
        <Toolbar
          title={title}
          trailing={
            <SegmentedControl
              aria-label="Appearance"
              size="sm"
              items={APPEARANCES}
              value={appearance}
              onChange={setAppearance}
            />
          }
        />
      }
    >
      <div className="w-full max-w-[1120px] mx-auto">
        {componentModule ? <ComponentPage entry={componentModule} /> : <route.Page />}
      </div>
    </AppShell>
  );
};
