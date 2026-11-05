import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './vr',
  snapshotPathTemplate: 'vr/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command:
      "python3 -c \"import http.server,socketserver,functools; socketserver.ThreadingTCPServer(('127.0.0.1',6007), functools.partial(http.server.SimpleHTTPRequestHandler, directory='storybook-static')).serve_forever()\"",
    url: 'http://127.0.0.1:6007/iframe.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:6007',
    viewport: { width: 800, height: 600 },
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.25,
      animations: 'disabled',
      caret: 'hide',
    },
  },
});
