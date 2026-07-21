import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://localhost:5173';

async function goToHome(page: Page) {
	await page.goto(BASE, { waitUntil: 'networkidle' });
}

test.describe('Tooltip Component', () => {
	test.beforeEach(async ({ page }) => {
		await goToHome(page);
	});

	test('tooltip help buttons exist in the how-to-bet section', async ({ page }) => {
		const helpBtns = page.locator(
			'button[aria-label*="Match result"], button[aria-label*="Double Chance"], button[aria-label*="Both Teams to Score"]'
		);
		const count = await helpBtns.count();
		expect(count).toBeGreaterThanOrEqual(1);
	});

	test('tooltip content appears on hover', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.hover();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toBeVisible();
	});

	test('tooltip shows correct text for 1X2', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.hover();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toBeVisible();
		await expect(tooltip).toContainText('Match result');
	});

	test('tooltip hides on mouse leave', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.hover();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toBeVisible();
		await page.mouse.move(0, 0);
		await expect(tooltip).not.toBeVisible();
	});

	test('tooltip appears on focus', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.focus();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toBeVisible();
	});

	test('tooltip disappears on Escape', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.focus();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(tooltip).not.toBeVisible();
	});

	test('tooltip button has aria-describedby when visible', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.hover();
		await expect(helpBtn).toHaveAttribute('aria-describedby', 'tooltip-content');
	});

	test('tooltip button has no aria-describedby when hidden', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		const hasAttr = await helpBtn.getAttribute('aria-describedby');
		expect(hasAttr).toBeNull();
	});

	test('tooltip has role="tooltip"', async ({ page }) => {
		const helpBtn = page.locator('button[aria-label*="Match result"]').first();
		await helpBtn.hover();
		const tooltip = page.locator('#tooltip-content');
		await expect(tooltip).toHaveAttribute('role', 'tooltip');
	});
});
