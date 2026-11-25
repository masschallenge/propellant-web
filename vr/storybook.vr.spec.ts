import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Entry = { type: string; id: string; name: string; title: string; tags?: string[] };
const indexPath = resolve(process.cwd(), 'storybook-static', 'index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as { entries: Record<string, Entry> };

const VR_TODAY = new Date('2026-10-29T12:00:00');

type StorybookPreviewWindow = Window & {
  __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } };
};

const waitForStoryRendered = async (page: Page) => {
  await page.waitForFunction(() => {
    const storyRoot = document.getElementById('storybook-root');
    const bodyClasses = document.body.classList;
    const renderPhase = (window as StorybookPreviewWindow).__STORYBOOK_PREVIEW__?.currentRender
      ?.phase;
    return (
      renderPhase === 'finished' &&
      bodyClasses.contains('sb-show-main') &&
      !bodyClasses.contains('sb-show-preparing-story') &&
      storyRoot !== null &&
      storyRoot.childElementCount > 0
    );
  });
};

const STORIES_CAPTURED_WITH_SIDEBAR_OPEN = new Set([
  'components-layout-sidebar--tree-in-compact-overlay',
  'components-layout-appshell--console-without-toolbar-compact',
]);

const STORIES_CAPTURED_WITH_MENU_OPEN = new Map([
  ['components-overlays-menu--account-menu-with-avatar', 'Joe Schwendt'],
  ['components-overlays-menu--item-menu-with-links', 'Judging round'],
  ['components-overlays-menu--icon-button-trigger', 'More actions for this item'],
  ['components-overlays-menu--with-descriptions', 'More actions'],
  ['components-overlays-menu--wide-menu', 'More actions'],
  ['components-overlays-menu--medium-size', 'More for Pitch video'],
  ['components-overlays-menu--medium-size-with-descriptions', 'More actions'],
]);

const STORIES_CAPTURED_WIDE = new Set([
  'components-layout-appshell--tree',
  'components-layout-appshell--console-without-toolbar',
  'components-layout-appshell--rail',
  'components-layout-sidebar--tree',
  'components-layout-sidebar--linked-parent-with-logos',
  'components-layout-sidebar--program-under-persona',
  'components-layout-sidebar--program-without-cover-under-persona',
  'components-overlays-sheet--content-placement',
  'components-overlays-sheet--content-placement-rail',
  'components-overlays-sheet--content-placement-collapsed',
  'components-overlays-sheet--content-placement-extra-large',
]);

const WIDE_VIEWPORT = { width: 1280, height: 800 };

const openCompactSidebar = async (page: Page) => {
  await page.getByRole('button', { name: 'Show sidebar' }).dispatchEvent('click');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
};

const openMenu = async (page: Page, triggerName: string) => {
  await page.getByRole('button', { name: triggerName }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.mouse.move(0, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
};

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && !(entry.tags ?? []).includes('interaction'),
);

test.describe('story visual regression', () => {
  for (const story of stories) {
    test(story.id, async ({ page }) => {
      await page.clock.setFixedTime(VR_TODAY);
      if (STORIES_CAPTURED_WIDE.has(story.id)) await page.setViewportSize(WIDE_VIEWPORT);
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await waitForStoryRendered(page);
      if (STORIES_CAPTURED_WITH_SIDEBAR_OPEN.has(story.id)) await openCompactSidebar(page);
      const menuTrigger = STORIES_CAPTURED_WITH_MENU_OPEN.get(story.id);
      if (menuTrigger) await openMenu(page, menuTrigger);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot([`${story.id}.png`], { fullPage: true });
    });
  }
});
