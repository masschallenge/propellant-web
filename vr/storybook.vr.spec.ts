import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Entry = { type: string; id: string; name: string; title: string; tags?: string[] };
const indexPath = resolve(process.cwd(), 'storybook-static', 'index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf-8')) as { entries: Record<string, Entry> };

const VR_TODAY = new Date('2026-10-29T12:00:00');

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && !(entry.tags ?? []).includes('interaction'),
);

test.describe('story visual regression', () => {
  for (const story of stories) {
    test(story.id, async ({ page }) => {
      await page.clock.setFixedTime(VR_TODAY);
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForSelector('#storybook-root [data-propellant], #storybook-root', {
        state: 'attached',
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      await expect(page).toHaveScreenshot([`${story.id}.png`], { fullPage: true });
    });
  }
});
