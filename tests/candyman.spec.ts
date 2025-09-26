import { test, expect } from '@playwright/test';

test.describe('Candyman Exotics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/candyman');
  });

  test('candyman page loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/TD Studios/);

    // Check Candyman Exotics logo is visible
    await expect(page.locator('img[alt="Candyman Exotics"]')).toBeVisible();

    // Check heading
    await expect(page.locator('h2')).toContainText('CANDYMAN EXOTICS');

    // Check action buttons
    await expect(page.locator('button:has-text("FOLLOW")')).toBeVisible();
    await expect(page.locator('button:has-text("TELEGRAM")')).toBeVisible();

    // Check TD Studios social button
    await expect(page.locator('button:has-text("FOLLOW @TDSTUDIOSCO")')).toBeVisible();
  });

  test('image slideshow functionality', async ({ page }) => {
    // Wait for slideshow to load
    await page.waitForSelector('img[alt*="Candyman"]', { timeout: 10000 });

    // Get initial image src
    const slideImage = page.locator('img[alt*="Candyman"]').first();
    const initialSrc = await slideImage.getAttribute('src');

    // Wait for slideshow to change (should change every 2 seconds)
    await page.waitForTimeout(2500);

    // Check if image has changed
    const newSrc = await slideImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('external links work correctly', async ({ page }) => {
    // Test Instagram FOLLOW button
    const [instagramPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("FOLLOW")')
    ]);

    await expect(instagramPage).toHaveURL(/instagram\.com.*candyman.*exotics/i);
    await instagramPage.close();

    // Test Telegram button
    const [telegramPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("TELEGRAM")')
    ]);

    await expect(telegramPage).toHaveURL(/t\.me/);
    await telegramPage.close();

    // Test TD Studios Instagram button
    const [tdInstagramPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button:has-text("FOLLOW @TDSTUDIOSCO")')
    ]);

    await expect(tdInstagramPage).toHaveURL(/instagram\.com.*tdstudiosco/i);
    await tdInstagramPage.close();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that elements are visible on mobile
    await expect(page.locator('img[alt="Candyman Exotics"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('CANDYMAN EXOTICS');

    // Check button touch targets
    const followButton = page.locator('button:has-text("FOLLOW")');
    await expect(followButton).toBeVisible();

    const boundingBox = await followButton.boundingBox();
    expect(boundingBox?.height).toBeGreaterThan(40); // Touch-friendly size
  });

  test('page accessibility', async ({ page }) => {
    // Check for alt text on images
    await expect(page.locator('img[alt="Candyman Exotics"]')).toBeVisible();
    await expect(page.locator('img[alt*="Candyman"]')).toBeVisible();

    // Check for proper heading structure
    await expect(page.locator('h2')).toContainText('CANDYMAN EXOTICS');

    // Check button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text?.length).toBeGreaterThan(0); // Buttons should have text
    }
  });

  test('slideshow images load properly', async ({ page }) => {
    // Wait for first image to load
    const slideImage = page.locator('img[alt*="Candyman"]').first();
    await expect(slideImage).toBeVisible();

    // Check that image has loaded successfully
    const naturalWidth = await slideImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    // Wait for slideshow to advance and check next image
    await page.waitForTimeout(2500);

    const newNaturalWidth = await slideImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(newNaturalWidth).toBeGreaterThan(0);
  });
});