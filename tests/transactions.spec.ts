import { test, expect } from "@playwright/test";

test.describe("Transactions Page", () => {
  test("should redirect to connect when not authenticated", async ({ page }) => {
    await page.goto("/dashboard/transactions");
    await expect(page).toHaveURL(/\/connect/);
  });
});

test.describe("Transactions Page - Authenticated", () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth state
    await page.addInitScript(() => {
      sessionStorage.setItem(
        "strelligence-auth",
        JSON.stringify({
          state: {
            address: "GABC12345678901234567890123456789012345678901234567890ABCD",
            network: { passphrase: "Public Global Stellar Network ; September 2015" },
            walletName: "Freighter",
            jwt: "mock-jwt-token",
          },
          version: 0,
        })
      );
    });
  });

  test("should render the transactions page", async ({ page }) => {
    await page.route("**/api/wallet/*/transactions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transactions: [],
          cursor: null,
          total: 0,
        }),
      })
    );

    await page.goto("/dashboard/transactions");
    await expect(page.locator("text=Date")).toBeVisible();
  });

  test("should display filter options", async ({ page }) => {
    await page.route("**/api/wallet/*/transactions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transactions: [],
          cursor: null,
          total: 0,
        }),
      })
    );

    await page.goto("/dashboard/transactions");
    await expect(page.locator("text=Type")).toBeVisible();
    await expect(page.locator("text=Asset")).toBeVisible();
  });

  test("should show empty state when no transactions", async ({ page }) => {
    await page.route("**/api/wallet/*/transactions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transactions: [],
          cursor: null,
          total: 0,
        }),
      })
    );

    await page.goto("/dashboard/transactions");
    await expect(page.locator("text=No transactions found")).toBeVisible();
  });
});
