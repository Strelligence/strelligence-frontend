import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should redirect to connect when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/connect/);
  });

  test("should show loading state while checking auth", async ({ page }) => {
    await page.goto("/dashboard");
    const loading = page.locator("text=Loading...");
    await expect(loading).toBeVisible();
  });
});
