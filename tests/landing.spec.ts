import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should render the landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Strelligence/);
  });

  test("should display the hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("text=Strelligence").first();
    await expect(hero).toBeVisible();
  });

  test("should have a connect wallet button", async ({ page }) => {
    await page.goto("/");
    const connectButton = page.locator("text=Connect Wallet").first();
    await expect(connectButton).toBeVisible();
  });

  test("should navigate to connect page", async ({ page }) => {
    await page.goto("/");
    const connectButton = page.locator("text=Connect Wallet").first();
    await connectButton.click();
    await expect(page).toHaveURL(/\/connect/);
  });
});
