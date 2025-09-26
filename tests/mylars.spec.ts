import { test, expect } from '@playwright/test';

test('slug page has title, og image, and returns 200', async ({ page }) => {
  const slug = process.env.SLUG || '3designs';
  await page.goto(`http://localhost:5173/mylars/${slug}`);
  await expect(page).toHaveTitle(/TD Studios/);
  const ogImg = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogImg && ogImg.startsWith('http')).toBeTruthy();
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLd && jsonLd.includes('"@type":"Product"')).toBeTruthy();
});