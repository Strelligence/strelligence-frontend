import { test, expect } from "@playwright/test";

test.describe("Connect Page", () => {
  test("should render the connect page", async ({ page }) => {
    await page.goto("/connect");
    await expect(page.locator("text=Connect your Stellar wallet")).toBeVisible();
  });

  test("should display the Strelligence branding", async ({ page }) => {
    await page.goto("/connect");
    await expect(page.locator("text=Strelligence").first()).toBeVisible();
  });

  test("should show wallet connection info", async ({ page }) => {
    await page.goto("/connect");
    await expect(page.locator("text=Non-custodial")).toBeVisible();
    await expect(page.locator("text=Instant sync")).toBeVisible();
  });
});
