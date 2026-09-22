import { test, expect, devices } from '@playwright/test';

test.use({
    ...devices['iPhone 13'],
});

test('Mobile Golden Path: Browse and View Product', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');

    // 2. Check for Dalab logo
    await expect(page.locator('img[alt="dalab logo"]')).toBeVisible();

    // 3. Find a product card and click it
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.click();

    // 4. Verify we are on the product page
    await expect(page).toHaveURL(/\/product\//);

    // 5. Check if "ADD TO CART" button is visible
    await expect(page.getByRole('button', { name: /ADD TO CART/i })).toBeVisible();
});
