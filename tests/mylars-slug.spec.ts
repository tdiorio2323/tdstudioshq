import { test, expect } from "@playwright/test";

test("mylar detail route loads", async ({ page }) => {
  await page.goto("/mylars");
  await page.goto("/mylars/logo-revamp"); // adjust to real slug in data
  await expect(page.getByText(/Mylar/i)).toBeVisible();
});