import { test, expect } from '@playwright/test';

test('capture public home', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Make inbox decisions with context, not panic\./i })
  ).toBeVisible();
  await expect(
    page.getByText(/The first screen should make the product promise obvious/i)
  ).toBeVisible();
  await page.screenshot({ path: '/tmp/email-cleaner-home-review.png', fullPage: true });
});
