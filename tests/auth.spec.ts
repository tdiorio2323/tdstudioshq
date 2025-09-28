import { test, expect } from '@playwright/test';

test.describe('Authentication and Landing Page', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Check page title
    await expect(page).toHaveTitle(/TD Studios/);

    // Check main logo is visible
    await expect(page.locator('img[alt="TD Studios"]')).toBeVisible();

    // Check welcome text
    await expect(page.locator('h2')).toContainText('Welcome to TD STUDIOS');

    // Check all navigation buttons are present
    await expect(page.locator('button:has-text("AGENCY")')).toBeVisible();
    await expect(page.locator('button:has-text("DIGITAL")')).toBeVisible();
    await expect(page.locator('button:has-text("DESIGNS")')).toBeVisible();
    await expect(page.locator('button:has-text("SHOP")')).toBeVisible();
    await expect(page.locator('button:has-text("CONTACT")')).toBeVisible();

    // Check Instagram button
    await expect(page.locator('button:has-text("FOLLOW @TDSTUDIOSCO")')).toBeVisible();
  });

  test('navigation buttons work correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Test DESIGNS button navigation
    await page.click('button:has-text("DESIGNS")');
    await expect(page).toHaveURL('http://localhost:5173/mylars');

    // Go back to home
    await page.goto('http://localhost:5173/');

    // Test SHOP button navigation
    await page.click('button:has-text("SHOP")');
    await expect(page).toHaveURL('http://localhost:5173/shop');
  });

  test('external links have correct attributes', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Test AGENCY button opens external link
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("AGENCY")')
    ]);

    await expect(newPage).toHaveURL(/tdstudiosny\.com/);
    await newPage.close();

    // Test DIGITAL button opens external link
    const [digitalPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("DIGITAL")')
    ]);

    await expect(digitalPage).toHaveURL(/tdstudiosdigital\.com/);
    await digitalPage.close();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/');

    // Check that elements are still visible on mobile
    await expect(page.locator('img[alt="TD Studios"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Welcome to TD STUDIOS');

    // Check that buttons are properly sized for mobile
    const shopButton = page.locator('button:has-text("SHOP")');
    await expect(shopButton).toBeVisible();

    const boundingBox = await shopButton.boundingBox();
    expect(boundingBox?.height).toBeGreaterThan(40); // Ensure touch-friendly size
  });
});