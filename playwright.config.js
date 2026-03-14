// Governance note: Playwright config for HU19 browser validation. Do not delete casually.
// Purpose: run local E2E against the controlled Fastify fixture Inbox and authenticated session cookie.

/* eslint-env node */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results/',
  use: {
    baseURL: process.env.E2E_FRONTEND_URL || 'http://localhost:5173',
    browserName: 'chromium',
    headless: true,
    testIdAttribute: 'data-testid',
    actionTimeout: 10_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
});
