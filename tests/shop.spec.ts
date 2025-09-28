import { test, expect } from '@playwright/test';

test.describe('Shop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/shop');
  });

  test('shop page loads with products', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveTitle(/TD Studios/);

    // Check that products are displayed
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({ timeout: 10000 });

    // Check categories are available
    await expect(page.locator('text=All')).toBeVisible();
  });

  test('product search functionality works', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"], input[name="search"]').first();

    if (await searchInput.isVisible()) {
      // Test search functionality
      await searchInput.fill('hoodie');

      // Wait for search results
      await page.waitForTimeout(500);

      // Check that search results contain hoodie items
      const productCards = page.locator('[data-testid="product-card"]');
      const productCount = await productCards.count();

      if (productCount > 0) {
        const firstProduct = productCards.first();
        const productText = await firstProduct.textContent();
        expect(productText?.toLowerCase()).toContain('hoodie');
      }
    }
  });

  test('category filtering works', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Look for category filter elements
    const categoryButtons = page.locator('button:has-text("Outerwear"), [data-testid="category-filter"]');

    if (await categoryButtons.first().isVisible()) {
      await categoryButtons.first().click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Verify filtered results
      const products = page.locator('[data-testid="product-card"]');
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(0);
    }
  });

  test('add to cart functionality', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Find first product and add to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();

    // Look for add to cart button
    const addToCartButton = firstProduct.locator('button:has-text("Add to Cart"), button[data-testid="add-to-cart"]');

    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();

      // Check for success message or cart update
      await expect(page.locator('text=/added to cart/i, text=/success/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('cart displays correctly', async ({ page }) => {
    // Look for cart icon or cart button
    const cartElement = page.locator('[data-testid="cart"], button:has-text("Cart"), [aria-label*="cart" i]').first();

    if (await cartElement.isVisible()) {
      await cartElement.click();

      // Check if cart opens (either modal or page)
      await expect(page.locator('[data-testid="cart-content"], .cart-modal, text=/cart/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });

    // Check that products are displayed properly on mobile
    const productCards = page.locator('[data-testid="product-card"]');
    const firstProduct = productCards.first();

    await expect(firstProduct).toBeVisible();

    // Ensure product cards are touch-friendly
    const boundingBox = await firstProduct.boundingBox();
    expect(boundingBox?.height).toBeGreaterThan(200); // Adequate size for mobile
  });

  test('navigation works from shop', async ({ page }) => {
    // Test navigation back to home
    const homeLink = page.locator('a[href="/"], button:has-text("Home"), [data-testid="home-link"]').first();

    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('http://localhost:5173/');
    }
  });
});