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
]);

const openCompactSidebar = async (page: Page) => {
  await page.getByRole('button', { name: 'Show sidebar' }).dispatchEvent('click');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
};

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && !(entry.tags ?? []).includes('interaction'),
);

test.describe('story visual regression', () => {
  for (const story of stories) {
    test(story.id, async ({ page }) => {
      await page.clock.setFixedTime(VR_TODAY);
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await waitForStoryRendered(page);
      if (STORIES_CAPTURED_WITH_SIDEBAR_OPEN.has(story.id)) await openCompactSidebar(page);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot([`${story.id}.png`], { fullPage: true });
    });
  }
});
