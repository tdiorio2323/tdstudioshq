import { test, expect } from "@playwright/test";

test("add to cart and checkout", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: /add/i }).first().click();
  await page.goto("/checkout");
  await expect(page.getByText(/Purchase/i)).toBeVisible();
});